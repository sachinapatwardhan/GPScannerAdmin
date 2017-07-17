(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, $state, $rootScope, $timeout, $http, $cookieStore, $mdDialog, $document, $mdToast, $stateParams, $window) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                UserName: '',
                Password: '',
                RemeberMe: false
            }
        }

        $scope.Login = function(o) {
            var params = {
                username: o.UserName,
                password: o.Password
            }
            $http.get($rootScope.RoutePath + "account/login", { params: params }).then(function(data) {

                if (data.data.success == true) {

                    $scope.RoleWiseCountry = data.data.RolewiseCountryList;
                    var CountryList = "";
                    for (var i = 0; i < $scope.RoleWiseCountry.length; i++) {
                        if (CountryList == "") {
                            if ($scope.RoleWiseCountry[i] != "" && $scope.RoleWiseCountry[i] != null) {
                                CountryList = $scope.RoleWiseCountry[i];
                            }
                        } else {
                            if ($scope.RoleWiseCountry[i] != "" && $scope.RoleWiseCountry[i] != null) {
                                CountryList = CountryList + "," + $scope.RoleWiseCountry[i];
                            }
                        }
                    }
                    $scope.splitCountryList = CountryList.split(",")
                    $cookieStore.put('UserImage', data.data.UserImage);
                    $cookieStore.put('UserId', data.data.UserId);
                    $cookieStore.put('UserCountry', data.data.UserCountry);
                    $cookieStore.put('UserRoles', data.data.UserRoles);
                    $rootScope.UserImage = $cookieStore.get('UserImage');
                    $cookieStore.put('UserName', o.UserName);
                    $cookieStore.put('token', data.data.token);
                    $cookieStore.put('CountryList', _.uniq($scope.splitCountryList));

                    $http.defaults.headers.common['Authorization'] = data.data.token; // jshint ignore:line
                    $window.location.href = '/#/Dashboard';

                    $timeout(function() {
                        $window.location.reload();
                    });


                    // window.location.href = "/#/Dashboard";
                    // $state.go('app.Dashboard');

                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                };


            });

        }

        $scope.ShowForgotPassword = function(ev, o) {
            $state.go('app.Forgotpassword');
        }

        $scope.ShowRegister = function(ev, o) {
            $state.go('app.Register');
        }


        //////////
    }
})();
