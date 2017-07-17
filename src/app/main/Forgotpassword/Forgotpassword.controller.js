(function() {
    'use strict';

    angular
        .module('app.Forgotpassword')
        .controller('ForgotpasswordController', ForgotpasswordController);

    /** @ngInject */
    function ForgotpasswordController($scope, $state, $rootScope, $http, $cookieStore, $mdDialog, $document, $mdToast, $timeout) {
        console.log("call");
        $scope.init = function() {
            $scope.model = {
                email: ''
            }
        }

        $scope.ResetPassword = function() {
            var Email = $scope.model.email;
            $http.get($rootScope.RoutePath + "account/forgotpassword?email=" + Email.toLowerCase()).then(function(response) {
                console.log(response);
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.email = '';
                    $timeout(function() {
                        $state.go('app.login', {
                            cache: false
                        });
                    }, 1500);

                } else {
                    if (response.data.data == 'TOKEN') {
                        $cookieStore.remove('UserName');
                        $cookieStore.remove('token');
                        $state.go('app.login', {
                            cache: false
                        });
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

        $scope.init();
    }
})();
