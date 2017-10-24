(function() {
    'use strict';

    angular
        .module('app.ModuleMgmt')
        .controller('ModuleMgmtController', ModuleMgmtController);

    /** @ngInject */
    function ModuleMgmtController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        // vm.getAllSIMInfo = getAllSIMInfo;
        $scope.init = function() {
            $scope.model = {
                id: 0,
                Module: '',
                IsActive: false,
                DisplayOrder: null,
            }
            $scope.Search = '';
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            getAllmodule();
        }


        function getAllmodule() {
            $http.get($rootScope.RoutePath + "module/GetAllModuleName").then(function(data) {
                $scope.lstModule = data.data;
            })
        }

        $scope.SaveModule = function(o) {
            var url = '';
            if (o.id == 0) {
                url = $rootScope.RoutePath + "module/CreateModule";
            } else {
                url = $rootScope.RoutePath + "module/UpdateModule";
            }
            $http.post(url, o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    $scope.ResetModel();
                    getAllmodule();
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
        $scope.editModuleById = function(o) {
            $scope.model.id = o.id;
            $scope.model.Module = o.Module;
            $scope.model.DisplayOrder = parseInt(o.DisplayOrder);
            if (o.IsActive == 1) {
                $scope.model.IsActive = true;
            } else {
                $scope.model.IsActive = false;
            }
            $scope.flag = true;
        }

        $scope.DeleteModule = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Module ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idModule: Id
                };
                $http.get($rootScope.RoutePath + "module/DeleteModule/" + Id, ).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        getAllmodule();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });
        }

        $scope.resetForm = function() {
            $scope.formModule.$setUntouched();
            $scope.formModule.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                Module: '',
                IsActive: false,
                DisplayOrder: null,
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
                IsActive: false,
                DisplayOrder: null,
            }
            $scope.Search = '';
            $scope.flag = false;
            $scope.resetForm();
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        $scope.dtInstance = {};
        $scope.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
            // dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [],
            initComplete: function() {
                var api = this.api(),
                    searchBox = angular.element('body').find('#modelsearch');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function(event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType: 'full_numbers',
            lengthMenu: [25, 30, 50, 100],
            pageLength: 25,
            scrollY: 'auto',
            responsive: true
        };
        $scope.DownloadExcelTemplate = function() {
            window.location = $rootScope.RoutePath + "sim/DownloadTemplate";
        }

        $scope.ShowImportSimModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportSIMController',
                controllerAs: 'vm',
                templateUrl: 'app/main/SIM/dialogs/ImportSIM/ImportSIM.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Obj: vm,
                }
            })
        }


        $scope.init();
        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };

    }

})();