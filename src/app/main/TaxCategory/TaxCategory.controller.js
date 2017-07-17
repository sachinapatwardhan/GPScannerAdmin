(function() {
    'use strict';

    angular
        .module('app.TaxCategory')
        .controller('TaxCategoryController', TaxCategoryController);

    /** @ngInject */
    function TaxCategoryController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {

            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }
            $scope.model = {
                Id: '',
                Name: '',
                DisplayOrder: null
            };
            $scope.GetAllTaxCategory();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllTaxCategory = function() {
            $http.get($rootScope.RoutePath + "taxcategory/GetAllTaxCategory").then(function(data) {
                $scope.lstTextCategory = data.data;
            });
        }

        $scope.CreateTaxCategory = function(o) {
            $http.post($rootScope.RoutePath + "taxcategory/savetaxcategory", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }

                    $scope.init();
                } else {
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

        $scope.FetchTaxCategoryById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model.Id = o.Id;
            $scope.model.Name = o.Name;
            $scope.model.DisplayOrder = o.DisplayOrder;
        }

        $scope.DeleteTaxCategory = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idTaxCategory: id
                };
                $http.get($rootScope.RoutePath + "taxcategory/DeleteTaxCategory", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                    } else {
                        if (data.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            });
        };

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
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
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            // DTColumnDefBuilder.newColumnDef(4),
            // DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.resetForm = function() {
            $scope.formTaxCategory.$setUntouched();
            $scope.formTaxCategory.$setPristine();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.ResetModel = function() {
            if ($rootScope.FlgAddedAccess == true) {

                $scope.model = {
                    Id: '',
                    Name: '',
                    DisplayOrder: null
                };
                $scope.resetForm();
            }
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();
