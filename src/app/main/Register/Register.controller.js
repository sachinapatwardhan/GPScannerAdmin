(function() {
    'use strict';

    angular
        .module('app.Register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($http, $scope, $rootScope, $state, $mdToast, $document, $cookieStore, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.init = function() {
            $scope.model = {
                email: '',
                username: '',
                password: '',
                cpassword: '',
                phone: '',
                country: '',
                state: '',
                city: '',
                gender: 'Male',
                createdby: '',
                createddate: new Date(),
            };
            GetAllCountry();
        }

        function GetAllCountry() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.GetAllStateByCountry = function(idCountry) {
            for (var i = 0; i < $scope.lstCountry.length; i++) {
                if ($scope.lstCountry[i].Country == idCountry) {
                    idCountry = $scope.lstCountry[i].id;
                }
            }
            $scope.model.idState = '';
            $scope.lstState = '';
            $scope.model.idCity = '';
            $scope.lstCity = '';
            var params = {
                CountryId: idCountry
            };
            $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(data) {
                $scope.lstState = data.data;

            });
        }

        $scope.GetAllCityByState = function(idState) {
            for (var i = 0; i < $scope.lstState.length; i++) {
                if ($scope.lstState[i].Name == idState) {
                    idState = $scope.lstState[i].id;
                }
            }
            $scope.model.idCity = '';
            $scope.lstCity = '';
            var params = {
                StateId: idState
            };
            $http.get($rootScope.RoutePath + "city/GetAllCityByStateId", { params: params }).success(function(data) {
                $scope.lstCity = data.data;

            });
        }

        $scope.Register = function(o) {
            o.IsMobileVerify = false;
            o.createdby = o.username;
            o.idApp = $cookieStore.get('appId');
            if (o.password.length < 6) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Enter six digit Password.")
                    .position('top right')
                    .hideDelay(3000)
                );

                return;
            } else if (o.password != o.cpassword) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Password and confirm password must be same.")
                    .position('top right')
                    .hideDelay(3000)
                );

                return;
            } else {

                $http.post($rootScope.RoutePath + "account/register", o).success(function(data) {
                    if (data.success == 1) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        window.location.href = "/#/app/login";
                        $scope.init();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });

            }
        }

        $scope.Cancel = function() {
            $scope.RegisterForm.$setUntouched();
            $scope.RegisterForm.$setPristine();
            $scope.init();
        }
        $scope.ShowLogin = function(ev, o) {
            $state.go('app.login');
        }
        $scope.init();
    }

})();