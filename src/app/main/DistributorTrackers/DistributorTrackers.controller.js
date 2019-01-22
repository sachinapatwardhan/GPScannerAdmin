(function() {
    'use strict';

    angular
        .module('app.DistributorTrackers')
        .controller('DistributorGpsDeviceController', DistributorGpsDeviceController);

    /** @ngInject */
    function DistributorGpsDeviceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        vm.searchTermCountry = '';
        vm.searchTermTelCoId = '';
        vm.GetPetDevice = GetPetDevice;
        vm.Reset = Reset;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.CountryList = $cookieStore.get('CountryList');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.idApp = localStorage.getItem('appId');
        $scope.init = function() {
                $scope.model = {
                    id: 0,
                    DeviceId: '',
                    IMEI: '',
                    // CreatedDate: '',
                    Company: 'Maark',
                    Type: '',
                    Version: '',
                    CreatedBy: '',
                    CountryId: null,
                    TelCoId: null,
                    SimNum: '',
                    idSalesAgent: 0,
                    // IsActive: false,
                    ExpiryDate: null,
                    idSim: null,
                    AppName: $rootScope.AppName,
                    idApp: $rootScope.idApp,
                };

                if ($rootScope.AppName == 'Tracking') {
                    $scope.model.Type = 'MT05';
                }

                // $scope.GetAllCountry();
                // $scope.GetAlltelco();
                // $scope.GetAllUserBySalesRole();
                // if ($rootScope.UserRoles == 'Super Admin') {
                //     $scope.GetAllInfoList();
                // } else if ($rootScope.UserRoles == "Sales Agent") {
                //     $scope.flgSalesAgent = true;
                //     $scope.model.idSalesAgent = $rootScope.UserId;
                // }

                $scope.Search = '';
                $scope.flag = false;
                $scope.flagEdit = false;
                $scope.flgSalesAgent = false;
                $scope.tab = {
                    selectedIndex: 0
                };
                // $scope.GetAllSerialnumber();
                $rootScope.UserRoles = $cookieStore.get('UserRoles');
            }
            // $scope.GetAllSerialnumber = function () {
            //     if ($rootScope.AppName != "Tracking") {
            //         $http.get($rootScope.RoutePath + "sim/GetAllSIMInfo").then(function (data) {
            //             $scope.lstSIMInfo = data.data;
            //         })
            //     } else {
            //         var params = {
            //             idApp: $rootScope.idApp
            //         }
            //         $http.get($rootScope.RoutePath + "sim/GetAllSIMInfoForTrackingApp", { params: params }).then(function (data) {
            //             $scope.lstSIMInfo = data.data;
            //         })
            //     }
            // }

        // $scope.GetAllInfoList = function () {
        //     $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
        //         $scope.lstAppInfo = data.data;
        //     })
        // }
        // $scope.GetAllCountry = function () {
        //     $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (data) {
        //         $scope.lstCountry = data.data;
        //     });
        // }

        // $scope.GetAlltelco = function () {
        //     $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function (data) {
        //         $scope.lstCompany = data.data;
        //     });
        // }

        // $scope.GetAllUserBySalesRole = function () {
        //     $http.get($rootScope.RoutePath + "user/GetAllUserBySalesRole").then(function (data) {
        //         $scope.lstSaleAgent = data.data;
        //     });
        // }

        $scope.GetDeviceId = function(IMEI) {
            if ($scope.model.IMEI != '') {
                $scope.model.DeviceId = parseInt($scope.model.IMEI.toString().slice(1));
            }
        }

        $scope.gotoTRACKERList = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                // CreatedDate: '',
                Type: '',
                Company: 'Maark',
                Version: '',
                CreatedBy: '',
                CountryId: null,
                TelCoId: null,
                SimNum: '',
                idSalesAgent: 0,
                // IsActive: false,
                ExpiryDate: null,
                idSim: null,
                AppName: $rootScope.AppName,
                idApp: $rootScope.idApp,
            };

            if ($rootScope.AppName == 'Tracking') {
                $scope.model.Type = 'MT05';
            }
            $scope.Search = '';
            $scope.flagEdit = false;
            $scope.flag = false;
            $scope.flgSalesAgent = false;
            if ($rootScope.UserRoles == "Sales Agent") {
                $scope.flgSalesAgent = true;
                $scope.model.idSalesAgent = $rootScope.UserId;
            }
        }

        // $scope.DownloadExcelTemplate = function () {
        //     window.location = $rootScope.RoutePath + "PetDevice/DownloadTemplate";
        // }

        // $scope.ShowImportGpsDeviceModal = function (ev) {
        //     $mdDialog.show({
        //         controller: 'ImportGpsDeviceController',
        //         controllerAs: 'vm',
        //         templateUrl: 'app/main/Trackers/dialogs/ImportGpsDevice/ImportGpsDevice.html',
        //         parent: angular.element(document.body),
        //         targetEvent: ev,
        //         clickOutsideToClose: true,
        //         locals: {
        //             Tasks: [],
        //             event: ev,
        //             Obj: vm,
        //             lstCountry: $scope.lstCountry,
        //         }
        //     })
        // }

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

            if ($rootScope.UserRoles == 'Super Admin') {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#TRACKERDetail').dataTable()._fnAjaxUpdate();
            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#TRACKERDetail1').dataTable()._fnAjaxUpdate();
            }
        }

        $scope.clearSearchTerm = function() {
            vm.searchTermCountry = '';
            vm.searchTermTelCoId = '';
            // $scope.searchTermCity = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        //Dynamic Pagging

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = '';


            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('IMEI'),
                DTColumnBuilder.newColumn('Version'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat)
            ]



            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "distributor/GetAllGPSDeviceForDistributor",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    d.UserId = $rootScope.UserId;
                    d.UserRoles = $rootScope.UserRoles;
                    d.CountryList = $rootScope.CountryList;
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.AppName = $rootScope.AppName;
                    }
                    d.UserRoles = $rootScope.UserRoles;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
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
                .withOption('aaSorting', [0, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        vm.dtInstance = {};
        vm.dtInstance1 = {};

        function dateFormat(date) {
            if (date != null) {
                // return $rootScope.convertdateformat(date, 2);
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
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

        $scope.Export = function() {
            var UserId = '';
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            // if ($rootScope.UserRoles == 'Sales Agent') {
            //     UserId = $rootScope.UserId;
            // }
            // if ($rootScope.UserRoles == 'Super Admin') {
            //     setTimeout(function() {
            //         $mdDialog.show({
            //             controller: 'AppTypeCtrl',
            //             controllerAs: 'vm',
            //             templateUrl: 'app/main/Trackers/dialogs/AppType/AppType.html',
            //             parent: angular.element($document.body),
            //             clickOutsideToClose: true,
            //             locals: {
            //                 search: $scope.Search,
            //             }
            //         });
            //     }, 100);
            //     // window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            // } else {
            //     window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?AppName=" + $rootScope.AppName + "&UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            // }
            UserId = $rootScope.UserId;
            window.location.href = $rootScope.RoutePath + "distributor/ExportTrackerForDistributor?AppName=" + $rootScope.AppName + "&UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
        }

        $scope.resetForm = function() {
            $scope.formTrackingdetails.$setUntouched();
            $scope.formTrackingdetails.$setPristine();
        }

        $scope.ResetData = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                Type: '',
                Company: 'Maark',
                Version: '',
                CountryId: null,
                TelCoId: null,
                SimNum: '',
                idSalesAgent: 0,
                // IsActive: false,
                ExpiryDate: null,
                idSim: null,
                AppName: $rootScope.AppName,
                idApp: $rootScope.idApp,
            };

            if ($rootScope.AppName == 'Tracking') {
                $scope.model.Type = 'MT05';
            }
            $scope.resetForm();
        }

        $scope.init();
    }

})();