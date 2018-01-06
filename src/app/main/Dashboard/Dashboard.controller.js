(function() {
    'use strict';

    angular
        .module('app.Dashboard')
        .controller('DashboardController', DashboardController);

    function DashboardController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout, $filter) {

        var vm = this;
        var map;
        var socket = io($rootScope.Socket_URL, {
            'forceNew': true
        });

        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $scope.AppName = localStorage.getItem('appName');
        $scope.selectAppName = $scope.AppName;

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetAllInfoList();
        $scope.selectedAppName = function(o) {
            if (o != 'All') {
                $scope.selectAppName = o.AppName;
                $rootScope.appId = o.id;
                $scope.AppName = o.AppName;
            } else {
                $scope.selectAppName = 'All';
                $rootScope.appId = '';
                $scope.AppName = '';
            }

            $scope.init();
            $scope.getCurrentLocation(false);
        }

        function callDeviceStatus() {
            for (var t = 0; t < $scope.lstActiveVehicle.length; t++) {
                socket.on($scope.lstActiveVehicle[t].deviceid + 'BikeDeviceStatus', function(msg) {
                    var obj = JSON.parse(msg);
                    $scope.$apply(function() {
                        if ($scope.lstDevices != undefined) {
                            if ($scope.lstActiveVehicle != null && $scope.lstActiveVehicle != undefined) {
                                for (var i = 0; i < $scope.lstActiveVehicle.length; i++) {
                                    if ($scope.lstActiveVehicle[t].deviceid == obj.DeviceId) {
                                        $scope.lstActiveVehicle[t].IsOnline = obj.Status;
                                        $scope.ActiveDevice = _.where($scope.lstActiveVehicle, { IsOnline: true });
                                        $scope.NotActiveDevice = _.where($scope.lstActiveVehicle, { IsOnline: false });
                                        var VehicleID = $scope.lstActiveVehicle[t].Name;
                                        new CustomMarker(new google.maps.LatLng($scope.lstActiveVehicle[t].Latitude, $scope.lstActiveVehicle[t].Longitude), map, VehicleID, $scope.lstActiveVehicle[t])
                                    }
                                }
                            }
                        }
                    });
                });

                socket.on($scope.lstActiveVehicle[t].deviceid + 'BikeRoute', function(msg) {
                    var obj = JSON.parse(msg);
                    $scope.$apply(function() {
                        if ($scope.lstActiveVehicle) {
                            var lstVehicle = _.filter($scope.lstActiveVehicle, { deviceid: obj.Deviceid });
                            if (lstVehicle != null && lstVehicle != undefined && lstVehicle != '' && lstVehicle.length > 0) {
                                var objVehicle = lstVehicle[0];
                                objVehicle.Date = obj.Date;
                                objVehicle.IsEngine = obj.IsEngine;
                                objVehicle.Speed = parseFloat(obj.Speed).toFixed(2);
                                objVehicle.Direction = obj.Direction;
                                objVehicle.Latitude = obj.Latitude;
                                objVehicle.Longitude = obj.Longitude;

                                var VehicleID = objVehicle.Name;

                                new CustomMarker(new google.maps.LatLng(objVehicle.Latitude, objVehicle.Longitude), map, VehicleID, objVehicle)
                            };
                        }
                    });
                });
            }
        }

        $scope.$on('$stateChangeStart', function(e, to) {
            socket.disconnect();
        });

        $scope.init = function() {
            $scope.model = {
                Year: '',
                MonthId: '',
                CountryName: 'All',
                YearAcc: '',
                MonthIdAcc: '',
                CountryNameAcc: 'All',
            }
            $scope.flgshow = 0;
            $scope.FlgSuperAdmin = false;
            $rootScope.UserRoles = $cookieStore.get('UserRoles');
            if ($rootScope.UserRoles.length > 0) {
                for (var i = 0; i < $rootScope.UserRoles.length; i++) {
                    if ($rootScope.UserRoles[i] == "Super Admin") {
                        $scope.FlgSuperAdmin = true;
                    }
                }
            }

            $scope.GetDashboardCount();
            $scope.ManageGraph();
            $scope.GetCustomer();
            $scope.TotalCustomerbyCountry();
            // $scope.GetAllDevice();
            $scope.GetAllMontName();
            $scope.GetAllYearName();

            $scope.TotalShopperCustomer = 0;
            $scope.TotalOwnerCustomer = 0;
            $scope.GetAllExpiredDevice();
        }
        $scope.GetAllMontName = function() {
            $scope.listMonthName = [
                { id: 1, name: "Jan" },
                { id: 2, name: "Feb" },
                { id: 3, name: "Mar" },
                { id: 4, name: "Apr" },
                { id: 5, name: "May" },
                { id: 6, name: "Jun" },
                { id: 7, name: "Jul" },
                { id: 8, name: "Aug" },
                { id: 9, name: "Sep" },
                { id: 10, name: "Oct" },
                { id: 11, name: "Nov" },
                { id: 12, name: "Dec" }
            ];
        }
        $scope.GetAllYearName = function() {
            $scope.listYear = [];
            for (var j = 2015; j <= new Date().getFullYear(); j++) {
                var obj = new Object();
                obj.YearName = j;
                $scope.listYear.push(obj);
            }
        }

        //google map start
        $scope.IntializeGoogleMap = function(Redirectflag) {

            var myOptions;

            var CurrentLat = 0;
            var CurrentLang = 0;
            myOptions = {
                center: new google.maps.LatLng(CurrentLat, CurrentLang),
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };

            var CurrentLatLang = new google.maps.LatLng(CurrentLat, CurrentLang);

            setTimeout(function() {
                map = new google.maps.Map(document.getElementById("map123"),
                    myOptions);
                // var MethodCallFlag = true;

                var FoundLocation = 0;
                $http.get($rootScope.RoutePath + 'dashboard/GetAllWorkingBike?idApp=' + $rootScope.appId).success(function(data) {
                    $scope.lstActiveVehicle = data.data;
                    callDeviceStatus();
                    for (var i = 0; i < $scope.lstActiveVehicle.length; i++) {
                        if ($scope.lstActiveVehicle[i].IsOnline == null) {
                            $scope.lstActiveVehicle[i].IsOnline = 0;
                        }
                    }
                    $scope.ActiveDevice = _.where($scope.lstActiveVehicle, { IsOnline: 1 });
                    $scope.NotActiveDevice = _.where($scope.lstActiveVehicle, { IsOnline: 0 });

                    function setActiveVehicle(i) {
                        if (i < $scope.lstActiveVehicle.length) {
                            var ImageURL = '';
                            // var IsWireCut = $scope.lstActiveVehicle[i].IsWireCut;
                            var VehicleID = $scope.lstActiveVehicle[i].Name;
                            var objVehicle = $scope.lstActiveVehicle[i];
                            if ($scope.lstActiveVehicle[i].Latitude != null && $scope.lstActiveVehicle[i].Longitude != null) {
                                new CustomMarker(new google.maps.LatLng($scope.lstActiveVehicle[i].Latitude, $scope.lstActiveVehicle[i].Longitude), map, VehicleID, objVehicle)
                            }
                            setActiveVehicle(i + 1);
                        }
                    }
                    setActiveVehicle(0);
                });
                //     };
                // });

                if ($scope.CurrentLatitude != '' && $scope.CurrentLongitude != '') {} else {
                    if (Redirectflag) {
                        MethodCallFlag = true;
                    } else {
                        $scope.getCurrentLocation(true);
                    }
                }
            })
        }

        $scope.getCurrentLocation = function(flag) {
            var posOptions = { timeout: 7000, enableHighAccuracy: false };
            try {
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                    $scope.CurrentLatitude = position.coords.latitude;
                    $scope.CurrentLongitude = position.coords.longitude;
                    $scope.IntializeGoogleMap(flag);
                }, function(err) {
                    $scope.IntializeGoogleMap(flag);
                });
            } catch (ex) {
                $scope.IntializeGoogleMap(flag);
            }
        }

        $scope.getCurrentLocation(false);

        function CustomMarker(latlng, map, VehicleID, objVehicle) {
            this.latlng_ = latlng;
            // this.imageSrc = imageSrc;
            this.VehicleID = VehicleID;
            this.objVehicle = objVehicle;
            // this.IsOnline = objVehicle.IsOnline;
            // this.IsEngine = objVehicle.IsEngine;
            // this.Authorised = Authorised;

            // Once the LatLng and text are set, add the overlay to the map.  This will
            // trigger a call to panes_changed which should in turn call draw.
            this.setMap(map);
        }

        CustomMarker.prototype = new google.maps.OverlayView();
        CustomMarker.prototype.draw = function() {
            var div = null;
            var animatediv = null;

            var CustomeInfoWindowdiv = null;
            var animatCustomeInfoWindowdiv = null;

            var EngineStatus = 'Engine OFF';

            if (this.objVehicle.IsEngine == true) {
                EngineStatus = 'Engine ON';
            }

            var DeviceDatetime = moment(moment.utc(new Date(this.objVehicle.Date * 1000)).toDate()).format('DD-MM-YYYY hh:mm:ss a');


            div = this.div_ = $('.customMarkercar.' + this.objVehicle.deviceid)[0];
            animatediv = $('.customMarkercar.' + this.objVehicle.deviceid);

            CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = $('.custom-infowinow.' + this.objVehicle.deviceid)[0];
            animatCustomeInfoWindowdiv = $('.custom-infowinow.' + this.objVehicle.deviceid);

            if (!div) {
                div = this.div_ = document.createElement('div');
                // var TextDiv = document.createElement("div");
                // TextDiv.innerHTML = this.objVehicle.Name;


                CustomeInfoWindowdiv = this.CustomeInfoWindowdiv_ = document.createElement('div');

                CustomeInfoWindowdiv.className = 'custom-infowinow ' + this.objVehicle.deviceid;

                if (this.objVehicle.IsOnline == false) {
                    div.className = "customMarkercar offline " + this.objVehicle.deviceid;
                    // $(TextDiv).addClass('my-text-shadow offline');
                } else {
                    if (this.objVehicle.IsEngine == false) {
                        div.className = "customMarkercar active " + this.objVehicle.deviceid;
                        // $(TextDiv).addClass('my-text-shadow active');
                    } else {
                        div.className = "customMarkercar online " + this.objVehicle.deviceid;
                        // $(TextDiv).addClass('my-text-shadow online');
                    }
                }

                var BikeNameP = document.createElement("div");
                var leftDiv = document.createElement("div");
                var RightDiv = document.createElement("div");
                var closeBtn = document.createElement("div");

                BikeNameP.innerHTML = '<div class="MapMarkerLable"><h3>' + this.objVehicle.Name + '</h3><div class="content"><div class="col2"><i class="ion-ios-clock" style="color:green;"></i><span class="localDate ' + this.objVehicle.deviceid + '">' + DeviceDatetime + '</span></div><div class="col2"><i class="ion-ios-speedometer localSpeedSymbol" style="color:green;"></i><span class="localSpeed ' + this.objVehicle.deviceid + '">' + parseFloat(this.objVehicle.Speed).toFixed(2) + ' km/h</span></div><div class="col2"><i class="ion-gear-b localEngineSymbol" style="color:green;"></i><span class="localEngine ' + this.objVehicle.deviceid + '"> ' + EngineStatus + ' </span></div></div></div>';

                $(leftDiv).addClass('leftside');
                leftDiv.innerHTML = '<span> </span>';
                $(RightDiv).addClass('rightside');
                RightDiv.innerHTML = '<span> </span>';
                $(closeBtn).addClass('closeBtn ' + this.objVehicle.deviceid);

                CustomeInfoWindowdiv.appendChild(BikeNameP);
                CustomeInfoWindowdiv.appendChild(leftDiv);
                CustomeInfoWindowdiv.appendChild(RightDiv);
                CustomeInfoWindowdiv.appendChild(closeBtn);

                CustomeInfoWindowdiv.style.visibility = "hidden";

                // $(TextDiv).addClass('my-text-shadow');
                // div.appendChild(TextDiv);

                google.maps.event.addDomListener(div, "click", function(event) {

                    var lstclassName = event.srcElement.className.split(' ')
                    var DeviceID = "";
                    for (var t = 0; t < lstclassName.length; t++) {
                        if (lstclassName[t] != "customMarkercar" && lstclassName[t] != "active" && lstclassName[t] != "online" && lstclassName[t] != "offline") {
                            DeviceID = lstclassName[t];
                        }
                    }
                    $(".custom-infowinow." + DeviceID).css("visibility", "visible");

                });

                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
                panes.overlayImage.appendChild(CustomeInfoWindowdiv);
                // panes.overlayImage.appendChild(DrivingDataDiv);

                // $(".custom-driving-infowinow").css("visibility", "hidden");

                $(".closeBtn." + this.objVehicle.deviceid).click(function(event) {

                    var lstclassName = event.currentTarget.className.split(' ');
                    var DeviceID = "";
                    for (var t = 0; t < lstclassName.length; t++) {
                        if (lstclassName[t] != "customMarkercar" && lstclassName[t] != "active" && lstclassName[t] != "online" && lstclassName[t] != "offline") {
                            DeviceID = lstclassName[t];
                        }
                    }
                    $(".custom-infowinow." + DeviceID).css("visibility", "hidden");
                });

                if (this.objVehicle.IsOnline == false) {
                    animatediv = $('.customMarkercar.' + this.objVehicle.deviceid);
                } else {
                    if (this.objVehicle.IsEngine == false) {
                        animatediv = $('.customMarkercar.' + this.objVehicle.deviceid);
                    } else {
                        animatediv = $('.customMarkercar.' + this.objVehicle.deviceid);
                    }
                }
            } else {
                if (this.objVehicle.IsOnline == false) {
                    $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("online");
                    $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("active");
                    $('.customMarkercar.' + this.objVehicle.deviceid).addClass("offline");

                    // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("online");
                    // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("active");
                    // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').addClass("offline");

                } else {
                    if (this.objVehicle.IsEngine == false) {
                        $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("online");
                        $('.customMarkercar.' + this.objVehicle.deviceid).addClass("active");
                        $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("offline");

                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("online");
                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').addClass("active");
                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("offline");
                    } else {
                        $('.customMarkercar.' + this.objVehicle.deviceid).addClass("online");
                        $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("active");
                        $('.customMarkercar.' + this.objVehicle.deviceid).removeClass("offline");

                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').addClass("online");
                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("active");
                        // $('.customMarkercar.' + this.objVehicle.deviceid + ' .my-text-shadow').removeClass("offline");
                    }
                }
            }

            $(".localDate." + this.objVehicle.deviceid).text(DeviceDatetime);
            $(".localEngin." + this.objVehicle.deviceid).text(EngineStatus);
            $(".localSpeed." + this.objVehicle.deviceid).text(parseFloat(this.objVehicle.Speed).toFixed(2) + " km/h");


            var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

            if (point) {
                if (this.IsAnimation == true) {
                    $scope.IsAnimationStart = true;
                    animatediv.animate({
                        'left': point.x + 'px',
                        'top': point.y + 'px'
                    }, 1000, function() {});

                    setTimeout(function() {
                        $scope.IsAnimationStart = false;
                    }, 1200);

                    animatCustomeInfoWindowdiv.animate({
                        'left': (point.x - 125) + 'px',
                        'top': (point.y - 180) + 'px'
                    }, 800, function() {});

                    this.IsAnimation = false;
                    var heading = parseFloat(this.objVehicle.Direction) + 90;
                    div.style.transform = 'rotate(' + heading + 'deg)';
                    animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
                } else {
                    $scope.IsAnimationStart = true;
                    setTimeout(function() {
                        $scope.IsAnimationStart = false;
                    }, 10);
                    div.style.left = point.x + 'px';
                    div.style.top = point.y + 'px';

                    CustomeInfoWindowdiv.style.left = (point.x - 125) + 'px';
                    CustomeInfoWindowdiv.style.top = (point.y - 180) + 'px';

                    var heading = parseFloat(this.objVehicle.Direction) + 90;
                    div.style.transform = 'rotate(' + heading + 'deg)';
                    animatediv.css('-webkit-transform', 'rotate(' + heading + 'deg)');
                }
            }
        };

        CustomMarker.prototype.remove = function() {
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            }
        };

        CustomMarker.prototype.getPosition = function() {
            return this.latlng_;
        };

        $scope.ManageCustomerGraph = function() {
            var params = {
                // countryName: null,
                // CountryList: $rootScope.CountryList,
                // IsSuperAdmin: $scope.FlgSuperAdmin,
                idApp: $rootScope.appId,
            }
            $http.get($rootScope.RoutePath + "dashboard/GetGraphCustomer", { params: params }).then(function(data) {
                $scope.lstCustomerGraph = data.data.UserData;

                $scope.lstCountry = [];
                for (var i = 0; i < $scope.lstCustomerGraph.length; i++) {
                    if ($scope.lstCustomerGraph[i].country == '' || $scope.lstCustomerGraph[i].country == null) {
                        $scope.lstCustomerGraph[i].country = 'Other';
                    }
                    if ($scope.lstCountry.length != 0) {
                        var obj = _.findWhere($scope.lstCountry, { Country: $scope.lstCustomerGraph[i].country });
                        if (obj != null && obj != undefined && obj != "") {

                        } else {
                            var obj1 = new Object();
                            obj1.Country = $scope.lstCustomerGraph[i].country;
                            $scope.lstCountry.push(obj1);
                        }
                    } else {
                        var obj1 = new Object();
                        obj1.Country = $scope.lstCustomerGraph[i].country;
                        $scope.lstCountry.push(obj1);
                    }
                }

                $timeout(function() {
                    $scope.CustomerAndUser(false);
                    $scope.CustomerAndUserAcc(false);
                    $scope.CustomerGraph();
                }, 300);

            });
        }
        $scope.CustomerAndUser = function(flag) {
            $scope.weekDays = '';
            $scope.weekMonths = '';
            var currentDate = moment();
            var weekStart = currentDate.clone().startOf('days');
            $scope.days = [];
            $scope.months = [];
            $scope.lstUser = [];
            $scope.lstCustomer = [];
            for (var i = 0; i <= 30; i++) {
                $scope.days.push(moment(weekStart).subtract(i, 'days').format("Do"));
                $scope.months.push(moment(weekStart).subtract(i, 'month').format("M"));
            };

            var custDate = new Date(),
                locale = "en-us",
                stingmonth = custDate.toLocaleString(locale, { month: "long" });
            $scope.custCurrentYear = custDate.getFullYear();
            $scope.custCurrentMonth = custDate.getMonth() + 1;
            $scope.custCurrentDay = custDate.getDate();
            var daywiseuserlist = [];
            var labelsday = [];
            $scope.model.Year = "0";
            $scope.model.MonthId = "0";
            if (flag == false) {
                $scope.model.CountryName = 'All';
            }
            for (var i = 0; i < 30; i++) {

                var date = $scope.custCurrentDay + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                var objCustomer = new Object();
                objCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();

                if ($scope.model.CountryName == 'All') {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay)) {
                            return item;
                        }
                    });
                    // var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                    //         return item;
                    //     }
                    // });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                    // var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                    //         return item;
                    //     }
                    // });
                } else {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                    // var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                    //         return item;
                    //     }
                    // });
                }


                objCustomer.y = Customer.length;
                $scope.lstCustomer.push(objCustomer);

                // var objOwnerCustomer = new Object();
                // objOwnerCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                // if ($scope.model.CountryName == 'All') {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                //             return item;
                //         }
                //     });
                // } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                //             return item;
                //         }
                //     });
                // } else {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                //             return item;
                //         }
                //     });
                // }
                // objOwnerCustomer.y = OwnerCustomer.length;
                // $scope.lstOwnerCustomer.push(objOwnerCustomer);


                var objUser = new Object();
                objUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryName == 'All') {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay)) {
                            return item;
                        }
                    });
                    // var ShopUser = _.filter($scope.userslist, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                    //         return item;
                    //     }
                    // });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                    // var ShopUser = _.filter($scope.userslist, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                    //         return item;
                    //     }
                    // });
                } else {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                    // var ShopUser = _.filter($scope.userslist, function(item) {
                    //     if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                    //         return item;
                    //     }
                    // });
                }

                if (User.length > 0) {
                    var sum = 0;
                    angular.forEach(User, function(value, key) {
                        sum = sum + parseInt(value.Total);
                    })
                    objUser.y = sum;
                } else {
                    objUser.y = 0;
                }
                $scope.lstUser.push(objUser);

                // var objOwnerUser = new Object();
                // objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                // if ($scope.model.CountryName == 'All') {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                //             return item;
                //         }
                //     });
                // } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                //             return item;
                //         }
                //     });
                // } else {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                //             return item;
                //         }
                //     });
                // }
                // if (ownerUser.length > 0) {
                //     var sum1 = 0;
                //     angular.forEach(ownerUser, function(value, key) {
                //         sum1 = sum1 + parseInt(value.Total);
                //     })
                //     objOwnerUser.y = sum1;
                // } else {
                //     objOwnerUser.y = 0;
                // }
                // $scope.lstOwnerUser.push(objOwnerUser);


                if ($scope.custCurrentDay == 1) {
                    if ($scope.custCurrentMonth == 1) {
                        $scope.custCurrentMonth = 12;
                        $scope.custCurrentYear = $scope.custCurrentYear - 1;
                        var lastDay = new Date($scope.custCurrentYear, $scope.custCurrentMonth, 0);
                        $scope.custCurrentDay = lastDay.getDate();
                    } else {
                        $scope.custCurrentMonth = $scope.custCurrentMonth - 1;
                        var lastDay = new Date($scope.custCurrentYear, $scope.custCurrentMonth, 0);
                        $scope.custCurrentDay = lastDay.getDate();
                    }
                } else {
                    $scope.custCurrentDay = $scope.custCurrentDay - 1;
                }
            }
            $scope.dashboardData = [{
                    "key": "User",
                    "values": $scope.lstUser.reverse()
                },
                {
                    "key": "Customer",
                    "values": $scope.lstCustomer.reverse()
                }
            ];
            CallGraphData();
        }
        $scope.SearchData = function(o) {
            if (o.Year != 0 && o.MonthId == 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Please Select Month..")
                    .position('top right')
                    .hideDelay(3000)
                );
                // o.MonthId = 1;
            } else {
                if (o.Year != "0" && o.MonthId != "0") {
                    var oneDay = 24 * 60 * 60 * 1000;
                    var firstDate = new Date(parseInt(o.Year), parseInt(o.MonthId) - 1, 1);
                    var secondDate = new Date(parseInt(o.Year), parseInt(o.MonthId), 0);
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) + 1;
                    // $scope.lstShopUserSearch = [];
                    // $scope.lstShopCustomerSearch = [];
                    // $scope.lstOwnerUserSearch = [];
                    // $scope.lstOwnerCustomerSearch = [];

                    $scope.lstUserSearch = [];
                    $scope.lstCustomerSearch = [];

                    var custDate = firstDate,
                        locale = "en-us",
                        stingmonth = custDate.toLocaleString(locale, { month: "long" });
                    $scope.custCurrentYear = parseInt(o.Year);
                    $scope.custCurrentMonth = parseInt(o.MonthId);
                    $scope.custCurrentDay = parseInt(custDate.getDate());
                    for (var k = 0; k < diffDays; k++) {
                        var date1 = k + 1 + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                        //1
                        var objCustomer = new Object();
                        objCustomer.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                        if (o.CountryName == 'All') {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1)) {
                                    return item;
                                }
                            });
                        } else if (o.CountryName == '' || o.CountryName == null) {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == '' || item.country == null)) {
                                    return item;
                                }
                            });
                        } else {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == o.CountryName)) {
                                    return item;
                                }
                            });
                        }
                        objCustomer.y = Customer.length;
                        $scope.lstCustomerSearch.push(objCustomer);
                        // //2
                        // var objOwnerCustomer = new Object();
                        // objOwnerCustomer.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                        // if (o.CountryName == 'All') {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                        //             return item;
                        //         }
                        //     });
                        // } else if (o.CountryName == '' || o.CountryName == null) {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                        //             return item;
                        //         }
                        //     });
                        // } else {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryName)) {
                        //             return item;
                        //         }
                        //     });
                        // }
                        // objOwnerCustomer.y = OwnerCustomer.length;
                        // $scope.lstOwnerCustomerSearch.push(objOwnerCustomer);
                        //3
                        var objUser = new Object();
                        objUser.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                        if (o.CountryName == 'All') {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1)) {
                                    return item;
                                }
                            });
                        } else if (o.CountryName == '' || o.CountryName == null) {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == '' || item.country == null)) {
                                    return item;
                                }
                            });
                        } else {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == o.CountryName)) {
                                    return item;
                                }
                            });
                        }
                        if (User.length > 0) {
                            var sum = 0;
                            angular.forEach(User, function(value, key) {
                                sum = sum + parseInt(value.Total);
                            })
                            objUser.y = sum;
                        } else {
                            objUser.y = 0;
                        }
                        $scope.lstUserSearch.push(objUser);
                        //4
                        // var objOwnerUser = new Object();
                        // if (o.CountryName == 'All') {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                        //             return item;
                        //         }
                        //     });
                        // } else if (o.CountryName == '' || o.CountryName == null) {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                        //             return item;
                        //         }
                        //     });
                        // } else {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryName)) {
                        //             return item;
                        //         }
                        //     });
                        // }
                        // objOwnerUser.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                        // if (ownerUser.length > 0) {
                        //     var sum1 = 0;
                        //     angular.forEach(ownerUser, function(value, key) {
                        //         sum1 = sum1 + parseInt(value.Total);
                        //     })
                        //     objOwnerUser.y = sum1;
                        // } else {
                        //     objOwnerUser.y = 0;
                        // }
                        // $scope.lstOwnerUserSearch.push(objOwnerUser);
                    }
                    $scope.dashboardData = [{
                            "key": "User",
                            "values": $scope.lstUserSearch
                        },
                        {
                            "key": "Customer",
                            "values": $scope.lstCustomerSearch
                        }
                    ];
                    CallGraphData();
                } else {
                    $scope.CustomerAndUser(true);
                }
            }
        }

        function CallGraphData() {
            $scope.TotalCustomerUser = {
                title: 'Total Customer and User',
                chart: {
                    options: {
                        chart: {
                            type: 'lineChart',
                            color: [ /*'#4caf50',*/ '#2196F3', /*'#ff5722',*/ '#1a237e'],
                            height: 320,
                            margin: {
                                top: 32,
                                right: 32,
                                bottom: 32,
                                left: 48
                            },
                            useInteractiveGuideline: true,
                            clipVoronoi: false,
                            interpolate: 'monotone',
                            x: function(d) {
                                return d.x;
                            },
                            y: function(d) {
                                return d.y;
                            },
                            //xScale = d3.time.scale();
                            xAxis: {
                                tickFormat: function(d) {
                                    return moment(d).format("D-MMM-YYYY");
                                },
                                showMaxMin: false
                            },
                            yAxis: {
                                tickFormat: function(d) {
                                    return d;
                                }
                            },
                            interactiveLayer: {
                                tooltip: {
                                    gravity: 's',
                                    classes: 'gravity-s'
                                }
                            },
                            legend: {
                                margin: {
                                    top: 8,
                                    right: 0,
                                    bottom: 32,
                                    left: 0
                                },
                                rightAlign: false
                            }
                        }
                    },
                    data: $scope.dashboardData
                }
            };
        }

        $scope.CustomerAndUserAcc = function(flag) {
            $scope.weekDays = '';
            $scope.weekMonths = '';
            var currentDate = moment();
            var weekStart = currentDate.clone().startOf('days');
            $scope.days = [];
            $scope.months = [];
            $scope.lstUserAcc = [];
            $scope.lstCustomerAcc = [];
            for (var i = 0; i <= 30; i++) {
                $scope.days.push(moment(weekStart).subtract(i, 'days').format("Do"));
                $scope.months.push(moment(weekStart).subtract(i, 'month').format("M"));
            };

            var custDate1 = new Date();
            var date = custDate1.setDate(custDate1.getDate() - parseInt(29));
            var date1 = new Date(moment(date).format("D-MMM-YYYY"));
            $scope.custCurrentYear = date1.getFullYear();
            $scope.custCurrentMonth = date1.getMonth() + 1;
            $scope.custCurrentDay = date1.getDate();
            var daywiseuserlist = [];
            var labelsday = [];
            $scope.model.YearAcc = "0";
            $scope.model.MonthIdAcc = "0";
            if (flag == false) {
                $scope.model.CountryNameAcc = 'All';
            }
            var sum1 = 0;
            var sum2 = 0;
            var sum3 = 0;
            var sum4 = 0;
            var objcurrentDate = new Date($scope.custCurrentYear.toString() + "-" + $scope.custCurrentMonth.toString() + "-" + $scope.custCurrentDay.toString());

            var lstInitialCustomerdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate)) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null)) {
                        return obj;
                    };
                })
            } else {
                lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc)) {
                        return obj;
                    };
                })
            }
            sum1 = lstInitialCustomerdata.length;

            // var lstInitialOwnerCustomerdata = [];
            // if ($scope.model.CountryNameAcc == 'All') {
            //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
            //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // } else {
            //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // }
            // sum2 = lstInitialOwnerCustomerdata.length;

            var lstInitialUserdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate)) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null)) {
                        return obj;
                    };
                })
            } else {
                lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc)) {
                        return obj;
                    };
                })
            }
            var TempUsersum = 0;
            angular.forEach(lstInitialUserdata, function(value, key) {
                TempUsersum = TempUsersum + parseInt(value.Total);
            })
            sum3 = TempUsersum;

            // var lstInitialOwnerUserdata = [];
            // if ($scope.model.CountryNameAcc == 'All') {
            //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
            //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // } else {
            //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
            //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
            //         if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
            //             return obj;
            //         };
            //     })
            // }
            // var TempOwnerUsersum = 0;
            // angular.forEach(lstInitialOwnerUserdata, function(value, key) {
            //     TempOwnerUsersum = TempOwnerUsersum + parseInt(value.Total);
            // })
            // sum4 = TempOwnerUsersum;

            for (var i = 0; i < 30; i++) {
                var date = $scope.custCurrentDay + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                //1                
                var objCustomer = new Object();
                objCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay)) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                sum1 = sum1 + Customer.length
                objCustomer.y = sum1;
                $scope.lstCustomerAcc.push(objCustomer);
                //2
                // var objOwnerCustomer = new Object();
                // objOwnerCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                // if ($scope.model.CountryNameAcc == 'All') {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay)) {
                //             return item;
                //         }
                //     });
                // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == '' || item.country == null)) {
                //             return item;
                //         }
                //     });
                // } else {
                //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == $scope.model.CountryNameAcc)) {
                //             return item;
                //         }
                //     });
                // }
                // sum2 = sum2 + OwnerCustomer.length
                // objOwnerCustomer.y = sum2;
                // $scope.lstOwnerCustomerAcc.push(objOwnerCustomer);
                //3
                var objUser = new Object();
                objUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay)) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var User = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                if (User.length > 0) {
                    var sum = 0;
                    angular.forEach(User, function(value, key) {
                        sum = sum + parseInt(value.Total);
                    })
                    sum3 = sum3 + sum;
                    objUser.y = sum3;
                } else {
                    objUser.y = sum3;
                }
                $scope.lstUserAcc.push(objUser);
                //4
                // var objOwnerUser = new Object();
                // objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                // if ($scope.model.CountryNameAcc == 'All') {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                //             return item;
                //         }
                //     });
                // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                //             return item;
                //         }
                //     });
                // } else {
                //     var ownerUser = _.filter($scope.userslist, function(item) {
                //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryNameAcc)) {
                //             return item;
                //         }
                //     });
                // }
                // if (ownerUser.length > 0) {
                //     var sumowneruser = 0;
                //     angular.forEach(ownerUser, function(value, key) {
                //         sumowneruser = sumowneruser + parseInt(value.Total);
                //     })
                //     sum4 = sum4 + sumowneruser;
                //     objOwnerUser.y = sum4;
                // } else {
                //     objOwnerUser.y = sum4;
                // }
                // $scope.lstOwnerUserAcc.push(objOwnerUser);

                var MonthLast = new Date();
                var LastDateMs = MonthLast.setDate(MonthLast.getDate() - parseInt(29));
                var ConvertLastDate = new Date(moment(LastDateMs).format("D-MMM-YYYY"));
                var MonthLastDate = new Date(parseInt(ConvertLastDate.getFullYear()), parseInt(ConvertLastDate.getMonth() + 1), 0);
                if (MonthLastDate.getDate() == $scope.custCurrentDay) {
                    if ($scope.custCurrentMonth == 12) {
                        $scope.custCurrentDay = 1
                        $scope.custCurrentMonth = 1;
                        $scope.custCurrentYear = $scope.custCurrentYear + 1;
                    } else {
                        $scope.custCurrentDay = 1
                        $scope.custCurrentMonth = $scope.custCurrentMonth + 1;
                    }
                } else {
                    $scope.custCurrentDay = $scope.custCurrentDay + 1;
                }
            }
            $scope.dashboardData1 = [{
                    "key": "User",
                    "values": $scope.lstUserAcc
                },
                {
                    "key": "Customer",
                    "values": $scope.lstCustomerAcc
                }
            ];
            CallGraphDataAcc();
        }

        $scope.SearchDataAcc = function(o) {
            if (o.YearAcc != 0 && o.MonthIdAcc == 0) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Please Select Month..")
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {
                if (o.YearAcc != "0" && o.MonthIdAcc != "0") {
                    var oneDay = 24 * 60 * 60 * 1000;
                    var firstDate = new Date(parseInt(o.YearAcc), parseInt(o.MonthIdAcc) - 1, 1);
                    var secondDate = new Date(parseInt(o.YearAcc), parseInt(o.MonthIdAcc), 0);
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) + 1;


                    $scope.weekDays = '';
                    $scope.weekMonths = '';
                    $scope.lstUserAccSearch = [];
                    $scope.lstCustomerAccSearch = [];

                    var custDate = firstDate,
                        locale = "en-us",
                        stingmonth = custDate.toLocaleString(locale, { month: "long" });
                    $scope.custCurrentYear = parseInt(o.YearAcc);
                    $scope.custCurrentMonth = parseInt(o.MonthIdAcc);
                    $scope.custCurrentDay = parseInt(custDate.getDate());
                    var sum1Acc = 0;
                    var sum2Acc = 0;
                    var sum3Acc = 0;
                    var sum4Acc = 0;
                    var objcurrentDate = new Date($scope.custCurrentYear.toString() + "-" + $scope.custCurrentMonth.toString() + "-" + $scope.custCurrentDay.toString());

                    var lstInitialCustomerdata = [];
                    if ($scope.model.CountryNameAcc == 'All') {
                        lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate)) {
                                return obj;
                            };
                        })
                    } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                        lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate && obj.country == null)) {
                                return obj;
                            };
                        })
                    } else {
                        lstInitialCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc)) {
                                return obj;
                            };
                        })
                    }
                    sum1Acc = lstInitialCustomerdata.length;

                    // var lstInitialOwnerCustomerdata = [];
                    // if ($scope.model.CountryNameAcc == 'All') {
                    //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // } else {
                    //     lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // }
                    // sum2Acc = lstInitialOwnerCustomerdata.length;

                    var lstInitialUserdata = [];
                    if ($scope.model.CountryNameAcc == 'All') {
                        lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate)) {
                                return obj;
                            };
                        })
                    } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                        lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate && obj.country == null)) {
                                return obj;
                            };
                        })
                    } else {
                        lstInitialUserdata = _.filter($scope.userslist, function(obj) {
                            var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                            if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc)) {
                                return obj;
                            };
                        })
                    }
                    var TempUsersum = 0;
                    angular.forEach(lstInitialUserdata, function(value, key) {
                        TempUsersum = TempUsersum + parseInt(value.Total);
                    })
                    sum3Acc = TempUsersum;

                    // var lstInitialOwnerUserdata = [];
                    // if ($scope.model.CountryNameAcc == 'All') {
                    //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // } else {
                    //     lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    //         var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    //         if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                    //             return obj;
                    //         };
                    //     })
                    // }
                    // var TempOwnerUsersum = 0;
                    // angular.forEach(lstInitialOwnerUserdata, function(value, key) {
                    //     TempOwnerUsersum = TempOwnerUsersum + parseInt(value.Total);
                    // })
                    // sum4Acc = TempOwnerUsersum;




                    for (var k = 0; k < diffDays; k++) {
                        var date = k + 1 + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                        //1                
                        var objCustomer = new Object();
                        objCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                        if (o.CountryName == 'All') {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1)) {
                                    return item;
                                }
                            });
                        } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == '' || item.country == null)) {
                                    return item;
                                }
                            });
                        } else {
                            var Customer = _.filter($scope.lstCustomerGraph, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == o.CountryNameAcc)) {
                                    return item;
                                }
                            });
                        }
                        sum1Acc = sum1Acc + Customer.length
                        objCustomer.y = sum1Acc;
                        $scope.lstCustomerAccSearch.push(objCustomer);
                        //2
                        // var objCustomer = new Object();
                        // objCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                        // if (o.CountryName == 'All') {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                        //             return item;
                        //         }
                        //     });
                        // } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                        //             return item;
                        //         }
                        //     });
                        // } else {
                        //     var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                        //             return item;
                        //         }
                        //     });
                        // }
                        // sum2Acc = sum2Acc + OwnerCustomer.length
                        // objOwnerCustomer.y = sum2Acc;
                        // $scope.lstOwnerCustomerAccSearch.push(objOwnerCustomer);
                        //3
                        var objUser = new Object();
                        if (o.CountryName == 'All') {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1)) {
                                    return item;
                                }
                            });
                        } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == '' || item.country == null)) {
                                    return item;
                                }
                            });
                        } else {
                            var User = _.filter($scope.userslist, function(item) {
                                if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.country == o.CountryNameAcc)) {
                                    return item;
                                }
                            });
                        }
                        objUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                        if (User.length > 0) {
                            var sum = 0;
                            angular.forEach(User, function(value, key) {
                                sum = sum + parseInt(value.Total);
                            })
                            sum3Acc = sum3Acc + sum;
                            objUser.y = sum3Acc;
                        } else {
                            objUser.y = sum3Acc;
                        }
                        $scope.lstUserAccSearch.push(objUser);
                        //4
                        // var objOwnerUser = new Object();
                        // if (o.CountryName == 'All') {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                        //             return item;
                        //         }
                        //     });
                        // } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                        //             return item;
                        //         }
                        //     });
                        // } else {
                        //     var ownerUser = _.filter($scope.userslist, function(item) {
                        //         if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                        //             return item;
                        //         }
                        //     });
                        // }
                        // objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                        // if (ownerUser.length > 0) {
                        //     var sumowneruser = 0;
                        //     angular.forEach(ownerUser, function(value, key) {
                        //         sumowneruser = sumowneruser + parseInt(value.Total);
                        //     })
                        //     sum4Acc = sum4Acc + sumowneruser;
                        //     objOwnerUser.y = sum4Acc;
                        // } else {
                        //     objOwnerUser.y = sum4Acc;
                        // }
                        // $scope.lstOwnerUserAccSearch.push(objOwnerUser);
                    }
                    $scope.dashboardData1 = [{
                            "key": "User",
                            "values": $scope.lstUserAccSearch
                        },
                        {
                            "key": "Customer",
                            "values": $scope.lstCustomerAccSearch
                        }
                    ];
                    CallGraphDataAcc();
                } else {
                    $scope.CustomerAndUserAcc(true);
                }
            }
        }

        function CallGraphDataAcc() {
            $scope.TotalCustomerUserAcc = {
                title: 'Total Accumulate Customer and User',
                chart: {
                    options: {
                        chart: {
                            type: 'lineChart',
                            color: [ /*'#4caf50',*/ '#2196F3', /*'#ff5722',*/ '#1a237e'],
                            height: 320,
                            margin: {
                                top: 32,
                                right: 32,
                                bottom: 32,
                                left: 48
                            },
                            useInteractiveGuideline: true,
                            clipVoronoi: false,
                            interpolate: 'linear',
                            x: function(d) {
                                return d.x;
                            },
                            y: function(d) {

                                return d.y;
                            },
                            //xScale = d3.time.scale();
                            xAxis: {
                                tickFormat: function(d) {

                                    return moment(d).format("D-MMM-YYYY");;
                                },
                                showMaxMin: false
                            },
                            yAxis: {
                                tickFormat: function(d) {
                                    return d;
                                }
                            },
                            interactiveLayer: {
                                tooltip: {
                                    gravity: 's',
                                    classes: 'gravity-s'
                                }
                            },
                            legend: {
                                margin: {
                                    top: 8,
                                    right: 0,
                                    bottom: 32,
                                    left: 0
                                },
                                rightAlign: false
                            }
                        }
                    },
                    data: $scope.dashboardData1
                }
            };
        }



        $scope.CustomerGraph = function() {
            $scope.weekDays = '';
            $scope.weekMonths = '';
            var currentDate = moment();
            var weekStart = currentDate.clone().startOf('days');
            $scope.days = [];
            $scope.months = [];
            for (var i = 0; i <= 30; i++) {
                $scope.days.push(moment(weekStart).subtract(i, 'days').format("Do"));
                $scope.months.push(moment(weekStart).subtract(i, 'month').format("M"));
            };

            var custDate = new Date(),
                locale = "en-us",
                stingmonth = custDate.toLocaleString(locale, { month: "long" });
            $scope.custCurrentYear = custDate.getFullYear();
            $scope.custCurrentMonth = custDate.getMonth() + 1;
            $scope.custCurrentDay = custDate.getDate();
            var daywiseuserlist = [];
            var labelsday = [];

            for (var i = 0; i < 30; i++) {
                var objUser = _.where($scope.lstCustomerGraph, { day: $scope.custCurrentDay, month: $scope.custCurrentMonth });
                daywiseuserlist.push(objUser.length);

                //Add Label for graph
                var d = $scope.custCurrentDay + ' - ' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + ' - ' + $scope.custCurrentYear;
                labelsday.push(d);

                if ($scope.custCurrentDay == 1) {
                    if ($scope.custCurrentMonth == 1) {
                        $scope.custCurrentMonth = 12;
                        $scope.custCurrentYear = $scope.custCurrentYear - 1;
                    }

                    $scope.custCurrentMonth = $scope.custCurrentMonth - 1;
                    var lastDay = new Date($scope.custCurrentYear, $scope.custCurrentMonth, 0);
                    $scope.custCurrentDay = lastDay.getDate();

                } else {
                    $scope.custCurrentDay = $scope.custCurrentDay - 1;
                }
            };
            $scope.weekDays = labelsday.reverse();
            daywiseuserlist = daywiseuserlist.reverse();

            $scope.lineChart = {
                // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                series: ['Total Number of Customer'],
                data: [daywiseuserlist]
            }
        }


        $scope.GetDashboardCount = function() {
            if (!$scope.FlgSuperAdmin) {
                var params = {
                    // countryName: $rootScope.UserCountry,
                    // CountryList: $rootScope.CountryList,
                    // IsSuperAdmin: $scope.FlgSuperAdmin,
                    idApp: $rootScope.appId,
                }
            } else {
                var params = {
                    // countryName: null,
                    // CountryList: [],
                    // IsSuperAdmin: $scope.FlgSuperAdmin,
                    idApp: $rootScope.appId,
                }
            }

            $http.get($rootScope.RoutePath + "dashboard/GetDashboardData", { params: params }).then(function(data) {

                $scope.lstDashBoardInfo = data.data;
                //Today
                if (data.data.sumTodayCancelled == null) {
                    $scope.lstDashBoardInfo.sumTodayCancelled = 0;
                } else {
                    $scope.lstDashBoardInfo.sumTodayCancelled = data.data.sumTodayCancelled;
                }
                if (data.data.sumTodayProcessing == null) {
                    $scope.lstDashBoardInfo.sumTodayProcessing = 0;
                } else {
                    $scope.lstDashBoardInfo.sumTodayProcessing = data.data.sumTodayProcessing;
                }
                if (data.data.sumTodayPending == null) {
                    $scope.lstDashBoardInfo.sumTodayPending = 0;
                } else {
                    $scope.lstDashBoardInfo.sumTodayPending = data.data.sumTodayPending;
                }
                if (data.data.sumTodayCompleted == null) {
                    $scope.lstDashBoardInfo.sumTodayCompleted = 0;
                } else {
                    $scope.lstDashBoardInfo.sumTodayCompleted = data.data.sumTodayCompleted;
                }
                //This year
                if (data.data.sumThisYearCancelled == null) {
                    $scope.lstDashBoardInfo.sumThisYearCancelled = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisYearCancelled = data.data.sumThisYearCancelled;
                }
                if (data.data.sumThisYearCompleted == null) {
                    $scope.lstDashBoardInfo.sumThisYearCompleted = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisYearCompleted = data.data.sumThisYearCompleted;
                }
                if (data.data.sumThisYearPending == null) {
                    $scope.lstDashBoardInfo.sumThisYearPending = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisYearPending = data.data.sumThisYearPending;
                }
                if (data.data.sumThisYearProcessing == null) {
                    $scope.lstDashBoardInfo.sumThisYearProcessing = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisYearProcessing = data.data.sumThisYearProcessing;
                }
                //This Months
                if (data.data.sumThisMonthProcessing == null) {
                    $scope.lstDashBoardInfo.sumThisMonthProcessing = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisMonthProcessing = data.data.sumThisMonthProcessing;
                }
                if (data.data.sumThisMonthPending == null) {
                    $scope.lstDashBoardInfo.sumThisMonthPending = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisMonthPending = data.data.sumThisMonthPending;
                }
                if (data.data.sumThisMonthCompleted == null) {
                    $scope.lstDashBoardInfo.sumThisMonthCompleted = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisMonthCompleted = data.data.sumThisMonthCompleted;
                }
                if (data.data.sumThisMonthCancelled == null) {
                    $scope.lstDashBoardInfo.sumThisMonthCancelled = 0;
                } else {
                    $scope.lstDashBoardInfo.sumThisMonthCancelled = data.data.sumThisMonthCancelled;
                }
                //This Week
                if (data.data.sumLastWeekProcessing == null) {
                    $scope.lstDashBoardInfo.sumLastWeekProcessing = 0;
                } else {
                    $scope.lstDashBoardInfo.sumLastWeekProcessing = data.data.sumLastWeekProcessing;
                }
                if (data.data.sumLastWeekPending == null) {
                    $scope.lstDashBoardInfo.sumLastWeekPending = 0;
                } else {
                    $scope.lstDashBoardInfo.sumLastWeekPending = data.data.sumLastWeekPending;
                }
                if (data.data.sumLastWeekCompleted == null) {
                    $scope.lstDashBoardInfo.sumLastWeekCompleted = 0;
                } else {
                    $scope.lstDashBoardInfo.sumLastWeekCompleted = data.data.sumLastWeekCompleted;
                }
                if (data.data.sumLastWeekCancelled == null) {
                    $scope.lstDashBoardInfo.sumLastWeekCancelled = 0;
                } else {
                    $scope.lstDashBoardInfo.sumLastWeekCancelled = data.data.sumLastWeekCancelled;
                }
                //All Time
                if (data.data.sumAllTimePending == null) {
                    $scope.lstDashBoardInfo.sumAllTimePending = 0;
                } else {
                    $scope.lstDashBoardInfo.sumAllTimePending = data.data.sumAllTimePending;
                }
                if (data.data.sumAllTimeCancelled == null) {
                    $scope.lstDashBoardInfo.sumAllTimeCancelled = 0;
                } else {
                    $scope.lstDashBoardInfo.sumAllTimeCancelled = data.data.sumAllTimeCancelled;
                }
                if (data.data.sumAllTimeCompleted == null) {
                    $scope.lstDashBoardInfo.sumAllTimeCompleted = 0;
                } else {
                    $scope.lstDashBoardInfo.sumAllTimeCompleted = data.data.sumAllTimeCompleted;
                }
                if (data.data.sumAllTimeProcessing == null) {
                    $scope.lstDashBoardInfo.sumAllTimeProcessing = 0;
                } else {
                    $scope.lstDashBoardInfo.sumAllTimeProcessing = data.data.sumAllTimeProcessing;
                }
                $timeout(function() {
                    $scope.ManageGraphOrderTotalByDuration('All');
                }, 600);
            });
        }

        $scope.ManageGraph = function() {

            if (!$scope.FlgSuperAdmin) {
                var params = {
                    // countryName: $rootScope.UserCountry,
                    // CountryList: $rootScope.CountryList,
                    // IsSuperAdmin: $scope.FlgSuperAdmin,
                    idApp: $rootScope.appId,
                }
            } else {
                var params = {
                    // countryName: null,
                    // CountryList: $rootScope.CountryList,
                    // IsSuperAdmin: $scope.FlgSuperAdmin,
                    idApp: $rootScope.appId,
                }
            }

            $http.get($rootScope.RoutePath + "dashboard/GetGraphData", { params: params }).then(function(data) {

                $scope.userslist = data.data.UserData;
                $scope.uploader();

            });
        }

        $scope.GetCustomer = function() {
            var params = {
                // countryName: $rootScope.UserCountry,
                // CountryList: $rootScope.CountryList,
                // IsSuperAdmin: $scope.FlgSuperAdmin,
                idApp: $rootScope.appId,
            }


            $http.get($rootScope.RoutePath + "dashboard/GetTotalCustomer", { params: params }).then(function(data) {
                $scope.lstTotalCustomer = data.data[0].Count;
            });
        }

        $scope.uploader = function() {
            var objDate = new Date(),
                locale = "en-us",
                stingmonth = objDate.toLocaleString(locale, { month: "long" });
            $scope.CurrentYear = objDate.getFullYear();
            $scope.CurrentMonth = objDate.getMonth() + 1;

            var monthname = "";
            var monthlist = [];
            var monthwiselist = [];
            // var monthwiseOwnerlist = [];
            // var monthwiseorderlist = [];
            $scope.listMonthbyName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            $scope.dataUsresbgcolor = [{
                fillColor: 'rgba(33, 150, 243, 0.6)',
                strokeColor: 'rgba(33, 150, 243, 1)',
                highlightFill: 'rgba(33, 150, 243, 1)',
                highlightStroke: 'rgba(33, 150, 243, 1)'
            }];
            $scope.labelsMonth = [];
            $scope.Bardata = [];
            for (var i = 0; i < 12; i++) {
                var objbar = new Object();
                var objUser = _.where($scope.userslist, { month: $scope.CurrentMonth, year: $scope.CurrentYear });
                if (objUser.length > 0) {

                    var newobjUser = _.each(objUser, function(item) {
                        $scope.sum = function(items, prop) {
                            return items.reduce(function(a, b) {
                                return a + b[prop];
                            }, 0);
                        };
                    });
                    objbar.y = $scope.sum(newobjUser, 'Total');
                    objbar.x = $scope.listMonthbyName[$scope.CurrentMonth - 1] + ' - ' + $scope.CurrentYear;
                    monthwiselist.push($scope.sum(newobjUser, 'Total'))
                    objbar.series = 1;
                    $scope.Bardata.push(objbar);
                } else {
                    monthwiselist.push(0)
                    objbar.y = 0;
                    objbar.x = $scope.listMonthbyName[$scope.CurrentMonth - 1] + ' - ' + $scope.CurrentYear;
                    objbar.series = 1;
                    $scope.Bardata.push(objbar);
                }


                //Add Label for graph
                var monthName = $scope.listMonthbyName[$scope.CurrentMonth - 1] + ' - ' + $scope.CurrentYear;
                $scope.labelsMonth.push(monthName);

                $scope.CurrentMonth = $scope.CurrentMonth - 1;
                if ($scope.CurrentMonth == 0) {
                    $scope.CurrentMonth = 12;
                    $scope.CurrentYear = $scope.CurrentYear - 1;
                };
            };

            $scope.labelsMonth = $scope.labelsMonth.reverse();
            monthwiselist = monthwiselist.reverse();

            $scope.series = ['User'];

            $scope.dataUsresOrders = [
                monthwiselist,
            ];

            $scope.dashboardData3 = [{
                "key": "User",
                "values": $scope.Bardata.reverse(),
            }];
            DrowChart();
            $scope.lstTotalUser = monthwiselist.reduce(function(total, item) {
                return total + item;
            }, 0);
            $scope.ManageCustomerGraph();
            $timeout(function() {
                $scope.CustomerAndUser(false);
                $scope.CustomerAndUserAcc(false);
                // $scope.CustomerGraph();
            }, 300);
        }

        $scope.ManageGraphOrderTotalByDuration = function(Duration) {
            $scope.OrderDuration = Duration;
            $scope.labels = ["Processing", "Pending", "Cancelled", "Complete", ];
            if (Duration == "Today") {

                if ($scope.lstDashBoardInfo.sumTodayProcessing == 0 && $scope.lstDashBoardInfo.sumTodayPending == 0 && $scope.lstDashBoardInfo.sumTodayCancelled == 0 && $scope.lstDashBoardInfo.sumTodayCompleted == 0) {
                    $scope.flgshow = 1;

                } else {
                    $scope.data = [$scope.lstDashBoardInfo.sumTodayProcessing, $scope.lstDashBoardInfo.sumTodayPending, $scope.lstDashBoardInfo.sumTodayCancelled, $scope.lstDashBoardInfo.sumTodayCompleted];
                    $scope.OrderDuration = "Today";
                    $scope.flgshow = 0;
                }
            } else if (Duration == "This Week") {
                if ($scope.lstDashBoardInfo.sumLastWeekProcessing == 0 && $scope.lstDashBoardInfo.sumLastWeekPending == 0 && $scope.lstDashBoardInfo.sumLastWeekCancelled == 0 && $scope.lstDashBoardInfo.sumLastWeekCompleted == 0) {
                    $scope.flgshow = 1;

                } else {

                    $scope.data = [$scope.lstDashBoardInfo.sumLastWeekProcessing, $scope.lstDashBoardInfo.sumLastWeekPending, $scope.lstDashBoardInfo.sumLastWeekCancelled, $scope.lstDashBoardInfo.sumLastWeekCompleted];
                    $scope.OrderDuration = "This Week";
                    $scope.flgshow = 0;
                }
            } else if (Duration == "This Month") {
                if ($scope.lstDashBoardInfo.sumThisMonthProcessing == 0 && $scope.lstDashBoardInfo.sumThisMonthPending == 0 && $scope.lstDashBoardInfo.sumThisMonthCancelled == 0 && $scope.lstDashBoardInfo.sumThisMonthCompleted == 0) {
                    $scope.flgshow = 1;


                } else {
                    $scope.data = [$scope.lstDashBoardInfo.sumThisMonthProcessing, $scope.lstDashBoardInfo.sumThisMonthPending, $scope.lstDashBoardInfo.sumThisMonthCancelled, $scope.lstDashBoardInfo.sumThisMonthCompleted];
                    $scope.OrderDuration = "This Month";
                    $scope.flgshow = 0;
                }
            } else if (Duration == "This Year") {
                if ($scope.lstDashBoardInfo.sumThisYearProcessing == 0 && $scope.lstDashBoardInfo.sumThisYearPending == 0 && $scope.lstDashBoardInfo.sumThisYearCancelled == 0 && $scope.lstDashBoardInfo.sumThisYearCompleted == 0) {

                    $scope.flgshow = 1;

                } else {
                    $scope.data = [$scope.lstDashBoardInfo.sumThisYearProcessing, $scope.lstDashBoardInfo.sumThisYearPending, $scope.lstDashBoardInfo.sumThisYearCancelled, $scope.lstDashBoardInfo.sumThisYearCompleted];
                    $scope.OrderDuration = "This Year";
                    $scope.flgshow = 0;
                }
            } else if (Duration == "All") {
                if ($scope.lstDashBoardInfo.sumAllTimeProcessing == 0 && $scope.lstDashBoardInfo.sumAllTimePending == 0 && $scope.lstDashBoardInfo.sumAllTimeCancelled == 0 && $scope.lstDashBoardInfo.sumAllTimeCompleted == 0) {
                    $scope.flgshow = 1;

                } else {
                    $scope.data = [$scope.lstDashBoardInfo.sumAllTimeProcessing, $scope.lstDashBoardInfo.sumAllTimePending, $scope.lstDashBoardInfo.sumAllTimeCancelled, $scope.lstDashBoardInfo.sumAllTimeCompleted];
                    $scope.OrderDuration = "All";
                    $scope.flgshow = 0;

                }
            }

        }

        $scope.dtOptionstable = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(5)
            .withOption('autoWidth', true)
            .withOption('deferRender', true)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('aLengthMenu', [5, 10, 25, 50, 100])
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            .withOption('dom', '<"top"<"left"<"length"l>>f>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>');

        $scope.dtColumnDefsQ = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
        ];

        $scope.dtColumnDefsA = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
        ];


        $scope.TotalCustomerbyCountry = function() {
            $http.get($rootScope.RoutePath + "dashboard/GetTotalCustomerByCountry?idApp=" + $rootScope.appId).then(function(data) {
                if (data.data.success == true) {
                    $scope.lstTotalCustomerbyCountry = data.data.data;
                    $scope.lst = [];
                    $timeout(function() {
                        for (var i = 0; i < $scope.lstTotalCustomerbyCountry.length; i++) {
                            $scope.lst.push($scope.lstTotalCustomerbyCountry[i].tbluserinformation);
                        }

                        $scope.lstFinalTotalCustomerByCountry = [];

                        for (var i = 0; i < $scope.lst.length; i++) {
                            if ($scope.lst[i].country == '' || $scope.lst[i].country == null) {
                                $scope.lst[i].country = 'Other';
                            }
                            if ($scope.lstFinalTotalCustomerByCountry.length == 0) {
                                var obj = new Object();
                                obj.Country = $scope.lst[i].country;
                                obj.Customer = $scope.lst[i].Total;
                                $scope.lstFinalTotalCustomerByCountry.push(obj);
                            } else {
                                var getdata = _.findWhere($scope.lstFinalTotalCustomerByCountry, { Country: $scope.lst[i].country });
                                if (getdata != null && getdata != undefined) {
                                    getdata.Customer += $scope.lst[i].Total;
                                } else {
                                    var obj = new Object();
                                    obj.Country = $scope.lst[i].country;
                                    obj.Customer = $scope.lst[i].Total;
                                    $scope.lstFinalTotalCustomerByCountry.push(obj);
                                }
                            }
                        };
                    }, 600);
                }
            });
        }
        $scope.dtColumnDefsC = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            /*DTColumnDefBuilder.newColumnDef(3).notSortable(),*/
        ];


        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        });

        function DrowChart() {
            $scope.TotalUser = {
                title: 'Total User Data',
                mainChart: {
                    config: {
                        refreshDataOnly: true,
                        deepWatchData: true
                    },
                    options: {
                        chart: {
                            type: 'multiBarChart',
                            color: ['#03a9f4'],
                            height: 420,
                            margin: {
                                top: 8,
                                right: 16,
                                bottom: 32,
                                left: 32
                            },
                            useInteractiveGuideline: false,
                            clipEdge: true,
                            // groupSpacing: 0.3,
                            reduceXTicks: false,
                            // stacked: true,
                            duration: 250,
                            showControls: false,
                            x: function(d) {
                                return d.x;
                            },
                            y: function(d) {
                                return d.y;
                            },
                            xAxis: {
                                tickFormat: function(d) {
                                    return d;
                                },
                                showMaxMin: true
                            },
                            yAxis: {
                                tickFormat: function(d) {
                                    return d;
                                }
                            },
                            legend: {
                                margin: {
                                    top: 8,
                                    bottom: 32
                                }
                            },
                            controls: {
                                margin: {
                                    top: 8,
                                    bottom: 32
                                }
                            },
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s',
                            },
                        }
                    },
                    data: $scope.dashboardData3
                }

            };
        }
        $scope.GetAllExpiredDevice = function() {
            $scope.ExpiryDevicelist = [];
            var params = {
                    AppName: $scope.AppName
                }
                // if ($scope.selectAppName != null && $scope.selectAppName != '' && $scope.selectAppName != undefined) {
                //     params.AppName = $scope.selectAppName;
                // }
            $http.get($rootScope.RoutePath + "bike/GetAllExpireDevice", { params: params }).then(function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].diff = timeDifference(moment(data.data[i].ExpiryDate).format('MM-DD-YYYY hh:mm:ss a'))
                }
                $timeout(function() {
                    $scope.ExpiryDevicelist = data.data;
                }, 600);
            });
        }
        $scope.dtColumnDefsC1 = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
        ];

        function timeDifference(Start) {

            var one_day = 1000 * 60 * 60 * 24;
            var date2 = new Date(Start);
            var date1 = new Date();
            date1.setHours(0);
            date1.setMinutes(0);
            date1.setSeconds(0);

            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
            var difference_ms = date2_ms - date1_ms;
            difference_ms = difference_ms / 1000;
            var seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            var minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            var hours = Math.floor(difference_ms % 24);
            var days = Math.floor(difference_ms / 24);


            var displaydata = "";
            if (days > 0) {
                displaydata = days + ' days';
            }
            // return displaydata;
            var x = days;
            var y = 365;
            var y2 = 31;
            var remainder = x % y;
            var casio = remainder % y2;
            var year = (x - remainder) / y;
            var month = (remainder - casio) / y2;
            var result = '';
            if (year != 0) {
                result = year + " year  ";
            }
            if (month != 0 && year == 0) {
                result += month + " month  ";
            }
            if (casio != 0 && month == 0) {
                result += casio + " days  ";
            }

            // var result = displaydata + "@--- Year ---" + year + "--- Month ---" + month + "--- Day ---" + casio;

            return result;
        }
    }
})();