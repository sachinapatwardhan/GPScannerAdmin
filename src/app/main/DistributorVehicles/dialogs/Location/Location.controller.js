(function () {
    'use strict';

    angular
        .module('app.DistributorVehicle')
        .controller('DistributorLocationController', DistributorLocationController);

    /** @ngInject */
    function DistributorLocationController($http, $mdDialog, $scope, deviceid, Tasks, event, MediaVM, $rootScope, $mdToast, Name, IsOnline) {
        var vm = this;
        var map;
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.AppName = localStorage.getItem('appName');
        //for map icon
        if ($scope.AppName != "Tracking") {
            $scope.OnlineImage = "/assets/images/icon-map-car-on2.png";
            $scope.OfflineImage = "/assets/images/icon-map-car--off2.png";
            $scope.ActiveImage = "/assets/images/icon-map-car-active2.png";
        } else {
            $scope.OnlineImage = "/assets/images/locate-live.png";
            $scope.OfflineImage = "/assets/images/locate-disconnect.png";
            $scope.ActiveImage = "/assets/images/locate-active.png";
        }
        //endicon
        var LastDirection = '000.00';
        var Marker;
        $scope.model = {
            Name: Name,
            CurrentDate: '',
            CurrentSpeed: '0'
        }

        var socket = io($rootScope.Socket_URL, {
            'forceNew': true
        });
        socket.on(deviceid + 'BikeDeviceStatus', function (msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function () {
                if (deviceid == obj.DeviceId) {
                    IsOnline = obj.Status;
                    if (IsOnline == false) {
                        $(".customMarkeroncar").attr("class", "customMarkeroffcar");
                        $(".customMarkeractivecar").attr("class", "customMarkeroffcar");
                    } else {
                        if ($rootScope.IsEngine == false) {
                            $(".customMarkeroffcar").attr("class", "customMarkeractivecar");
                            $(".customMarkeroncar").attr("class", "customMarkeractivecar");
                        } else {
                            $(".customMarkeroffcar").attr("class", "customMarkeroncar");
                            $(".customMarkeractivecar").attr("class", "customMarkeroncar");
                        }
                    }
                }
            });
        });

        socket.on(deviceid + 'BikeRoute', function (msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function () {
                if ($scope.lstlocation) {
                    if (deviceid == obj.Deviceid) {
                        var DeviceDatetime = moment(moment.utc(new Date(obj.Date * 1000)).toDate()).format('DD-MM-YYYY hh:mm:ss a');
                        $scope.model.CurrentDate = DeviceDatetime;
                        $scope.model.CurrentSpeed = parseFloat(obj.Speed).toFixed(2);
                        var lati = parseFloat(obj.Latitude);
                        var long = parseFloat(obj.Longitude);
                        // new CustomMarker12(new google.maps.LatLng(obj.Latitude, obj.Longitude), map, obj.IsEngine, DeviceDatetime, obj.Direction, true)
                        $rootScope.IsEngine == obj.IsEngine;
                        if (IsOnline == false) {
                            $(".customMarkeroncar").attr("class", "customMarkeroffcar");
                            $(".customMarkeractivecar").attr("class", "customMarkeroffcar");
                        } else {
                            if (obj.IsEngine == false) {
                                $(".customMarkeroffcar").attr("class", "customMarkeractivecar");
                                $(".customMarkeroncar").attr("class", "customMarkeractivecar");
                            } else {
                                $(".customMarkeroffcar").attr("class", "customMarkeroncar");
                                $(".customMarkeractivecar").attr("class", "customMarkeroncar");
                            }
                        }
                        map.panTo([lati, long]);
                        if (IsOnline == false) {
                            if ($scope.AppName == "Tracking") {
                                $(".customMarkeroffcar").css('transform', 'rotate(0deg)');
                            } else {
                                var heading = parseFloat(obj.Direction) + 90;
                                $(".customMarkeroffcar").css("transform", 'rotate(' + heading + 'deg)');
                            }
                        } else {
                            if ($rootScope.IsEngine == false) {

                                if ($scope.AppName == "Tracking") {
                                    $(".customMarkeractivecar").css('transform', 'rotate(0deg)');
                                } else {
                                    var heading = parseFloat(obj.Direction) + 90;
                                    $(".customMarkeractivecar").css("transform", 'rotate(' + heading + 'deg)');
                                }
                            } else {
                                var heading = parseFloat(obj.Direction) + 90;
                                $(".customMarkeroncar").css("transform", 'rotate(' + heading + 'deg)');
                            }
                        }
                        Marker.setLatLng([lati, long]);
                    }
                }
            });
        });

        //google map

        $scope.IntializeGoogleMap = function (data) {
            if (data != null) {
                var myOptions;

                var CurrentLat = data.Latitude;
                var CurrentLang = data.Longitude;

                // myOptions = {
                //     center: new google.maps.LatLng(CurrentLat, CurrentLang),
                //     zoom: 16,
                //     mapTypeId: google.maps.MapTypeId.TERRAIN
                // };
                // };
                myOptions = {
                    center: [CurrentLat, CurrentLang],
                    zoom: 16,
                    fullscreenControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    preferCanvas: true
                };

                // var CurrentLatLang = new google.maps.LatLng(CurrentLat, CurrentLang);
                setTimeout(function () {
                    // map = new google.maps.Map(document.getElementById("mapLocation"),
                    //     myOptions);
                    var DeviceDatetime = moment(moment.utc(new Date(data.Date * 1000)).toDate()).format('DD-MM-YYYY hh:mm:ss a');
                    LastDirection = data.Direction;
                    $scope.$apply(function () {
                        $scope.model.CurrentDate = DeviceDatetime;
                        $scope.model.CurrentSpeed = parseFloat(data.Speed).toFixed(2);
                    })
                    if (map) {
                        map.remove();
                    }
                    // new CustomMarker12(new google.maps.LatLng(data.Latitude, data.Longitude), map, data.IsEngine, DeviceDatetime, data.Direction, false)
                    map = L.map(document.getElementById("mapLocation"), myOptions);
                    L.tileLayer($rootScope.MapTile_URL + 'styles/klokantech-basic/{z}/{x}/{y}.png').addTo(map);
                    $rootScope.IsEngine = data.IsEngine;
                    if (IsOnline == false) {
                        var myIcon = L.divIcon({ html: '<div class="customMarkeroffcar"></div>' });
                        Marker = L.marker([data.Latitude, data.Longitude], { icon: myIcon, title: data.Name }).addTo(map);
                        if ($scope.AppName == "Tracking") {
                            $(".customMarkeroffcar").css('transform', 'rotate(0deg)');
                        } else {
                            var heading = parseFloat(data.Direction) + 90;
                            $(".customMarkeroffcar").css("transform", 'rotate(' + heading + 'deg)');
                        }
                    } else {
                        if ($rootScope.IsEngine == false) {
                            var myIcon = L.divIcon({ html: '<div class="customMarkeractivecar"></div>' });
                            Marker = L.marker([data.Latitude, data.Longitude], { icon: myIcon, title: data.Name }).addTo(map);
                            if ($scope.AppName == "Tracking") {
                                $(".customMarkeractivecar").css('transform', 'rotate(0deg)');
                            } else {
                                var heading = parseFloat(data.Direction) + 90;
                                $(".customMarkeractivecar").css("transform", 'rotate(' + heading + 'deg)');
                            }
                        } else {
                            var myIcon = L.divIcon({ html: '<div class="customMarkeroncar"></div>' });
                            Marker = L.marker([data.Latitude, data.Longitude], { icon: myIcon, title: data.Name }).addTo(map);
                            var heading = parseFloat(data.Direction) + 90;
                            $(".customMarkeroncar").css("transform", 'rotate(' + heading + 'deg)');
                        }
                    }
                    // $ionicLoading.hide();
                }, 800)
            } else {
                $scope.NoLocation = "No Location Found";
                var myOptions = {
                    center: [0, 0],
                    zoom: 16,
                    fullscreenControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    preferCanvas: true
                };
                map = L.map(document.getElementById("mapLocation"), myOptions);
                L.tileLayer($rootScope.MapTile_URL + 'styles/klokantech-basic/{z}/{x}/{y}.png').addTo(map);

            }
        }

        $scope.GetBikeGps = function (flag) {
            var params = {
                DeviceId: deviceid,
            }

            $http.get($rootScope.RoutePath + 'vehicles/GetVehicleCurrentLocation', { params: params }).success(function (data) {
                $scope.lstlocation = data.data;
                $scope.IntializeGoogleMap($scope.lstlocation);

            });


        }

        $scope.GetBikeGps(false);

        //adapted from http://gmaps-samples-v3.googlecode.com/svn/trunk/overlayview/custommarker.html
        // function CustomMarker12(latlng, mapLocation, IsEngine, LocalTime, direction, isAnimation) {
        //     this.latlng_ = latlng;
        //     this.datetime = LocalTime;

        //     if (direction != '000.00') {
        //         LastDirection = direction;
        //     }
        //     this.direction = LastDirection;
        //     this.IsAnimation = isAnimation;
        //     this.IsEngineStatus = IsEngine;
        //     $rootScope.IsEngine = this.IsEngineStatus;
        //     this.setMap(mapLocation);
        // }


        // CustomMarker12.prototype = new google.maps.OverlayView();
        // CustomMarker12.prototype.draw = function() {

        //     var div = null;
        //     var CustomeInfoWindowdiv = null;
        //     // var DrivingDataDiv = null;
        //     var animatCustomeInfoWindowdiv = null;
        //     var animatediv = null;
        //     if (IsOnline == false) {
        //         div = this.div_ = $('.customMarkeroffcar')[0];
        //         animatediv = $('.customMarkeroffcar');
        //     } else {
        //         if ($rootScope.IsEngine == false) {
        //             div = this.div_ = $('.customMarkeractivecar')[0];
        //             animatediv = $('.customMarkeractivecar');
        //         } else {
        //             div = this.div_ = $('.customMarkeroncar')[0];
        //             animatediv = $('.customMarkeroncar');
        //         }
        //     }
        //     CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = $('.custom-infowinow')[0];
        //     animatCustomeInfoWindowdiv = $('.custom-infowinow');
        //     if (!div) {
        //         div = this.div_ = document.createElement('div');

        //         // CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = document.createElement('div');

        //         // CustomeInfoWindowdiv.className = 'custom-infowinow';
        //         if (IsOnline == false) {
        //             div.className = "customMarkeroffcar";
        //         } else {
        //             if ($rootScope.IsEngine == false) {
        //                 div.className = "customMarkeractivecar";
        //             } else {
        //                 div.className = "customMarkeroncar";
        //             }
        //         }

        //         // var BikeNameP = document.createElement("div");
        //         // var leftDiv = document.createElement("div");
        //         // var RightDiv = document.createElement("div");
        //         // var closeBtn = document.createElement("div");

        //         // if ($scope.IsEngine == true) {
        //         // if (this.isAddress) {
        //         //     BikeNameP.innerHTML = '<div class="MapMarkerLable"><h3>' + $stateParams.Name + '</h3><div class="content"><div class="col2"><i class="ion-ios-clock" style="color:green;"></i><span class="localDate">' + this.datetime + '</span></div><div class="col2"><i class="ion-ios-speedometer localSpeedSymbol" style="color:green;"></i><span class="localSpeed">' + $scope.objPetLocation.Speed + ' km/h</span></div><div class="col2"><i class="ion-gear-b localEngineSymbol" style="color:green;"></i><span class="localEngine"> ' + this.IsEngineStatus + ' </span></div><div class="col2"><i class="ion-ios-location" style="color:blue;"></i><span class="newAddress">' + this.newlocation + '</span></div></div></div>';
        //         // } else {
        //         //     BikeNameP.innerHTML = '<div class="MapMarkerLable"><h3>' + $stateParams.Name + '</h3><div class="content"><div class="col2"><i class="ion-ios-clock" style="color:green;"></i><span class="localDate">' + this.datetime + '</span></div><div class="col2"><i class="ion-ios-speedometer localSpeedSymbol" style="color:green;"></i><span class="localSpeed">' + $scope.objPetLocation.Speed + ' km/h</span></div><div class="col2"><i class="ion-gear-b localEngineSymbol" style="color:green;"></i><span class="localEngine"> ' + this.IsEngineStatus + ' </span></div></div></div>';
        //         // }


        //         // $(leftDiv).addClass('leftside');
        //         // leftDiv.innerHTML = '<span> </span>';
        //         // $(RightDiv).addClass('rightside');
        //         // RightDiv.innerHTML = '<span> </span>';
        //         // $(closeBtn).addClass('closeBtn');

        //         // CustomeInfoWindowdiv.appendChild(BikeNameP);
        //         // CustomeInfoWindowdiv.appendChild(leftDiv);
        //         // CustomeInfoWindowdiv.appendChild(RightDiv);
        //         // CustomeInfoWindowdiv.appendChild(closeBtn);

        //         // google.maps.event.addDomListener(div, "click", function(event) {
        //         //     $(".custom-infowinow").css("visibility", "visible");
        //         // });

        //         var panes = this.getPanes();
        //         panes.overlayImage.appendChild(div);
        //         // panes.overlayImage.appendChild(CustomeInfoWindowdiv);

        //         // $(".closeBtn").click(function() {
        //         //     $(".custom-infowinow").css("visibility", "hidden");
        //         // });

        //         if (IsOnline == false) {
        //             animatediv = $('.customMarkeroffcar');
        //         } else {
        //             if (this.IsEngineStatus == false) {
        //                 animatediv = $('.customMarkeractivecar');
        //             } else {
        //                 animatediv = $('.customMarkeroncar');
        //             }
        //         }
        //     }

        //     // $(".localDate").text(this.datetime);
        //     // // $(".newAddress").text(this.newlocation);
        //     // $(".localEngine").text(this.IsEngineStatus);
        //     // $(".localSpeed").text($scope.objPetLocation.Speed + " km/h");

        //     var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

        //     if (point) {

        //         if (this.IsAnimation == true) {

        //             animatediv.animate({
        //                 'left': point.x + 'px',
        //                 'top': point.y + 'px'
        //             }, 1000, function() {});

        //             // animatCustomeInfoWindowdiv.animate({
        //             //     'left': (point.x - 125) + 'px',
        //             //     'top': (point.y - 230) + 'px'
        //             // }, 800, function() {});

        //             this.IsAnimation = false;
        //             if ($scope.AppName == "Tracking") {
        //                 if (IsOnline == true && $rootScope.IsEngine == true) {
        //                     var heading = parseFloat(this.direction) + 90;
        //                     div.style.transform = 'rotate(' + heading + 'deg)';
        //                     animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
        //                 } else {
        //                     div.style.transform = 'rotate(0deg)';
        //                     animatediv.css('-webkit-transform', 'rotate(0deg)');
        //                 }
        //             } else {
        //                 var heading = parseFloat(this.direction) + 90;
        //                 div.style.transform = 'rotate(' + heading + 'deg)';
        //                 animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
        //             }
        //         } else {
        //             div.style.left = point.x + 'px';
        //             div.style.top = point.y + 'px';
        //             // CustomeInfoWindowdiv.style.left = (point.x - 125) + 'px';
        //             // CustomeInfoWindowdiv.style.top = (point.y - 230) + 'px';
        //             if ($scope.AppName == "Tracking") {
        //                 if (IsOnline == true && $rootScope.IsEngine == true) {
        //                     var heading = parseFloat(this.direction) + 90;
        //                     div.style.transform = 'rotate(' + heading + 'deg)';
        //                     animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
        //                 } else {
        //                     div.style.transform = 'rotate(0deg)';
        //                     animatediv.css('-webkit-transform', 'rotate(0deg)');
        //                 }
        //             } else {
        //                 var heading = parseFloat(this.direction) + 90;
        //                 div.style.transform = 'rotate(' + heading + 'deg)';
        //                 animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
        //             }
        //         }
        //     }
        // };


        // CustomMarker12.prototype.animateBounce = function() {
        //     dynamics.stop(this.div_);
        //     dynamics.css(this.div_, {
        //         'transform': 'none',
        //     });
        //     dynamics.animate(this.div_, {
        //         scale: 1.1
        //     }, {
        //         type: dynamics.forceWithGravity,
        //         complete: function(o) {
        //             dynamics.stop(o);
        //             dynamics.css(o, {
        //                 'transform': 'none',
        //             });
        //         }
        //     });
        // }

        // CustomMarker12.prototype.remove = function() {
        //     if (this.div_) {
        //         this.div_.parentNode.removeChild(this.div_);
        //         this.div_ = null;
        //     }
        // };

        // CustomMarker12.prototype.getPosition = function() {
        //     return this.latlng_;
        // };

        $scope.closeModel = function () {
            socket.disconnect();
            $mdDialog.hide();
        }
    }
})();