(function() {
    'use strict';

    angular
        .module('app.ownerbike')
        .controller('Location1Controller', Location1Controller);

    /** @ngInject */
    function Location1Controller($http, $mdDialog, $scope, deviceid, Tasks, event, MediaVM, $rootScope, $mdToast, bikeNumber, images, IsOnline) {
        var vm = this;
        $scope.RoutePath = $rootScope.RoutePath;
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
                            latlngset = new google.maps.LatLng(lat, long);
                            var icon = {
                                url: $rootScope.API_URL + "MediaUploads/" + ImageURL, // url
                                scaledSize: new google.maps.Size(50, 50), // scaled size
                                origin: new google.maps.Point(0, 0), // origin
                                anchor: new google.maps.Point(0, 50), // anchor
                            };
                            var marker = new google.maps.Marker();
                            if (ImageURL != "" && ImageURL != null) {
                                new CustomMarker(new google.maps.LatLng(lat, long), map, $rootScope.API_URL + "MediaUploads/" + ImageURL, PetShopId, Authorised)
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
                                //content = "<b>" + locations[i][0] + '</b><br />' + locations[i][3] + '<br /> <b>tel :</b><a href="tel:' + Phone + '"  target="_system">' + Phone + '</a><br> <b>Location :</b><a href="geo:' + latlng + '?q=' + latlng + '(' + loan + ')" target="_system">Navigate</a>'
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
                                        // console.log('Err:', err);
                                    }, function(msg) {
                                        // console.log('message:', msg);
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
                            new CustomMarker(new google.maps.LatLng(data.Latitude, data.Longitude), map, images, bikeNumber, IsOnline)

                        };
                    });


                    // $ionicLoading.hide();
                }, 800)
            } else {
                $scope.NoLocation = "No Location Found"
                var map;
                map = new google.maps.Map(document.getElementById('map123'), {
                    center: { lat: 0, lng: 0 },
                    zoom: 2
                });

            }
        }

        $scope.GetBikeGps = function(flag) {
            var params = {
                DeviceId: deviceid,
            }

            $http.get($rootScope.RoutePath + 'bike/GetPetCurrentLocation', { params: params }).success(function(data) {
                // console.log(data)
                $scope.lstlocation = data.data;

                $scope.IntializeGoogleMap($scope.lstlocation);

            });


        }

        $scope.GetBikeGps(false);

        //adapted from http://gmaps-samples-v3.googlecode.com/svn/trunk/overlayview/custommarker.html
        function CustomMarker(latlng, map, imageSrc, bikeNumber, IsOnline, Authorised) {
            this.latlng_ = latlng;
            this.imageSrc = imageSrc;
            this.BikeID = bikeNumber;
            this.Authorised = Authorised;
            this.IsOnline = IsOnline;
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
                if (this.IsOnline == 'false') {
                    div.className = "customMarkerPetShop"

                    div.id = this.BikeID
                    if (this.imageSrc != '') {
                        var img = document.createElement("img");
                        img.src = this.imageSrc;
                        div.appendChild(img);
                    } else {
                        var TextDiv = document.createElement("div");
                        TextDiv.innerHTML = this.BikeID;
                        $(TextDiv).addClass('my-text-shadow');
                        div.appendChild(TextDiv);
                    };

                } else {
                    div.className = "customMarker1"

                    div.id = this.BikeID
                    if (this.imageSrc != '') {

                        var img = document.createElement("img");
                        img.src = this.imageSrc;
                        div.appendChild(img);
                    } else {
                        var TextDiv = document.createElement("div");
                        TextDiv.innerHTML = this.BikeID;
                        $(TextDiv).addClass('my-text-shadow');
                        div.appendChild(TextDiv);;
                    };

                }
                // google.maps.event.addDomListener(div, "click", function(event) {
                //     $state.go('app.petshopdetail', { id: parseInt(div.id) })
                // });

                // Then add the overlay to the DOM
                var panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }

            // Position the overlay 
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

            if (point) {

                div.style.left = point.x + 'px';
                div.style.top = point.y + 'px';
            }
        };

        CustomMarker.prototype.remove = function() {
            // Check if the overlay was on the map and needs to be removed.
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            }
        };

        CustomMarker.prototype.getPosition = function() {
            return this.latlng_;
        };

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();