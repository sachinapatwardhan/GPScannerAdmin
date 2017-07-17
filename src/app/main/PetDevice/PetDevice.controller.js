(function() {
    'use strict';

    angular
        .module('app.PetDevice')
        .controller('PetDeviceController', PetDeviceController);

    /** @ngInject */
    function PetDeviceController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, $cookieStore, DTColumnBuilder, $compile) {
        var vm = this;
        vm.GetPetDevice = GetPetDevice;
        $scope.init = function() {
            $scope.model = {
                id: '',
                DeviceId: '',
                IMEI: '',
                CreatedDate: new Date(),
                Latitude: '',
                Longitude: '',
                speed: '',
                Direction: '',
                Type: '',
                IsOldDevice: 0,
                Version: '',
                CreatedBy: $rootScope.UserName,
                CarrierId: null,
                CountryId: null,
            };
            $scope.GetAllCountry();
            $scope.GetAllCarrier();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllCarrier = function() {
            $http.get($rootScope.RoutePath + "carrier/GetAllCarrier").then(function(data) {
                $scope.lstCarrier = data.data;
            });
        }

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.CreatePetDevice = function(o) {
            $http.post($rootScope.RoutePath + "PetDevice/SavePetDevice", o).then(function(data) {
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
                    $scope.resetForm();
                    $scope.init();
                } else {
                    if (data.data.data == 'TOKEN') {

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

        $scope.ShowImportPetDeviceModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportPetDeviceController',
                controllerAs: 'vm',
                templateUrl: 'app/main/PetDevice/dialogs/ImportPetDevice/ImportPetDeviceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Obj: vm,
                    lstCarrier: $scope.lstCarrier,
                    lstCountry: $scope.lstCountry,
                }
            })

        }

        $scope.DownloadExcelTemplate = function() {
            window.location = $rootScope.RoutePath + "PetDevice/DownloadTemplate";
        }

        function GetPetDevice() {
            var resetPaging = true;
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Trackerstable').dataTable()._fnAjaxUpdate();
        }

        //Dynamic Pagging

        $scope.FilterStatus = 1;
        $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedBy'),
            ]
            // ShowTrackNumberModal
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "PetDevice/GetAllPetDevice",
                data: function(d) {
                    d.UserRoles = $rootScope.UserRoles;
                    d.CountryList = $rootScope.CountryList;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        for (var i = 0; i < json.data.length; i++) {
                            if (json.data[i].Type === 'M2-U') {
                                json.data[i].Type = 'C2';
                            }
                        }
                        $scope.lstdata = json.data;
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })
            .withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(10) // Page size
            .withOption('aaSorting', [0, 'asc'])
            .withOption('responsive', true)
            .withOption('autoWidth', false)
            .withOption('createdRow', createdRow);

        $scope.dtInstance = {};

        function dateFormat(date) {
            return $rootScope.convertdateformat(date);
        }

        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        //Dynamic Pagging End

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),

        ];

        $scope.dtColumnDefsModal = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        $scope.resetForm = function() {
            $scope.FormManageTrackers.$setUntouched();
            $scope.FormManageTrackers.$setPristine();
        }

        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.model = {
                    id: '',
                    DeviceId: '',
                    IMEI: '',
                    CreatedDate: new Date(),
                    Latitude: '',
                    Longitude: '',
                    speed: '',
                    Direction: '',
                    Type: '',
                    IsOldDevice: 0,
                    Version: '',
                    CreatedBy: '',
                    CarrierId: '',
                    CountryId: '',
                };
                $scope.resetForm();
            }
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.init();
        }

        $scope.init();
    }

})();