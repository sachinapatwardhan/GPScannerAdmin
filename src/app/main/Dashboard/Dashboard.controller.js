(function() {
    'use strict';

    angular
        .module('app.Dashboard')
        .controller('DashboardController', DashboardController);

    function DashboardController($http, $scope, $mdDialog, $document, $mdToast, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout, $filter) {

        var vm = this;

        var socket = io($rootScope.Socket_URL);
        socket.on('BikeDeviceStatus', function(msg) {
            var obj = JSON.parse(msg);
            $scope.$apply(function() {
                for (var i = 0; i < $scope.lstDevices.DeviceStatus.length; i++) {
                    if ($scope.lstDevices.DeviceStatus[i].id == obj.PetId) {
                        $scope.lstDevices.DeviceStatus[i].IsOnline = obj.Status;
                        $scope.ActiveDevice = _.where($scope.lstDevices.DeviceStatus, { IsOnline: true });
                        $scope.NotActiveDevice = _.where($scope.lstDevices.DeviceStatus, { IsOnline: false });
                    }
                }
            });
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
            $scope.GetAllDevice();
            $scope.GetAllMontName();
            $scope.GetAllYearName();

            $scope.TotalShopperCustomer = 0;
            $scope.TotalOwnerCustomer = 0;
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
                var map = new google.maps.Map(document.getElementById("map123"),
                    myOptions);
                var MethodCallFlag = true;

                function setMarkers(map, locations) {

                    var marker, i
                    for (i = 0; i < locations.length; i++) {
                        var loan = locations[i].lat
                        var lat = locations[i].lat
                        var long = locations[i].lang
                        var add = locations[i].lang
                        var Phone = locations[i].lang
                        var ImageURL = null
                        var PetShopId = locations[i].id
                        var Authorised = locations[i].IsAuthorised
                        var IsWireCut = locations[i].IsWireCut
                        latlngset = new google.maps.LatLng(lat, long);
                        var icon = {
                            url: $rootScope.API_URL + "MediaUploads/" + ImageURL, // url
                            scaledSize: new google.maps.Size(50, 50), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 50), // anchor
                        };
                        var marker = new google.maps.Marker();
                        if (ImageURL != "" && ImageURL != null) {
                            new CustomMarker(new google.maps.LatLng(lat, long), map, $rootScope.API_URL + "MediaUploads/" + ImageURL, PetShopId, Authorised, IsWireCut)
                        } else {
                            marker = new google.maps.Marker({
                                position: latlngset,
                                map: map,
                                title: loan,
                            });
                        }

                        var latlng = lat + ',' + long;
                        var content = "";

                        if (ionic.Platform.isIOS()) {
                            content = "<b>" + locations[i][0] + '</b><br />' + locations[i][3] + '<br /> <b>tel :</b><a href="tel:' + Phone + '" target="_system">' + Phone + '</a><br> <b>Location :</b><a href="http://maps.apple.com/?ll=' + latlng + '&q=' + loan + '" target="_system">Navigate</a>'
                        } else {
                            content = "<a onclick='callmethod()'>navigate</a><br><button onclick='callmethod()'>Click me</button>"
                        }
                        $ionicLoading.hide();
                        var infowindow = new google.maps.InfoWindow()
                        google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow, loan, add, Phone, lat, long) {
                            return function() {
                                var latlng = lat + ',' + long;
                                alertPopup = $ionicPopup.show({
                                    template: add + '<br /> <b>tel : </b>' + Phone,
                                    title: '<b>' + loan + '</b>',
                                    scope: $scope,
                                    buttons: [{
                                        text: '',
                                        type: 'button-custom-blue button icon ion-ios-telephone',
                                        onTap: function(e) {
                                            return 'Phone';
                                        }
                                    }, {
                                        text: '',
                                        type: 'button-custom-blue button icon ion-ios-location',
                                        onTap: function(e) {
                                            return 'Navigation';
                                        }
                                    }, {
                                        text: '',
                                        type: 'button-custom-blue button icon ion-ios-close-outline',
                                        onTap: function(e) {
                                            return null;
                                        }
                                    }]
                                }).then(function(res) {
                                    if (res == 'Phone') {
                                        Phone = Phone.replace(/\-/g, '').replace(/\ /g, '');
                                        $cordovaInAppBrowser.open('tel:' + Phone, '_system');
                                    } else if (res == 'Navigation') {
                                        if (ionic.Platform.isIOS()) {
                                            $cordovaInAppBrowser.open('http://maps.apple.com/?ll=' + latlng + '&q=' + loan, '_system');
                                        } else {
                                            $cordovaInAppBrowser.open('geo:' + latlng + '?q=' + latlng + '(' + loan + ')', '_system');
                                        }
                                    };
                                }, function(err) {
                                    //  console.log('Err:', err);
                                }, function(msg) {
                                    //console.log('message:', msg);
                                });
                            };
                        })(marker, content, infowindow, loan, add, Phone, lat, long));
                    }
                }
                var FoundLocation = 0;

                google.maps.event.addListener(map, 'idle', function(ev) {
                    if (MethodCallFlag) {
                        // update the coordinates here
                        var bounds = map.getBounds();
                        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                        var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                        var nw = new google.maps.LatLng(ne.lat(), sw.lng());
                        var se = new google.maps.LatLng(sw.lat(), ne.lng());

                        var MapCoords = [
                            { lat: nw.lat(), lng: nw.lng() },
                            { lat: ne.lat(), lng: ne.lng() },
                            { lat: se.lat(), lng: se.lng() },
                            { lat: sw.lat(), lng: sw.lng() }
                        ];


                        $http.get($rootScope.RoutePath + 'dashboard/GetAllWorkingBike').success(function(data) {
                            $scope.lstActivePet = data.data;

                            function setActivePet(i) {


                                if (i < $scope.lstActivePet.length) {

                                    var ImageURL = '';
                                    if ($scope.lstActivePet[i].bikeimageURl != null && $scope.lstActivePet[i].bikeimageURl != '' && $scope.lstActivePet[i].bikeimageURl != undefined) {
                                        ImageURL = $rootScope.RoutePath + "MediaUploads/PetUpload/" + $scope.lstActivePet[i].bikeimageURl;
                                    };
                                    var idBike = $scope.lstActivePet[i].bikeNumber;
                                    var IsWireCut = $scope.lstActivePet[i].IsWireCut;
                                    new CustomMarker(new google.maps.LatLng($scope.lstActivePet[i].Latitude, $scope.lstActivePet[i].Longtitude), map, ImageURL, idBike, IsWireCut)

                                    setActivePet(i + 1);
                                }
                            }
                            setActivePet(0);
                        });
                    };
                });

                if ($scope.CurrentLatitude != '' && $scope.CurrentLongitude != '') {} else {
                    if (Redirectflag) {
                        MethodCallFlag = true;
                    } else {
                        $scope.getCurrentLocation(true);
                    }
                }
            }, 800)
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

        function CustomMarker(latlng, map, imageSrc, BikeID, Authorised) {

            this.latlng_ = latlng;
            this.imageSrc = imageSrc;
            this.BikeID = BikeID;
            this.Authorised = Authorised;

            // Once the LatLng and text are set, add the overlay to the map.  This will
            // trigger a call to panes_changed which should in turn call draw.
            this.setMap(map);
        }


        // if ($rootScope.GoogleMap) {
        CustomMarker.prototype = new google.maps.OverlayView();
        CustomMarker.prototype.draw = function() {
            // Check if the div has been created.
            var div = this.div_;
            if (!div) {
                // Create a overlay text DIV
                div = this.div_ = document.createElement('div');
                // Create the DIV representing our CustomMarker
                if (this.Authorised) {
                    div.className = "customMarker1"
                } else {
                    div.className = "customMarker2"
                };
                div.id = this.BikeID
                if (this.imageSrc != '') {

                    var img = document.createElement("img");
                    img.src = this.imageSrc;
                    div.appendChild(img);
                } else {
                    if (this.Authorised) {

                        var TextDiv = document.createElement("div");
                        TextDiv.innerHTML = this.BikeID;
                        $(TextDiv).addClass('my-text-shadow');
                        div.appendChild(TextDiv);
                    } else {
                        var TextDiv = document.createElement("div");
                        TextDiv.innerHTML = this.BikeID;
                        $(TextDiv).addClass('my-text-shadow');
                        div.appendChild(TextDiv);
                    }

                };

                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

            if (point) {

                div.style.left = point.x + 'px';
                div.style.top = point.y + 'px';
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
            if (!$scope.FlgSuperAdmin) {
                var params = {
                    countryName: $rootScope.UserCountry,
                    CountryList: $rootScope.CountryList,
                    IsSuperAdmin: $scope.FlgSuperAdmin
                }
            } else {
                var params = {
                    countryName: null,
                    CountryList: $rootScope.CountryList,
                    IsSuperAdmin: $scope.FlgSuperAdmin
                }
            }
            $http.get($rootScope.RoutePath + "dashboard/GetGraphCustomer", { params: params }).then(function(data) {
                $scope.lstCustomerGraph = data.data.UserData;
                $scope.lstCountry = _.uniq($scope.lstCustomerGraph, function(item, key, country) {
                    return item.country;
                });

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
            $scope.lstShopUser = [];
            $scope.lstShopCustomer = [];
            $scope.lstOwnerUser = [];
            $scope.lstOwnerCustomer = [];
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
                var objShopCustomer = new Object();
                objShopCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryName == 'All') {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                }
                objShopCustomer.y = ShopCustomer.length;
                $scope.lstShopCustomer.push(objShopCustomer);

                var objOwnerCustomer = new Object();
                objOwnerCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryName == 'All') {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                }
                objOwnerCustomer.y = OwnerCustomer.length;
                $scope.lstOwnerCustomer.push(objOwnerCustomer);


                var objShopUser = new Object();
                objShopUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryName == 'All') {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                }
                if (ShopUser.length > 0) {
                    var sum = 0;
                    angular.forEach(ShopUser, function(value, key) {
                        sum = sum + parseInt(value.Total);
                    })
                    objShopUser.y = sum;
                } else {
                    objShopUser.y = 0;
                }
                $scope.lstShopUser.push(objShopUser);

                var objOwnerUser = new Object();
                objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryName == 'All') {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryName == '' || $scope.model.CountryName == null) {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryName)) {
                            return item;
                        }
                    });
                }
                if (ownerUser.length > 0) {
                    var sum1 = 0;
                    angular.forEach(ownerUser, function(value, key) {
                        sum1 = sum1 + parseInt(value.Total);
                    })
                    objOwnerUser.y = sum1;
                } else {
                    objOwnerUser.y = 0;
                }
                $scope.lstOwnerUser.push(objOwnerUser);


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
                    "key": "OwnerUser",
                    "values": $scope.lstOwnerUser.reverse()
                },
                {
                    "key": "OwnerCustomer",
                    "values": $scope.lstOwnerCustomer.reverse()
                }
            ];
            CallGraphData();
        }
        $scope.SearchData = function(o) {
            if (o.Year != "0" && o.MonthId != "0") {
                var oneDay = 24 * 60 * 60 * 1000;
                var firstDate = new Date(parseInt(o.Year), parseInt(o.MonthId) - 1, 1);
                var secondDate = new Date(parseInt(o.Year), parseInt(o.MonthId), 0);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) + 1;

                $scope.lstShopUserSearch = [];
                $scope.lstShopCustomerSearch = [];
                $scope.lstOwnerUserSearch = [];
                $scope.lstOwnerCustomerSearch = [];

                var custDate = firstDate,
                    locale = "en-us",
                    stingmonth = custDate.toLocaleString(locale, { month: "long" });
                $scope.custCurrentYear = parseInt(o.Year);
                $scope.custCurrentMonth = parseInt(o.MonthId);
                $scope.custCurrentDay = parseInt(custDate.getDate());
                for (var k = 0; k < diffDays; k++) {
                    var date1 = k + 1 + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                    //1
                    var objShopCustomer = new Object();
                    objShopCustomer.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                    if (o.CountryName == 'All') {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryName == '' || o.CountryName == null) {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == o.CountryName)) {
                                return item;
                            }
                        });
                    }
                    objShopCustomer.y = ShopCustomer.length;
                    $scope.lstShopCustomerSearch.push(objShopCustomer);
                    // //2
                    var objOwnerCustomer = new Object();
                    objOwnerCustomer.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                    if (o.CountryName == 'All') {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryName == '' || o.CountryName == null) {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryName)) {
                                return item;
                            }
                        });
                    }
                    objOwnerCustomer.y = OwnerCustomer.length;
                    $scope.lstOwnerCustomerSearch.push(objOwnerCustomer);
                    //3
                    var objShopUser = new Object();
                    objShopUser.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                    if (o.CountryName == 'All') {
                        var ShopUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryName == '' || o.CountryName == null) {
                        var ShopUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var ShopUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == o.CountryName)) {
                                return item;
                            }
                        });
                    }
                    if (ShopUser.length > 0) {
                        var sum = 0;
                        angular.forEach(ShopUser, function(value, key) {
                            sum = sum + parseInt(value.Total);
                        })
                        objShopUser.y = sum;
                    } else {
                        objShopUser.y = 0;
                    }
                    $scope.lstShopUserSearch.push(objShopUser);
                    //4
                    var objOwnerUser = new Object();
                    if (o.CountryName == 'All') {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryName == '' || o.CountryName == null) {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryName)) {
                                return item;
                            }
                        });
                    }
                    objOwnerUser.x = moment($filter('date')(new Date(date1), "MM/dd/yyyy")).valueOf();
                    if (ownerUser.length > 0) {
                        var sum1 = 0;
                        angular.forEach(ownerUser, function(value, key) {
                            sum1 = sum1 + parseInt(value.Total);
                        })
                        objOwnerUser.y = sum1;
                    } else {
                        objOwnerUser.y = 0;
                    }
                    $scope.lstOwnerUserSearch.push(objOwnerUser);
                }
                $scope.dashboardData = [{
                        "key": "OwnerUser",
                        "values": $scope.lstOwnerUserSearch
                    },
                    {
                        "key": "OwnerCustomer",
                        "values": $scope.lstOwnerCustomerSearch
                    }
                ];
                CallGraphData();
            } else {
                $scope.CustomerAndUser(true);
            }
        }

        function CallGraphData() {
            $scope.TotalCustomerUser = {
                title: 'Total Customer and User',
                chart: {
                    options: {
                        chart: {
                            type: 'lineChart',
                            color: [ /*'#4caf50',*/ '#3f51b5', /*'#ff5722',*/ '#FFFF00'],
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
            $scope.lstShopUserAcc = [];
            $scope.lstShopCustomerAcc = [];
            $scope.lstOwnerUserAcc = [];
            $scope.lstOwnerCustomerAcc = [];
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

            var lstInitialShopCustomerdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else {
                lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            }
            sum1 = lstInitialShopCustomerdata.length;

            var lstInitialOwnerCustomerdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else {
                lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            }
            sum2 = lstInitialOwnerCustomerdata.length;

            var lstInitialShopUserdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else {
                lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            }
            var TempShopUsersum = 0;
            angular.forEach(lstInitialShopUserdata, function(value, key) {
                TempShopUsersum = TempShopUsersum + parseInt(value.Total);
            })
            sum3 = TempShopUsersum;

            var lstInitialOwnerUserdata = [];
            if ($scope.model.CountryNameAcc == 'All') {
                lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            } else {
                lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                    var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                    if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                        return obj;
                    };
                })
            }
            var TempOwnerUsersum = 0;
            angular.forEach(lstInitialOwnerUserdata, function(value, key) {
                TempOwnerUsersum = TempOwnerUsersum + parseInt(value.Total);
            })
            sum4 = TempOwnerUsersum;

            for (var i = 0; i < 30; i++) {
                var date = $scope.custCurrentDay + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                //1                
                var objShopCustomer = new Object();
                objShopCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                sum1 = sum1 + ShopCustomer.length
                objShopCustomer.y = sum1;
                $scope.lstShopCustomerAcc.push(objShopCustomer);
                //2
                var objOwnerCustomer = new Object();
                objOwnerCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                sum2 = sum2 + OwnerCustomer.length
                objOwnerCustomer.y = sum2;
                $scope.lstOwnerCustomerAcc.push(objOwnerCustomer);
                //3
                var objShopUser = new Object();
                objShopUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ShopUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                if (ShopUser.length > 0) {
                    var sum = 0;
                    angular.forEach(ShopUser, function(value, key) {
                        sum = sum + parseInt(value.Total);
                    })
                    sum3 = sum3 + sum;
                    objShopUser.y = sum3;
                } else {
                    objShopUser.y = sum3;
                }
                $scope.lstShopUserAcc.push(objShopUser);
                //4
                var objOwnerUser = new Object();
                objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                if ($scope.model.CountryNameAcc == 'All') {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both')) {
                            return item;
                        }
                    });
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                            return item;
                        }
                    });
                } else {
                    var ownerUser = _.filter($scope.userslist, function(item) {
                        if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == $scope.custCurrentDay) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == $scope.model.CountryNameAcc)) {
                            return item;
                        }
                    });
                }
                if (ownerUser.length > 0) {
                    var sumowneruser = 0;
                    angular.forEach(ownerUser, function(value, key) {
                        sumowneruser = sumowneruser + parseInt(value.Total);
                    })
                    sum4 = sum4 + sumowneruser;
                    objOwnerUser.y = sum4;
                } else {
                    objOwnerUser.y = sum4;
                }
                $scope.lstOwnerUserAcc.push(objOwnerUser);

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
                    "key": "OwnerUser",
                    "values": $scope.lstOwnerUserAcc
                },
                {
                    "key": "OwnerCustomer",
                    "values": $scope.lstOwnerCustomerAcc
                }
            ];
            CallGraphDataAcc();
        }

        $scope.SearchDataAcc = function(o) {
            if (o.YearAcc != "0" && o.MonthIdAcc != "0") {
                var oneDay = 24 * 60 * 60 * 1000;
                var firstDate = new Date(parseInt(o.YearAcc), parseInt(o.MonthIdAcc) - 1, 1);
                var secondDate = new Date(parseInt(o.YearAcc), parseInt(o.MonthIdAcc), 0);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))) + 1;


                $scope.weekDays = '';
                $scope.weekMonths = '';
                $scope.lstShopUserAccSearch = [];
                $scope.lstShopCustomerAccSearch = [];
                $scope.lstOwnerUserAccSearch = [];
                $scope.lstOwnerCustomerAccSearch = [];

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

                var lstInitialShopCustomerdata = [];
                if ($scope.model.CountryNameAcc == 'All') {
                    lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else {
                    lstInitialShopCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                }
                sum1Acc = lstInitialShopCustomerdata.length;

                var lstInitialOwnerCustomerdata = [];
                if ($scope.model.CountryNameAcc == 'All') {
                    lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else {
                    lstInitialOwnerCustomerdata = _.filter($scope.lstCustomerGraph, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                }
                sum2Acc = lstInitialOwnerCustomerdata.length;

                var lstInitialShopUserdata = [];
                if ($scope.model.CountryNameAcc == 'All') {
                    lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else {
                    lstInitialShopUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Shop' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                }
                var TempShopUsersum = 0;
                angular.forEach(lstInitialShopUserdata, function(value, key) {
                    TempShopUsersum = TempShopUsersum + parseInt(value.Total);
                })
                sum3Acc = TempShopUsersum;

                var lstInitialOwnerUserdata = [];
                if ($scope.model.CountryNameAcc == 'All') {
                    lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else if ($scope.model.CountryNameAcc == '' || $scope.model.CountryNameAcc == null) {
                    lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == null) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                } else {
                    lstInitialOwnerUserdata = _.filter($scope.userslist, function(obj) {
                        var objdate = new Date(obj.year.toString() + "-" + obj.month.toString() + "-" + obj.day.toString());
                        if ((objdate < objcurrentDate && obj.country == $scope.model.CountryNameAcc) && (obj.Type == 'Owner' || obj.Type == 'Both')) {
                            return obj;
                        };
                    })
                }
                var TempOwnerUsersum = 0;
                angular.forEach(lstInitialOwnerUserdata, function(value, key) {
                    TempOwnerUsersum = TempOwnerUsersum + parseInt(value.Total);
                })
                sum4Acc = TempOwnerUsersum;




                for (var k = 0; k < diffDays; k++) {
                    var date = k + 1 + '-' + $scope.listMonthbyName[$scope.custCurrentMonth - 1] + '-' + $scope.custCurrentYear;
                    //1                
                    var objShopCustomer = new Object();
                    objShopCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                    if (o.CountryName == 'All') {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var ShopCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                                return item;
                            }
                        });
                    }
                    sum1Acc = sum1Acc + ShopCustomer.length
                    objShopCustomer.y = sum1Acc;
                    $scope.lstShopCustomerAccSearch.push(objShopCustomer);
                    //2
                    var objOwnerCustomer = new Object();
                    objOwnerCustomer.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                    if (o.CountryName == 'All') {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var OwnerCustomer = _.filter($scope.lstCustomerGraph, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                                return item;
                            }
                        });
                    }
                    sum2Acc = sum2Acc + OwnerCustomer.length
                    objOwnerCustomer.y = sum2Acc;
                    $scope.lstOwnerCustomerAccSearch.push(objOwnerCustomer);
                    //3
                    var objShopUser = new Object();
                    if (o.CountryName == 'All') {
                        var User = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        var User = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var User = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Shop' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                                return item;
                            }
                        });
                    }
                    objShopUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                    if (User.length > 0) {
                        var sum = 0;
                        angular.forEach(User, function(value, key) {
                            sum = sum + parseInt(value.Total);
                        })
                        sum3Acc = sum3Acc + sum;
                        objShopUser.y = sum3Acc;
                    } else {
                        objShopUser.y = sum3Acc;
                    }
                    $scope.lstShopUserAccSearch.push(objShopUser);
                    //4
                    var objOwnerUser = new Object();
                    if (o.CountryName == 'All') {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both')) {
                                return item;
                            }
                        });
                    } else if (o.CountryNameAcc == '' || o.CountryNameAcc == null) {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == '' || item.country == null)) {
                                return item;
                            }
                        });
                    } else {
                        var ownerUser = _.filter($scope.userslist, function(item) {
                            if ((item.year == $scope.custCurrentYear && item.month == $scope.custCurrentMonth && item.day == k + 1) && (item.Type == 'Owner' || item.Type == 'Both') && (item.country == o.CountryNameAcc)) {
                                return item;
                            }
                        });
                    }
                    objOwnerUser.x = moment($filter('date')(new Date(date), "MM/dd/yyyy")).valueOf();
                    if (ownerUser.length > 0) {
                        var sumowneruser = 0;
                        angular.forEach(ownerUser, function(value, key) {
                            sumowneruser = sumowneruser + parseInt(value.Total);
                        })
                        sum4Acc = sum4Acc + sumowneruser;
                        objOwnerUser.y = sum4Acc;
                    } else {
                        objOwnerUser.y = sum4Acc;
                    }
                    $scope.lstOwnerUserAccSearch.push(objOwnerUser);
                }
                $scope.dashboardData1 = [{
                        "key": "OwnerUser",
                        "values": $scope.lstOwnerUserAccSearch
                    },
                    {
                        "key": "OwnerCustomer",
                        "values": $scope.lstOwnerCustomerAccSearch
                    }
                ];
                CallGraphDataAcc();
            } else {
                $scope.CustomerAndUserAcc(true);
            }
        }

        function CallGraphDataAcc() {
            $scope.TotalCustomerUserAcc = {
                title: 'Total Accumulate Customer and User',
                chart: {
                    options: {
                        chart: {
                            type: 'lineChart',
                            color: [ /*'#4caf50',*/ '#3f51b5', /*'#ff5722',*/ '#FFFF00'],
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
                    countryName: $rootScope.UserCountry,
                    CountryList: $rootScope.CountryList,
                    IsSuperAdmin: $scope.FlgSuperAdmin
                }
            } else {
                var params = {
                    countryName: null,
                    CountryList: [],
                    IsSuperAdmin: $scope.FlgSuperAdmin
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
                    countryName: $rootScope.UserCountry,
                    CountryList: $rootScope.CountryList,
                    IsSuperAdmin: $scope.FlgSuperAdmin
                }
            } else {
                var params = {
                    countryName: null,
                    CountryList: $rootScope.CountryList,
                    IsSuperAdmin: $scope.FlgSuperAdmin
                }
            }

            $http.get($rootScope.RoutePath + "dashboard/GetGraphData", { params: params }).then(function(data) {

                $scope.userslist = data.data.UserData;
                $scope.uploader();

            });
        }

        $scope.GetCustomer = function() {

            var params = {
                countryName: $rootScope.UserCountry,
                CountryList: $rootScope.CountryList,
                IsSuperAdmin: $scope.FlgSuperAdmin
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
            var monthwiseShoplist = [];
            var monthwiseOwnerlist = [];
            var monthwiseorderlist = [];
            $scope.listMonthbyName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            $scope.labelsMonth = [];
            for (var i = 0; i < 12; i++) {

                var objUserShop = _.where($scope.userslist, { month: $scope.CurrentMonth, year: $scope.CurrentYear });
                if (objUserShop.length > 0) {
                    var newobjUserShop = _.filter(objUserShop, function(item) {
                        if (item.Type == 'Both' || item.Type == 'Shop') {
                            return item
                        }
                    });
                    $scope.sum = function(items, prop) {
                        return items.reduce(function(a, b) {
                            return a + b[prop];
                        }, 0);
                    };
                    monthwiseShoplist.push($scope.sum(newobjUserShop, 'Total'))

                } else {
                    monthwiseShoplist.push(0)
                }

                var objUserOwner = _.where($scope.userslist, { month: $scope.CurrentMonth, year: $scope.CurrentYear });
                if (objUserOwner.length > 0) {
                    var newobjUserOwner = _.filter(objUserOwner, function(item) {
                        if (item.Type == 'Both' || item.Type == 'Owner') {
                            return item
                        }
                    });
                    $scope.sum1 = function(items, prop) {
                        return items.reduce(function(a, b) {
                            return a + b[prop];
                        }, 0);
                    };
                    monthwiseOwnerlist.push($scope.sum1(newobjUserOwner, 'Total'))

                } else {
                    monthwiseOwnerlist.push(0)
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
            monthwiseShoplist = monthwiseShoplist.reverse();
            monthwiseOwnerlist = monthwiseOwnerlist.reverse();
            monthwiseorderlist = monthwiseorderlist.reverse();

            $scope.series = ['Owner'];

            $scope.dataUsresOrders = [
                // monthwiseorderlist,
                monthwiseOwnerlist,
                // monthwiseShoplist,


            ];

            $scope.lstTotalShoper = monthwiseShoplist.reduce(function(total, item) {
                return total + item;
            }, 0);
            $scope.lstTotalOwner = monthwiseOwnerlist.reduce(function(total, item) {
                return total + item;
            }, 0);
            $scope.ManageCustomerGraph();
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

        $scope.GetAllDevice = function() {
            var params = {
                countryName: $rootScope.UserCountry,
                CountryList: $rootScope.CountryList,
                IsSuperAdmin: $scope.FlgSuperAdmin
            }
            $http.get($rootScope.RoutePath + "dashboard/GetBikeTotalDevice", { params: params }).then(function(data) {
                $scope.lstDevices = data.data;
                $scope.ActiveDevice = _.where($scope.lstDevices.DeviceStatus, { IsOnline: 1 });
                $scope.NotActiveDevice = _.where($scope.lstDevices.DeviceStatus, { IsOnline: 0 });
                // $scope.ShoperDevice = _.where($scope.lstDevices.DeviceStatus, { DeviceType: 'M2' });
                // $scope.OwnerDevice = _.where($scope.lstDevices.DeviceStatus, { DeviceType: 'M2-U' });


            });
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
            $http.get($rootScope.RoutePath + "dashboard/GetTotalCustomerByCountry").then(function(data) {
                if (data.data.success == true) {
                    $scope.lstTotalCustomerbyCountry = data.data.data;
                    console.log(data.data.data);
                    $scope.lst = [];
                    $timeout(function() {
                        for (var i = 0; i < $scope.lstTotalCustomerbyCountry.length; i++) {
                            // if ($scope.lstTotalCustomerbyCountry[i].tbluserinformation.Type == "Shop") {
                            //     $scope.TotalShopperCustomer += $scope.lstTotalCustomerbyCountry[i].tbluserinformation.Total;
                            // } else if ($scope.lstTotalCustomerbyCountry[i].tbluserinformation.Type == "Owner") {
                            //     $scope.TotalOwnerCustomer += $scope.lstTotalCustomerbyCountry[i].tbluserinformation.Total;
                            // } else if ($scope.lstTotalCustomerbyCountry[i].tbluserinformation.Type == "Both") {
                            //     $scope.TotalShopperCustomer += $scope.lstTotalCustomerbyCountry[i].tbluserinformation.Total;
                            //     $scope.TotalOwnerCustomer += $scope.lstTotalCustomerbyCountry[i].tbluserinformation.Total;
                            // } else {

                            // }
                            $scope.lst.push($scope.lstTotalCustomerbyCountry[i].tbluserinformation);
                        }

                        $scope.lstFinalTotalCustomerByCountry = [];

                        for (var i = 0; i < $scope.lst.length; i++) {
                            // console.log($scope.lst[i]);
                            var getdata = _.findWhere($scope.lst, { country: $scope.lst[i].country });
                            console.log(getdata);
                            if ($scope.lst[i].country == '' || $scope.lst[i].country == null) {
                                $scope.lst[i].country = 'Other';
                            }
                            // console.log($scope.lst[i].country);


                            if ($scope.lstFinalTotalCustomerByCountry.length == 0) {
                                var obj = new Object();
                                obj.Country = $scope.lst[i].country;
                                obj.Customer = $scope.lst[i].Total;
                                //     if ($scope.lst[i].Type == 'Shop') {
                                //         obj.Shop = $scope.lst[i].Total;
                                //         obj.Owner = 0;
                                //     } else if ($scope.lst[i].Type == 'Owner') {
                                //         obj.Shop = 0;
                                //         obj.Owner = $scope.lst[i].Total;
                                //     } else {
                                //         obj.Shop = $scope.lst[i].Total;
                                //         obj.Owner = $scope.lst[i].Total;
                                //     }
                                $scope.lstFinalTotalCustomerByCountry.push(obj);
                            } else {

                                //     
                                //     console.log(getdata);
                                //     if (getdata != null && getdata != undefined) {
                                //         if ($scope.lst[i].Type == 'Shop') {
                                //             getdata.Shop = getdata.Shop + $scope.lst[i].Total;
                                //         } else if ($scope.lst[i].Type == 'Owner') {
                                //             getdata.Owner = getdata.Owner + $scope.lst[i].Total;
                                //         } else {
                                //             getdata.Shop = getdata.Shop + $scope.lst[i].Total;
                                //             getdata.Owner = getdata.Owner + $scope.lst[i].Total;
                                //         }
                                //     } else {
                                //         var obj = new Object();
                                //         obj.Country = $scope.lst[i].country;
                                //         if ($scope.lst[i].Type == 'Shop') {
                                //             obj.Shop = $scope.lst[i].Total;
                                //             obj.Owner = 0;
                                //         } else if ($scope.lst[i].Type == 'Shop') {
                                //             obj.Shop = 0;
                                //             obj.Owner = $scope.lst[i].Total;
                                //         } else {
                                //             obj.Shop = $scope.lst[i].Total;
                                //             obj.Owner = $scope.lst[i].Total;
                                //         }
                                //         $scope.lstFinalTotalCustomerByCountry.push(obj);
                                //     }
                            }
                            console.log($scope.lstFinalTotalCustomerByCountry);
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
    }
})();