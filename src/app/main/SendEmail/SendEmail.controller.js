(function() {
    'use strict';

    angular
        .module('app.SendEmail')
        .controller('SendEmailController', SendEmailController);


    /** @ngInject */
    function SendEmailController($http, $rootScope, $scope, $state, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                EmailSubject: '',
                EmailTo: '',
                EmailBody: '',
            }
        }


        $scope.SendEmail = function(o) {
            $http.post($rootScope.RoutePath + "email/sendemail", o).then(function(response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.Reset();
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        $scope.Reset = function() {
            $scope.FormSendEmail.$setPristine();
            $scope.FormSendEmail.$setUntouched();
            $scope.init();
        }

        $scope.init();
    }

})();
