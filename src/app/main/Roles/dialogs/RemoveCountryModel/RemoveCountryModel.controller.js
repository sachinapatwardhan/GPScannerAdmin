(function() {
    'use strict';

    angular
        .module('app.roles')
        .controller('RemoveCountryModelController', RemoveCountryModelController);

    /** @ngInject */
    function RemoveCountryModelController(CountrydtColumnDefs1, $http, DTOptionsBuilder, DTColumnDefBuilder, $mdDialog, $mdToast, $scope, $rootScope, CountryList, event, RoleVM, RoleCountry, FlgDeletedAccess, RoleObj) {
        var vm = this;
        vm.FlgDeletedAccess = FlgDeletedAccess
        vm.CountrydtColumnDefs1 = CountrydtColumnDefs1
            // console.log(vm.CountrydtColumnDefs1)
        $scope.init = function() {
            $scope.model = {
                Country: 'All',
            };
            // GetAllLanguage();
        }

        $scope.lstCountry = CountryList;
        $scope.RoleObj = RoleObj;

        if (RoleCountry != "" && RoleCountry != null) {
            $scope.lstCountryData = RoleCountry.split(',');
        };

        $scope.DeleteCountry = function(country, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Country?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {

                $scope.countrylist = _($scope.lstCountryData).filter(function(item) {
                    return item !== country
                });

                var Country = "";

                if ($scope.countrylist.length > 0) {

                    for (var i = 0; i < $scope.countrylist.length; i++) {
                        if (Country == "") {
                            Country = $scope.countrylist[i];
                        } else {
                            Country = Country + "," + $scope.countrylist[i];
                        }
                    }
                }

                $scope.RoleObj.Country = Country;

                $http.post($rootScope.RoutePath + "role/SaveRole", $scope.RoleObj).then(function(response) {
                    if (response.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country Deleted Successfully.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                        $scope.closeModel();
                        RoleVM.GetAllRoles();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country could not Delete.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            }, function() {
                RoleVM.RemoveCountryToRole($scope.RoleObj);
            });
        }

        $scope.SaveCountry = function(country) {
            var IsCountryExist = false;

            if (RoleCountry != "" && RoleCountry != null) {
                var lstCountryData = RoleCountry.split(',');

                var objCountry = _.find(lstCountryData, function(item) {
                    return item == country;
                })


                if (objCountry) {
                    IsCountryExist = true;
                };
            };
            if (!IsCountryExist) {

                var Value = "";

                if (RoleCountry == "" || RoleCountry == null) {
                    Value = country;
                    RoleCountry = Value;
                } else {
                    Value = RoleCountry + "," + country;
                    RoleCountry = Value;
                }

                $scope.RoleObj.Country = RoleCountry;
                $http.post($rootScope.RoutePath + "role/SaveRole", $scope.RoleObj).then(function(response) {
                    if (response.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country Added Successfully.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                        $scope.closeModel();
                        RoleVM.GetAllRoles();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent("Country could not Added.")
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Country already Exist.")
                    .position('top right')
                    .hideDelay(3000)
                );
            }
        }

        $scope.CountrydtColumnDefs1 = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
        ];

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.Reset = function() {

        }
        $scope.init();
    }
})();