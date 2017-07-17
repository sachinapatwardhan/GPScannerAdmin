(function() {
    'use strict';

    angular
        .module('app.EmailSetting')
        .controller('EmailSettingController', EmailSettingController);


    /** @ngInject */
    function EmailSettingController($http, $rootScope, $scope, $state, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                DefaultEmailFrom: '',
                NotificationEmailTo: '',
                EEMandrillKey: '',
                EEDefaultFrom: '',
                EEValidateEmailAddresses: null,
            };
            $scope.GetEmailSetting();
            $scope.tab = { selectedIndex: 0 };
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
                $rootScope.FlgAddedEditlocal = false;
                $scope.init();
            });

        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();
