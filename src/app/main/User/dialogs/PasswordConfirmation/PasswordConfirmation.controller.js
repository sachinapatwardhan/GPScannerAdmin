(function() {
    'use strict';

    angular
        .module('app.user')
        .controller('UserPasswordConifrmationController', UserPasswordConifrmationController);

    /** @ngInject */
    function UserPasswordConifrmationController($mdToast, $http, $mdDialog, $scope, obj, Tasks, event, VM, $rootScope, flg) {

        $scope.username = obj.username;
        var vm = this;
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.flg = flg;
        $scope.init = function() {
            $scope.pssword = '';
        }

        $scope.RestPassword = function(password) {
            var params = {
                // email: $scope.obj.email,
                // idApp: $rootScope.appId,
                id: obj.id,
                AppName: obj.AppName,
                password: password
            }
            ShowLoader();
            $http.get($rootScope.RoutePath + "account/forgotpasswordfromOwnerCustomerNew", { params: params }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else {
                    if (data.data.data == 'TOKEN') {
                        $cookieStore.remove('UserName');
                        $cookieStore.remove('token');
                        $state.go('app.login', {
                            cache: false
                        });
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }

                }
                $mdDialog.hide();
                HideLoader();
            });

        }

        $scope.changePassword = function(pass) {
            var params = {
                password: pass,
            }
            ShowLoader();
            $http.get($rootScope.RoutePath + "account/passwordVerification", { params: params }).then(function(data) {
                if (data.data.success == true) {
                    // obj.AppName = localStorage.getItem('appName');
                    $http.post($rootScope.RoutePath + "account/changepasswordNew", obj).then(function(response) {
                        if (response.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(response.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $rootScope.FlgAddedEditlocal = false;
                            $scope.closeModel1();
                            HideLoader();
                        } else {
                            if (response.data.data == 'TOKEN') {
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
                        $mdDialog.hide();
                        HideLoader();
                    });
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $mdDialog.hide();
                    HideLoader();
                }
            })

        }

        $scope.Reset = function() {
            $scope.pssword = '';
            $mdDialog.hide();
        }

        $scope.closeModel1 = function() {
            $mdDialog.hide();
        }

        function ShowLoader() {
            document.getElementById('processing1').style.display = "block";
            document.body.scrollTop = "0px";
        }

        function HideLoader() {
            document.getElementById('processing1').style.display = "none";
        }
        $scope.init();
    }
})();