(function() {
    'use strict';

    angular
        .module('app.EmailSetting')
        .controller('EmailSettingController', EmailSettingController);


    /** @ngInject */
    function EmailSettingController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                DefaultEmailFrom: '',
                NotificationEmailTo: '',
                EEMandrillKey: '',
                EEDefaultFrom: '',
                EEValidateEmailAddresses: null,
                IdApp: '',
            };
            $scope.AppName = '';
            $scope.flag = false;
            $scope.GetAllEmailSetting();
            $scope.getAllAppName();
        }

        $scope.getAllAppName = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppName = data.data;
            })
        }
        $scope.GetAllEmailSetting = function() {
            $http.get($rootScope.RoutePath + "Email/GetAllEmailSettingNew").then(function(data) {
                $scope.lstdata = data.data;
            });
        }
        $scope.AddNewEmail = function() {
            $scope.resetModel();
            $scope.flag = true;
        }

        $scope.resetModel = function() {
            $scope.model = {
                id: '',
                DefaultEmailFrom: '',
                NotificationEmailTo: '',
                EEMandrillKey: '',
                EEDefaultFrom: '',
                EEValidateEmailAddresses: null,
                IdApp: '',
            };
            $scope.AppName = '';
            $scope.formEmailSetting.$setUntouched();
            $scope.formEmailSetting.$setPristine();
        }

        $scope.reset = function() {
            $scope.flag = false;
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.resetModel();

        }

        $scope.GetEmailTemplateByAppId = function() {
            var obj = _.findWhere($scope.lstdata, { IdApp: parseInt($scope.model.IdApp) })
            if (obj != null && obj != undefined && obj != '') {
                $scope.model.id = obj.id;
                $scope.model.DefaultEmailFrom = obj.DefaultEmailFrom;
                $scope.model.NotificationEmailTo = obj.NotificationEmailTo;
                $scope.model.EEMandrillKey = obj.EEMandrillKey;
                $scope.model.EEDefaultFrom = obj.EEDefaultFrom;
                $scope.model.EEValidateEmailAddresses = obj.EEValidateEmailAddresses;
                $scope.model.IdApp = obj.IdApp;
            } else {
                $scope.model.id = '';
                $scope.model.DefaultEmailFrom = '';
                $scope.model.NotificationEmailTo = '';
                $scope.model.EEMandrillKey = '';
                $scope.model.EEDefaultFrom = '';
                $scope.model.EEValidateEmailAddresses = null;
            }
        }

        $scope.GetEmailSetting = function() {
            $http.get($rootScope.RoutePath + "Email/GetEmailSetting").then(function(data) {
                if (data.data.data != null) {
                    $scope.model.id = data.data.data.id;
                    $scope.model.DefaultEmailFrom = data.data.data.DefaultEmailFrom;
                    $scope.model.NotificationEmailTo = data.data.data.NotificationEmailTo;
                    $scope.model.EEMandrillKey = data.data.data.EEMandrillKey;
                    $scope.model.EEDefaultFrom = data.data.data.EEDefaultFrom;
                    $scope.model.EEValidateEmailAddresses = data.data.data.EEValidateEmailAddresses;
                }
            });
        }
        $scope.editEmailSettingById = function(o) {
            $scope.flag = true;
            $scope.model.id = o.id;
            $scope.model.DefaultEmailFrom = o.DefaultEmailFrom;
            $scope.model.NotificationEmailTo = o.NotificationEmailTo;
            $scope.model.EEMandrillKey = o.EEMandrillKey;
            $scope.model.EEDefaultFrom = o.EEDefaultFrom;
            $scope.model.EEValidateEmailAddresses = o.EEValidateEmailAddresses;
            $scope.model.IdApp = o.IdApp;
            $scope.AppName = o.tblappinfo.AppName;
        }

        $scope.SaveEmailSetting = function(o) {
            $http.post($rootScope.RoutePath + "Email/SaveEmailSetting", o).then(function(data) {
                if (data.data.success == false) {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    }
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                // $rootScope.FlgAddedEditlocal = false;
                $scope.init();
            });

        }


        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(25)
            .withOption('responsive', true)
            // .withOption('autoWidth', true)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('deferRender', true)
            .withOption('paging', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto'),

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
            ];
        $scope.dtInstance = {};
        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);
            $scope.dtInstance.DataTable.search(Search).draw();
        };

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();