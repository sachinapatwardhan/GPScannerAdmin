(function () {
    'use strict';

    angular
        .module('app.Provider')
        .controller('ProviderModelController', ProviderModelController);

    /** @ngInject */
    function ProviderModelController($http, $mdDialog, $scope, $cookieStore, objMedia, Tasks, event, MediaVM, $mdToast, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
        var vm = this;

        $scope.task = Tasks;

        $scope.init = function () {
            $scope.tab = { selectedIndex: 0 };
            $scope.model = {
                Id: '',
                StoreId: 0,
                TaxCategoryId: 0,
                CountryId: 0,
                StateProvinceId: 0,
                Zip: '',
                Percentage: '',
            }
            $scope.GetCountry();
            $scope.GetAllTaxCategory();

            $scope.GetAllTaxRate();
        }

        $scope.GetAllTaxCategory = function () {
            $http.get($rootScope.RoutePath + "taxcategory/GetAllTaxCategory").then(function (response) {
                $scope.lstTaxCategory = response.data;
            });
        }

        $scope.GetCountry = function () {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (response) {
                $scope.lstcountry = response.data;
            });
        }

        $scope.GetAllStateByCountryId = function (id) {
            $scope.model.State = '';
            $scope.lststate = [];
            $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId?CountryId=" + id).then(function (response) {
                if (response.data.success == true) {
                    $scope.lststate = response.data.data;
                } else {
                    $scope.lststate = [];
                }
            });
        }

        $scope.GetAllTaxRate = function () {
            $http.get($rootScope.RoutePath + "taxrate/GetAllTaxRate").then(function (response) {
                $scope.LstTaxRate = response.data;
            });
        }

        $scope.SaveTaxRate = function (o) {
            $http.post($rootScope.RoutePath + "taxrate/SaveTaxRate", o).then(function (response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );

                    $scope.init();
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

        $scope.EditTaxRate = function (o) {

            $scope.tab = { selectedIndex: 1 };

            $scope.model.Id = o.Id;
            $scope.model.StoreId = 0;
            $scope.model.TaxCategoryId = o.TaxCategoryId;
            $scope.model.CountryId = o.CountryId;
            $scope.GetAllStateByCountryId($scope.model.CountryId);
            $scope.model.StateProvinceId = o.StateProvinceId;
            $scope.model.Zip = o.Zip;
            $scope.model.Percentage = o.Percentage;
        }

        $scope.DeleteTaxRate = function (id) {

            $http.get($rootScope.RoutePath + "taxrate/DeleteTaxRate?idTaxRate=" + id).then(function (response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllTaxRate();
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

        $scope.closeModel = function () {
            $mdDialog.hide();
        }

        $scope.ResetEdit = function () {
            $scope.formCreateTaxRate.$setPristine();
            $scope.formCreateTaxRate.$setUntouched();
            $scope.model = {
                Id: '',
                StoreId: 0,
                TaxCategoryId: 0,
                CountryId: 0,
                StateProvinceId: 0,
                Zip: '',
                Percentage: '',
            }
        }

        $scope.dtColumnDefsProvider = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];


        $scope.Reset = function () {
            $scope.init();
        }

        $scope.init();
    }
})();
