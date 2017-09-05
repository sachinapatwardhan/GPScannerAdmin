(function() {
    'use strict';

    angular
        .module('app.FacebookFeed')
        .controller('FacebookFeedController', FacebookFeedController);

    /** @ngInject */
    function FacebookFeedController($http, $scope, $rootScope, $mdToast, $cookieStore, $document, $mdDialog, $stateParams, $q, DTColumnDefBuilder, DTColumnBuilder, DTOptionsBuilder, $compile) {

        var vm = this;

        // Data
        vm.GetAllFacebookCountrySettings = GetAllFacebookCountrySettings;

        $scope.Public_Access_Token = "";
        $scope.lstFeeds = [];
        $scope.noMoreFeedAvailable = false;


        $scope.init = function() {
            $scope.model = {
                Title: '',
                Message: '',
                Country: 'All'
            }
            $scope.Settingmodel = {
                Name: '',
                Value: '',
                StoreId: 0
            }
            $scope.SettingFlg = 0;

            $scope.GetAllCountry();
        }

        // Methods
        // vm.loadNextPage = loadNextPage;

        //////////

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }


        $scope.GetAccessToken = function() {

            var facebookGraphURL = 'https://graph.facebook.com/oauth/access_token?client_id=945005928952155&client_secret=ab18ae13215e33f2f5536df068437e6b&grant_type=client_credentials';
            $.ajax({
                url: facebookGraphURL,
                dataType: 'json',
                success: function(data, status) {

                    if (data.status == 200) {
                        $scope.Public_Access_Token = data.responseText;

                        $scope.path = 'https://graph.facebook.com/v2.5/642953285808374/feed?fields=id,source,likes.summary(true),comments.summary(true){message,from{name,picture}},name,full_picture,message,story,description,link,type,created_time,attachments{subattachments,media}&' + $scope.Public_Access_Token;
                        $scope.GetFeeds();

                    };
                },
                error: function(data, e1, e2) {

                    if (data.status == 200) {
                        $scope.Public_Access_Token = data.responseText;

                        $scope.path = 'https://graph.facebook.com/v2.5/642953285808374/feed?fields=id,source,likes.summary(true),comments.summary(true){message,from{name,picture}},name,full_picture,message,story,description,link,type,created_time,attachments{subattachments,media}&' + $scope.Public_Access_Token;
                        $scope.GetFeeds();
                    };
                }
            })

        }

        $rootScope.calcDateDiff = function(date1, date2) {

            var l = moment.duration(date1.diff(date2, 'milliseconds'));

            var diff = l.asMilliseconds();

            var seconds = Math.floor(diff / 1000);

            var Minutes = Math.floor(seconds / 60);

            var Hours = Math.floor(Minutes / 60);

            // var day = 60  60  24;

            var days = Math.floor(Hours / 24);
            var months = Math.floor(days / 31);
            var years = Math.floor(months / 12);


            if (seconds < 60) {
                return seconds + " seconds ago"
            } else if (Minutes < 60) {
                return Minutes + " minutes ago"
            } else if (Hours < 24) {
                return Hours + " hours ago"
            } else if (days < 31) {
                return days + " days ago"
            } else if (months < 12) {
                return months + " months ago"
            } else {
                return years + " years ago"
            };
        }


        $scope.GetFeeds = function() {

            var today = new Date();

            $.ajax({
                url: $scope.path,
                dataType: 'json',
                success: function(data, status) {
                    if (data) {
                        if (data.paging) {
                            if (data.paging.next) {
                                $scope.path = data.paging.next;
                            } else {
                                $scope.path = "";
                            }
                        } else {
                            $scope.path = "";
                        }

                        for (var i = 0; i < data.data.length; i++) {
                            // data.data[i].PostDate = $rootScope.calcDateDiff(today, new Date(data.data[i].created_time));
                            data.data[i].PostDate = $rootScope.calcDateDiff(moment(new Date()), moment(data.data[i].created_time));
                        };
                        $scope.$apply(function() {
                            $scope.lstFeeds.push.apply($scope.lstFeeds, data.data);
                            deferred.resolve($scope.lstFeeds);
                        })
                    }
                },
                error: function(data, e1, e2) {}
            })
        }
        var deferred = $q.defer();
        $scope.loadMoreFeeds = function() {




            //Stop loadMore while no more data inside loadedFeeds
            if ($scope.path.length > 0) {
                $scope.GetFeeds();
                // Resolve the promise

            } else {
                deferred.reject('No more pages');
            }

            return deferred.promise;

        }
        $scope.GetAccessToken();

        $scope.SendPushNotification = function(o) {
            $http.post($rootScope.RoutePath + "pushnotification/SendPushNotification", o).then(function(response) {
                // console.log(response)
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.Reset();
                    $scope.GetAllSendFacebookFeeds(true);
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.Reset = function() {
            $scope.FormPushNotification.$setPristine();
            $scope.FormPushNotification.$setUntouched();
            $scope.init();
        }



        $scope.GetAllFacebookTimeSettings = function() {
            var params = {
                SettingName: 'PushFacebookTimeSetting'
            }
            $http.get($rootScope.RoutePath + "settings/GetSettingByName", { params: params }).then(function(data) {
                $scope.lstData = data.data;
            });
        }

        $scope.FetchLanguageById = function(o) {
            $scope.Settingmodel.Name = o.Name;
            $scope.Settingmodel.Value = o.Value;
            $scope.Settingmodel.StoreId = o.StoreId;

            $scope.SettingFlg = 1;
        }

        $scope.UpdateSettings = function(o) {

            if (o.Value._d == undefined) {
                var Hour = o.Value.getHours();
                var Min = o.Value.getMinutes();
            } else {
                var Hour = o.Value._d.getHours();
                var Min = o.Value._d.getMinutes();
            }

            var Data = ("00" + Hour.toString()).slice(-2) + ":" + ("00" + Min.toString()).slice(-2);

            o.Value = Data;
            $http.post($rootScope.RoutePath + "settings/UpdateTaxSettingByName", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetSettings();
                    $scope.GetAllFacebookTimeSettings();
                    $http.get($rootScope.RoutePath + "socketapi/UpdateAutoSendPushNotificationTime").then(function(data) {
                        // console.log(data);
                    });

                } else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });


        }

        $scope.ResetSettings = function() {
            $scope.Settingmodel.Name = '';
            $scope.Settingmodel.Value = '';
            $scope.Settingmodel.StoreId = 0;
            $scope.SettingFlg = 0;

        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)


        ];

        $scope.GetAllFacebookTimeSettings();



        $scope.FacebookCountrySetting = function(ev) {
            $mdDialog.show({
                controller: 'FacebookFeedModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/FacebookFeed/dialogs/FacebookFeedModel/FacebookFeedModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    CountryList: $scope.lstCountry,
                    event: ev,
                    FacebookFeedVM: vm,
                    FacebookCountry: $scope.FacebookCountry
                }
            })
        }

        $scope.FacebookCountry = "";

        function GetAllFacebookCountrySettings() {
            var params = {
                TaxSettingName: 'PushFacebookCountrySetting'
            }
            $http.get($rootScope.RoutePath + "settings/GetTaxSettingByName", { params: params }).then(function(data) {
                // console.log(data)
                if (data.data.success == true) {
                    if (data.data.data.Value != "") {
                        $scope.FacebookCountry = data.data.data.Value;
                        $scope.lstFacbookCountry = $scope.FacebookCountry.split(',');
                    } else {
                        $scope.FacebookCountry = "";
                        $scope.lstFacbookCountry = [];
                    };
                } else {
                    $scope.FacebookCountry = "";
                    $scope.lstFacbookCountry = [];
                };
                // $scope.lstData = data.data;
            });
        }

        $scope.DeleteFacebookCountry = function(Country) {
            var value = "";
            for (var i = 0; i < $scope.lstFacbookCountry.length; i++) {
                // console.log($scope.lstFacbookCountry[i])
                // console.log(Country)
                if (Country != $scope.lstFacbookCountry[i]) {
                    if (value != "") {
                        value = value + "," + $scope.lstFacbookCountry[i];
                    } else {
                        value = $scope.lstFacbookCountry[i];
                    };
                }
            };


            var obj = {
                Name: "PushFacebookCountrySetting",
                Value: value
            }

            $http.post($rootScope.RoutePath + "settings/UpdateTaxSettingByName", obj).then(function(response) {

                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Country Delete Successfully.")
                        .position('top right')
                        .hideDelay(3000)
                    );
                    GetAllFacebookCountrySettings();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Country Not deleted.")
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        GetAllFacebookCountrySettings();


        //Auto Sent Facbook Feed

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            // console.log($rootScope.FlgAddedEditlocal)
            vm.FlgAddedEditlocal = $rootScope.FlgAddedEditlocal;


            $scope.FilterStatus = 1;
            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml),
                DTColumnBuilder.newColumn('title'),
                DTColumnBuilder.newColumn('message'),
                DTColumnBuilder.newColumn('datetime').renderWith(DatetimeHtml),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('SendBy'),
                DTColumnBuilder.newColumn('Country'),
                // DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]

            // ShowTrackNumberModal       
            $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "pushnotification/GetAllSentFqacebookFeeds",
                    data: function(d) {
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.data.length > 0) {

                            $scope.lstdata = json.data;

                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [3, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance1 = {};

        function convertdateformat(date) {
            var sec = date.getSeconds();
            var min = date.getMinutes();
            var hour = date.getHours();

            var year = date.getFullYear();
            var month = date.getMonth() + 1; // beware: January = 0; February = 1, etc.
            var day = date.getDate();

            //return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

            return ("0000" + year.toString()).slice(-4) + "-" + ("00" + month.toString()).slice(-2) + "-" + ("00" + day.toString()).slice(-2) + " " + ("00" + hour.toString()).slice(-2) + ":" + ("00" + min.toString()).slice(-2) + ":" + ("00" + sec.toString()).slice(-2)
        }


        //Reload Datatable
        $scope.GetAllSendFacebookFeeds = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance1.reloadData(callback, resetPaging);
            $('#FacebookFeedTable').dataTable()._fnAjaxUpdate();
        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {

            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function DatetimeHtml(data, type, full, meta) {
            return convertdateformat(new Date(data));
        }

        // function actionsHtml(data, type, full, meta) {
        //     var btns = '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-click="FetchPetById(' + data.id + ')" aria-label="">' +
        //         '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
        //         '</md-button>' +
        //         '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-click="DeletePet(' + data.deviceid + ')" aria-label="">' +
        //         '<md-icon md-font-icon="icon-trash"></md-icon>' +
        //         '</md-button>';

        //     return btns;
        // };



        $scope.init();

    }
})();