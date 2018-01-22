(function() {
    'use strict';

    angular
        .module('app.Vehicle')
        .controller('Location1Controller', Location1Controller);

    /** @ngInject */
    function Location1Controller($http, $mdDialog, $scope, deviceid, Tasks, event, MediaVM, $rootScope, $mdToast, Name, IsOnline) {
        var vm = this;
        var map;
        $scope.RoutePath = $rootScope.RoutePath;
        var LastDirection = '000.00';

        $scope.model = {
            Name: Name,
            CurrentDate: '',
            CurrentSpeed: '0'
        }

        var socket = io($rootScope.Socket_URL, {
            'forceNew': true
        });
        socket.on(deviceid + 'BikeDeviceStatus', function(msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function() {
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

        socket.on(deviceid + 'BikeRoute', function(msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function() {
                if ($scope.lstlocation) {
                    if (deviceid == obj.Deviceid) {
                        var DeviceDatetime = moment(moment.utc(new Date(obj.Date * 1000)).toDate()).format('DD-MM-YYYY hh:mm:ss a');
                        $scope.model.CurrentDate = DeviceDatetime;
                        $scope.model.CurrentSpeed = obj.Speed.toFixed(2);
                        new CustomMarker12(new google.maps.LatLng(obj.Latitude, obj.Longitude), map, obj.IsEngine, DeviceDatetime, obj.Direction, true)
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
                    }
                }
            });
        });

        //google map
        $scope.IntializeGoogleMap = function(data) {
            if (data != null) {
                var myOptions;

                var CurrentLat = data.Latitude;
                var CurrentLang = data.Longitude;

                myOptions = {
                    center: new google.maps.LatLng(CurrentLat, CurrentLang),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };
                // };

                var CurrentLatLang = new google.maps.LatLng(CurrentLat, CurrentLang);

                setTimeout(function() {
                    map = new google.maps.Map(document.getElementById("mapLocation"),
                        myOptions);
                    var DeviceDatetime = moment(moment.utc(new Date(data.Date * 1000)).toDate()).format('DD-MM-YYYY hh:mm:ss a');
                    LastDirection = data.Direction;
                    $scope.$apply(function() {
                        $scope.model.CurrentDate = DeviceDatetime;
                        $scope.model.CurrentSpeed = parseFloat(data.Speed).toFixed(2);
                    })
                    new CustomMarker12(new google.maps.LatLng(data.Latitude, data.Longitude), map, data.IsEngine, DeviceDatetime, data.Direction, false)

                    // $ionicLoading.hide();
                }, 800)
            } else {
                $scope.NoLocation = "No Location Found"
                map = new google.maps.Map(document.getElementById('mapLocation'), {
                    center: { lat: 0, lng: 0 },
                    zoom: 2
                });

            }
        }

        $scope.GetBikeGps = function(flag) {
            var params = {
                DeviceId: deviceid,
            }

            $http.get($rootScope.RoutePath + 'vehicles/GetVehicleCurrentLocation', { params: params }).success(function(data) {
                $scope.lstlocation = data.data;
                $scope.IntializeGoogleMap($scope.lstlocation);

            });


        }

        $scope.GetBikeGps(false);

        //adapted from http://gmaps-samples-v3.googlecode.com/svn/trunk/overlayview/custommarker.html
        function CustomMarker12(latlng, mapLocation, IsEngine, LocalTime, direction, isAnimation) {
            this.latlng_ = latlng;
            this.datetime = LocalTime;

            if (direction != '000.00') {
                LastDirection = direction;
            }
            this.direction = LastDirection;
            this.IsAnimation = isAnimation;
            this.IsEngineStatus = IsEngine;
            $rootScope.IsEngine = this.IsEngineStatus;
            this.setMap(mapLocation);
        }


        CustomMarker12.prototype = new google.maps.OverlayView();
        CustomMarker12.prototype.draw = function() {

            var div = null;
            var CustomeInfoWindowdiv = null;
            // var DrivingDataDiv = null;
            var animatCustomeInfoWindowdiv = null;
            var animatediv = null;
            if (IsOnline == false) {
                div = this.div_ = $('.customMarkeroffcar')[0];
                animatediv = $('.customMarkeroffcar');
            } else {
                if ($rootScope.IsEngine == false) {
                    div = this.div_ = $('.customMarkeractivecar')[0];
                    animatediv = $('.customMarkeractivecar');
                } else {
                    div = this.div_ = $('.customMarkeroncar')[0];
                    animatediv = $('.customMarkeroncar');
                }
            }
            CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = $('.custom-infowinow')[0];
            animatCustomeInfoWindowdiv = $('.custom-infowinow');
            if (!div) {
                div = this.div_ = document.createElement('div');

                // CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = document.createElement('div');

                // CustomeInfoWindowdiv.className = 'custom-infowinow';
                if (IsOnline == false) {
                    div.className = "customMarkeroffcar";
                } else {
                    if ($rootScope.IsEngine == false) {
                        div.className = "customMarkeractivecar";
                    } else {
                        div.className = "customMarkeroncar";
                    }
                }

                // var BikeNameP = document.createElement("div");
                // var leftDiv = document.createElement("div");
                // var RightDiv = document.createElement("div");
                // var closeBtn = document.createElement("div");

                // if ($scope.IsEngine == true) {
                // if (this.isAddress) {
                //     BikeNameP.innerHTML = '<div class="MapMarkerLable"><h3>' + $stateParams.Name + '</h3><div class="content"><div class="col2"><i class="ion-ios-clock" style="color:green;"></i><span class="localDate">' + this.datetime + '</span></div><div class="col2"><i class="ion-ios-speedometer localSpeedSymbol" style="color:green;"></i><span class="localSpeed">' + $scope.objPetLocation.Speed + ' km/h</span></div><div class="col2"><i class="ion-gear-b localEngineSymbol" style="color:green;"></i><span class="localEngine"> ' + this.IsEngineStatus + ' </span></div><div class="col2"><i class="ion-ios-location" style="color:blue;"></i><span class="newAddress">' + this.newlocation + '</span></div></div></div>';
                // } else {
                //     BikeNameP.innerHTML = '<div class="MapMarkerLable"><h3>' + $stateParams.Name + '</h3><div class="content"><div class="col2"><i class="ion-ios-clock" style="color:green;"></i><span class="localDate">' + this.datetime + '</span></div><div class="col2"><i class="ion-ios-speedometer localSpeedSymbol" style="color:green;"></i><span class="localSpeed">' + $scope.objPetLocation.Speed + ' km/h</span></div><div class="col2"><i class="ion-gear-b localEngineSymbol" style="color:green;"></i><span class="localEngine"> ' + this.IsEngineStatus + ' </span></div></div></div>';
                // }


                // $(leftDiv).addClass('leftside');
                // leftDiv.innerHTML = '<span> </span>';
                // $(RightDiv).addClass('rightside');
                // RightDiv.innerHTML = '<span> </span>';
                // $(closeBtn).addClass('closeBtn');

                // CustomeInfoWindowdiv.appendChild(BikeNameP);
                // CustomeInfoWindowdiv.appendChild(leftDiv);
                // CustomeInfoWindowdiv.appendChild(RightDiv);
                // CustomeInfoWindowdiv.appendChild(closeBtn);

                // google.maps.event.addDomListener(div, "click", function(event) {
                //     $(".custom-infowinow").css("visibility", "visible");
                // });

                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
                // panes.overlayImage.appendChild(CustomeInfoWindowdiv);

                // $(".closeBtn").click(function() {
                //     $(".custom-infowinow").css("visibility", "hidden");
                // });

                if (IsOnline == false) {
                    animatediv = $('.customMarkeroffcar');
                } else {
                    if (this.IsEngineStatus == false) {
                        animatediv = $('.customMarkeractivecar');
                    } else {
                        animatediv = $('.customMarkeroncar');
                    }
                }
            }

            // $(".localDate").text(this.datetime);
            // // $(".newAddress").text(this.newlocation);
            // $(".localEngine").text(this.IsEngineStatus);
            // $(".localSpeed").text($scope.objPetLocation.Speed + " km/h");

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

            if (point) {

                if (this.IsAnimation == true) {

                    animatediv.animate({
                        'left': point.x + 'px',
                        'top': point.y + 'px'
                    }, 1000, function() {});

                    // animatCustomeInfoWindowdiv.animate({
                    //     'left': (point.x - 125) + 'px',
                    //     'top': (point.y - 230) + 'px'
                    // }, 800, function() {});

                    this.IsAnimation = false;

                    var heading = parseFloat(this.direction) + 90;
                    div.style.transform = 'rotate(' + heading + 'deg)';
                    animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
                } else {
                    div.style.left = point.x + 'px';
                    div.style.top = point.y + 'px';
                    // CustomeInfoWindowdiv.style.left = (point.x - 125) + 'px';
                    // CustomeInfoWindowdiv.style.top = (point.y - 230) + 'px';

                    var heading = parseFloat(this.direction) + 90;
                    div.style.transform = 'rotate(' + heading + 'deg)';
                    animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
                }
            }
        };


        CustomMarker12.prototype.animateBounce = function() {
            dynamics.stop(this.div_);
            dynamics.css(this.div_, {
                'transform': 'none',
            });
            dynamics.animate(this.div_, {
                scale: 1.1
            }, {
                type: dynamics.forceWithGravity,
                complete: function(o) {
                    dynamics.stop(o);
                    dynamics.css(o, {
                        'transform': 'none',
                    });
                }
            });
        }

        CustomMarker12.prototype.remove = function() {
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            }
        };

        CustomMarker12.prototype.getPosition = function() {
            return this.latlng_;
        };

        $scope.closeModel = function() {
            socket.disconnect();
            $mdDialog.hide();
        }
    }
})();