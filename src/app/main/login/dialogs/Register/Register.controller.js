(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($http, $mdDialog, $mdToast, $scope, $rootScope, $cookieStore, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

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
                gender: '',
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
            var params = {
                CountryId: idCountry
            };
            $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(data) {
                $scope.lstState = data.data;

            });
        }


        $scope.Register = function(o) {
            o.createdby = o.username;
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
                    // console.log(data);
                    if (data.success == 1) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $mdDialog.hide();
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
            $mdDialog.hide();
            $scope.init();
        }
        $scope.init();
    }
})();