(function() {
    'use strict';

    angular
        .module('app.Trackers')
        .controller('GpsDeviceController', GpsDeviceController);

    /** @ngInject */
    function GpsDeviceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        vm.GetPetDevice = GetPetDevice;
        vm.Reset = Reset;
        $scope.init = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                CreatedDate: '',
                Type: '',
                Version: '',
                CreatedBy: '',
                CountryId: '',
            };
            $scope.GetAllCountry();
            $scope.Search = '';
            $scope.flag = false;
            $scope.tab = {
                selectedIndex: 0
            };
        }

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.gotoTRACKERList = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                CreatedDate: '',
                Type: '',
                Version: '',
                CreatedBy: '',
                CountryId: '',
            };
            $scope.Search = '';
            $scope.flag = false;
        }

        $scope.DownloadExcelTemplate = function() {
            window.location = $rootScope.RoutePath + "PetDevice/DownloadTemplate";
        }

        $scope.ShowImportGpsDeviceModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportGpsDeviceController',
                controllerAs: 'vm',
                templateUrl: 'app/main/GpsDevice/dialogs/ImportGpsDevice/ImportGpsDevice.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Obj: vm,
                    lstCountry: $scope.lstCountry,
                }
            })

        }

        function Reset() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.resetForm();
            $scope.init();
            $scope.flag = true;
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            GetPetDevice(true);
        }

        //Reload Datatable
        function GetPetDevice(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#TRACKERDetail').dataTable()._fnAjaxUpdate();

        }

        //Dynamic Pagging

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = '';

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('Version'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedBy'),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "PetDevice/GetAllGPSDevice",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
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
                        $scope.TotalTrackers = json.recordsTotal
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })

            .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [1, 'asc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};

        function dateFormat(date) {
            return $rootScope.convertdateformat(date);
        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }


        $scope.CreateGpsDevice = function(o) {
            $http.post($rootScope.RoutePath + "PetDevice/SaveGPSDevice", o).then(function(data) {
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

        $scope.resetForm = function() {
            // if ($rootScope.FlgAddedAccess == true) {

            $scope.formTrackingdetails.$setUntouched();
            $scope.formTrackingdetails.$setPristine();

            // }
        }

        $scope.ResetModel = function() {
            $scope.tab = {
                selectedIndex: 0
            };
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                CreatedDate: '',
                Type: '',
                Version: '',
                CreatedBy: '',
                CountryId: '',
            };
            $scope.flag = false;
            $scope.resetForm();
        }

        $scope.init();
    }

})();