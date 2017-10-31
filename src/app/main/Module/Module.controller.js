(function() {
    'use strict';

    angular
        .module('app.Module')
        .controller('ModuleController', ModuleController);


    /** @ngInject */
    function ModuleController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: 0,
                Module: '',
                IsActive: true,
                DisplayOrder: 0,
            }
            $scope.Search = '';
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            $scope.GetAllModule();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetAllModule = function() {
            $http.get($rootScope.RoutePath + "module/GetAllModuleName").then(function(data) {
                $scope.lstModules = data.data;
                for (var i = 0; i < $scope.lstModules.length; i++) {
                    if ($scope.lstModules[i].IsActive == 1) {
                        $scope.lstModules[i].IsActive = true;
                    } else {
                        $scope.lstModules[i].IsActive = false;
                    }
                    $scope.lstModules.IsUpdate = false;
                };
            });
        }

        $scope.SaveModuleData = function(o) {
            $http.post($rootScope.RoutePath + "module/UpdateModule", o).then(function(data) {
                if (data.data.success == false) {
                    if (data.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                o.IsUpdate = false;
            });
        }
        $scope.SaveModule = function(o) {

            $http.post($rootScope.RoutePath + "module/CreateModule", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    $scope.ResetModel();
                    $scope.GetAllModule();
                    // $scope.getAllSIMInfo();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }

            })
        }
        $scope.FetchmoduleById = function(o) {
            o.IsUpdate = true;
        }

        $scope.ResetEdit = function(o) {
            o.IsUpdate = false;
            $scope.GetAllModule();
        }


        // $scope.Reset = function() {
        //     $scope.init();
        // }
        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                Module: '',
                IsActive: true,
                DisplayOrder: 0,
            }
            $scope.Search = '';
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }
        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                Module: '',
                IsActive: true,
                DisplayOrder: 0,
            }
            $scope.Search = '';
            $scope.flag = false;
            $scope.resetForm();
        }
        $scope.resetForm = function() {
            $scope.formModule.$setUntouched();
            $scope.formModule.$setPristine();
        }
        $scope.DeleteModule = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Module?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idModule: Id
                };
                $http.get($rootScope.RoutePath + "module/DeleteModule/" + Id).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        $scope.GetAllModule();
                    } else {
                        var confirm = $mdDialog.confirm()
                            .title('Are you force to Delete this Module?')
                            .ok('Ok')
                            .cancel('Cancel')
                        $mdDialog.show(confirm).then(function() {
                            var params = {
                                idModule: Id
                            };
                            $http.get($rootScope.RoutePath + "module/DeleteModuleAndpermission/" + Id).success(function(data) {
                                if (data.success == true) {
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .textContent(data.message)
                                        .position('top right')
                                        .hideDelay(3000)
                                    );
                                    $scope.ResetModel();
                                    $scope.GetAllModule();
                                } else {
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .textContent(data.message)
                                        .position('top right')
                                        .hideDelay(3000)
                                    );
                                }
                            })
                        })
                    }
                });
            });
        }



        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(100)
            .withOption('responsive', true)
            // .withOption('autoWidth', true)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('deferRender', true)
            .withOption('paging', false)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto'),

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3).notSortable(),
            ];
        $scope.dtInstance = {};

        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };
        $scope.init();
    }

})();