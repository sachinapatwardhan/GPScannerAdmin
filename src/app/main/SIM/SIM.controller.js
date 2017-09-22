(function() {
    'use strict';

    angular
        .module('app.SIM')
        .controller('SIMController', SIMController);

    /** @ngInject */
    function SIMController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        vm.getAllSIMInfo = getAllSIMInfo;
        $scope.init = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: '',
                CreatedDate: '',
            }

            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            getAllSIMInfo();
            $scope.GetAlltelco();
        }

        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }

        function getAllSIMInfo() {
            $http.get($rootScope.RoutePath + "sim/GetAllSIMInfo").then(function(data) {
                $scope.lstSIMInfo = data.data;
            })
        }

        $scope.SaveSIMInfo = function(o) {
            $http.post($rootScope.RoutePath + "sim/SaveSIMInfo", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    $scope.getAllSIMInfo();
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
        $scope.editSIMById = function(o) {
            $scope.model.Id = o.id;
            $scope.model.SerialNum = o.SerialNum;
            $scope.model.PhoneNum = parseInt(o.PhoneNum);
            $scope.model.idTelCo = o.idTelCo;
            $scope.model.CreatedDate = o.CreatedDate;
            $scope.flag = true;
        }

        $scope.DeleteSIM = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this SIM ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "sim/DeleteSIMInfo", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.getAllSIMInfo();
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
            $scope.formSIMInfo.$setUntouched();
            $scope.formSIMInfo.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: '',
                CreatedDate: '',
            }

            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: '',
                CreatedDate: '',
            }

            $scope.flag = false;
            $scope.resetForm();
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            // DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        $scope.dtInstance = {};
        $scope.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
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
        $scope.ExportExcel = function() {
            window.location = $rootScope.RoutePath + "sim/Export";
        }

        $scope.init();


    }

})();