(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController)
        .directive('autoFillableField', [
            '$timeout',
            function($timeout) {
                return {
                    require: '?ngModel',
                    restrict: 'A',
                    link: function(scope, element, attrs, ngModel) {

                        $timeout(function() {
                            if (ngModel.$viewValue !== element.val()) {
                                ngModel.$setViewValue(element.val());
                            }
                        }, 1500);
                    }
                };
            }
        ]);

    /** @ngInject */
    function LoginController($scope, $state, $rootScope, $timeout, $http, $cookieStore, $mdDialog, $document, $mdToast, $stateParams, $window, msNavigationService) {
        var vm = this;
        $('.logo').css('background-image', 'url(' + localStorage.getItem('Logo') + ')');
        //  $('#forgot-password-form .logo').css('background-image', 'url(' + $rootScope.Logo + ')');
        $scope.init = function() {
            $scope.model = {
                UserName: '',
                Password: '',
                RemeberMe: false
            }

            var Remeber = $cookieStore.get('RemeberMe');
            var Logout = $cookieStore.get('FlagLogout');
            if (Remeber == true) {
                $scope.model.UserName = $cookieStore.get('RemeberUserName');
                $scope.model.Password = $cookieStore.get('RemeberPassword');
                $scope.model.RemeberMe = true;
            } else {
                $scope.model.RemeberMe = false;
                $cookieStore.remove('RemeberMe');
                $cookieStore.remove('RemeberUserName');
                $cookieStore.remove('RemeberPassword');
                $cookieStore.remove('FlagLogout');

            }

            // if ($rootScope.flgLogout != true) {
            //     $rootScope.flgLogout = false;
            //     if (Remeber == 'true' && Logout == 'false') {
            //         $scope.Login($scope.model, true, false);
            //     }
            // }

        }

        $scope.setUserName = function() {

            if ($scope.model.UserName !== document.getElementsByName("email")[0].value) {
                $scope.model.UserName = document.getElementsByName("email")[0].value;
            }
            // alert("Call")
        }

        $scope.setPassword = function() {

            if ($scope.model.Password !== document.getElementsByName("password")[0].value) {
                $scope.model.Password = document.getElementsByName("password")[0].value;
            }
            // alert("Call")
        }

        $scope.Login = function(o, form, isLogout) {
            if (form) {
                $cookieStore.put('isAllowMultipleTabs', true);
                sessionStorage.setItem('isLogin', true);
                $cookieStore.put('RemeberMe', o.RemeberMe);
                $cookieStore.put('RemeberUserName', o.UserName);
                $cookieStore.put('RemeberPassword', o.Password);
                $cookieStore.put('FlagLogout', false);
                var params = {
                    username: o.UserName,
                    password: o.Password,
                    appId: localStorage.getItem('appId'),
                }
                $http.get($rootScope.RoutePath + "account/loginNew", { params: params }).then(function(data) {
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
                        // $cookieStore.put('appId', data.data.appId);
                        msNavigationService.clearNavigation();
                        $http.defaults.headers.common['Authorization'] = data.data.token; // jshint ignore:line
                        $rootScope.MenuSet();
                        $window.location.href = '/#/Dashboard';

                        // $timeout(function() {
                        //     $window.location.reload();
                        // });


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
        }

        $scope.ShowForgotPassword = function(ev, o) {
            $state.go('app.Forgotpassword');
        }

        $scope.ShowRegister = function(ev, o) {
            $state.go('app.Register');
        }
        $scope.init();

        //////////
    }
})();