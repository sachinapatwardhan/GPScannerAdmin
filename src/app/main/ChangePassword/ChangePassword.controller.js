(function() {
    'use strict';

    angular
        .module('app.ChangePassword')
        .controller('ChangePasswordController', ChangePasswordController);

    /** @ngInject */
    function ChangePasswordController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                username: $cookieStore.get('UserName'),
                oldpassword: '',
                password: '',
                confirmpassword: '',
            };
        }

        $scope.ChangePassword = function(o) {
            $http.post($rootScope.RoutePath + "account/changepassword", o).then(function(response) {

                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    // $scope.GetAllBanner();
                    $rootScope.FlgAddedEditlocal = false;
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
            if ($rootScope.FlgAddedAccess == true) {
                $scope.model = {
                    oldpassword: '',
                    password: '',
                    confirmpassword: '',
                };
                $scope.FormChangePassword.$setUntouched();
                $scope.FormChangePassword.$setPristine();
            }
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }
})();
