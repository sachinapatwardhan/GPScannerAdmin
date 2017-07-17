(function () {
    'use strict';

    angular
        .module('app.Warehouse')
        .controller('WarehouseController', WarehouseController);

    /** @ngInject */
    function WarehouseController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function () {
            $scope.model = {
                Id: '',
                Name: '',
                AdminComment: '',
                City: '',
                StateProvinceId: '',
                CountryId: '',
                PhoneNumber: '',
                ZipPostalCode: '',
                AddressId: 0,
                Address1: '',
                CreatedOnUtc: null
            };
            $scope.GetAllWarehouse();
            $scope.GetAllCountry();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllWarehouse = function () {
            $http.get($rootScope.RoutePath + "warehouse/GetAllWarehouse").then(function (data) {
                $scope.lstWarehouse = data.data;
            });
        }

        $scope.GetAllCountry = function () {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.GetAllStateByCountry = function (idCountry) {
            $scope.lstState = '';
            $scope.model.CountryId = idCountry;
            var params = {
                CountryId: idCountry
            };
            $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function (data) {
                $scope.lstState = data.data;

            });
        }

        $scope.CreateWarehouse = function (o) {
            o.CreatedOnUtc = new Date();
            $http.post($rootScope.RoutePath + "warehouse/SaveWarehouse", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                );
                    $scope.init();
                }
                else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                              $mdToast.simple()
                             .textContent(data.data.message)
                             .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });

        }

        $scope.FetchWarehouseById = function (o) {
            $scope.tab.selectedIndex = 1;
            $scope.model.Id = o.Id;
            $scope.model.Name = o.Name;
            $scope.model.AdminComment = o.AdminComment;
            $scope.model.City = o.address.City;
            $scope.model.StateProvinceId = o.address.StateProvinceId;
            $scope.model.CountryId = o.address.CountryId;
            $scope.model.PhoneNumber = parseInt(o.address.PhoneNumber);
            $scope.model.ZipPostalCode = parseInt(o.address.ZipPostalCode);
            $scope.model.AddressId = o.AddressId;
            $scope.model.Address1 = o.address.Address1;
            $scope.model.CreatedOnUtc = o.address.CreatedOnUtc;
            $scope.GetAllStateByCountry($scope.model.CountryId);
        }


        $scope.Reset = function () {
            $scope.init();
        }


        //vm.dtOptions = DTOptionsBuilder.newOptions()
        //    .withPaginationType('full_numbers')
        //    .withDisplayLength(10)
        //    .withOption('responsive', true)
        //    .withOption('autoWidth', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //    .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];


        $scope.resetForm = function () {
            $scope.formWarehouse.$setUntouched();
            $scope.formWarehouse.$setPristine();
        }


        $scope.ResetModel = function () {
            $scope.model = {
                Id: '',
                Name: '',
                AdminComment: '',
                City: '',
                StateProvinceId: '',
                CountryId: '',
                PhoneNumber: '',
                ZipPostalCode: '',
                Address1: '',
            };
            $scope.resetForm();
        }

        $scope.init();
    }

})();
