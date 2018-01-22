(function() {
    'use strict';

    angular
        .module('app.Customer')
        .controller('ChangePasswordCustomerController', ChangePasswordCustomerController);

    /** @ngInject */
    function ChangePasswordCustomerController($mdToast, $document, $http, $mdDialog, $scope, obj, Tasks, event, VM, $rootScope) {
        var vm = this;
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.init = function() {
            $scope.model = {
                username: obj.username,
                oldpassword: '',
                password: '',
                confirmpassword: '',
                UserId: obj.id,
            };
        }


        $scope.ChangePassword = function(ev, o) {
            if (o.confirmpassword != o.password) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Password and Confirm Password does not match...')
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {
                $mdDialog.show({
                    // skipHide: true,
                    controller: 'PasswordConifrmationController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/Customer/dialogs/PasswordConfirmation/PasswordConfirmation.html',
                    parent: angular.element($document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    locals: {
                        obj: o,
                        Tasks: [],
                        event: ev,
                        VM: vm,
                        flg: 0
                    }
                })
            }
        }
        $scope.ChangePassword1 = function(o) {
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
                    $scope.closeModel1();
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
                    username: obj.username,
                    oldpassword: '',
                    password: '',
                    confirmpassword: '',
                };
                $scope.FormChangePassword.$setUntouched();
                $scope.FormChangePassword.$setPristine();
            }
        }

        $scope.closeModel1 = function() {
            $mdDialog.hide();
        }
        $scope.init();
    }
})();