(function() {
    'use strict';

    angular
        .module('app.Trackers')
        .controller('GpsDeviceController', GpsDeviceController);

    /** @ngInject */
    function GpsDeviceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

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

            $scope.GetAllCountry();
            // $scope.GetAlltelco();
            $scope.GetAllUserBySalesRole();
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.GetAllInfoList();
            } else if ($rootScope.UserRoles == "Sales Agent") {
                $scope.flgSalesAgent = true;
                $scope.model.idSalesAgent = $rootScope.UserId;
            }

            $scope.Search = '';
            $scope.flag = false;
            $scope.flagEdit = false;
            $scope.flgSalesAgent = false;
            $scope.tab = {
                selectedIndex: 0
            };
            $scope.GetAllSerialnumber();
            $rootScope.UserRoles = $cookieStore.get('UserRoles');
        }
        $scope.GetAllSerialnumber = function() {
            $http.get($rootScope.RoutePath + "sim/GetAllSIMInfo").then(function(data) {
                $scope.lstSIMInfo = data.data;
            })
        }

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }

        $scope.GetAllUserBySalesRole = function() {
            $http.get($rootScope.RoutePath + "user/GetAllUserBySalesRole").then(function(data) {
                $scope.lstSaleAgent = data.data;
            });
        }

        $scope.GetDeviceId = function(IMEI) {
            $scope.model.DeviceId = parseInt($scope.model.IMEI.toString().slice(1));
        }

        $scope.gotoTRACKERList = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                // CreatedDate: '',
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
            $scope.Search = '';
            $scope.flagEdit = false;
            $scope.flag = false;
            $scope.flgSalesAgent = false;
            if ($rootScope.UserRoles == "Sales Agent") {
                $scope.flgSalesAgent = true;
                $scope.model.idSalesAgent = $rootScope.UserId;
            }
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
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                    DTColumnBuilder.newColumn('DeviceId'),
                    DTColumnBuilder.newColumn('Type'),
                    DTColumnBuilder.newColumn('IMEI'),
                    DTColumnBuilder.newColumn('Version'),
                    DTColumnBuilder.newColumn('SerialNum'),
                    DTColumnBuilder.newColumn('PhoneNum'),
                    DTColumnBuilder.newColumn('Name').renderWith(TelCompanyHtml),
                    // DTColumnBuilder.newColumn('username').renderWith(SalesAgentHtml),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('CreatedBy'),
                    DTColumnBuilder.newColumn(null).renderWith(IsActiveHtml).notSortable(),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
                ]
            } else {
                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                    DTColumnBuilder.newColumn('DeviceId'),
                    DTColumnBuilder.newColumn('Type'),
                    DTColumnBuilder.newColumn('IMEI'),
                    DTColumnBuilder.newColumn('Version'),
                    DTColumnBuilder.newColumn('SerialNum'),
                    DTColumnBuilder.newColumn('PhoneNum'),
                    DTColumnBuilder.newColumn('Name').renderWith(TelCompanyHtml),
                    // DTColumnBuilder.newColumn('username').renderWith(SalesAgentHtml),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('CreatedBy'),
                    DTColumnBuilder.newColumn(null).renderWith(IsActiveHtml).notSortable(),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
                ]
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "PetDevice/GetAllGPSDevice",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    if ($rootScope.UserRoles == 'Sales Agent') {
                        d.UserId = $rootScope.UserId;
                    }
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
                .withOption('aaSorting', [10, 'desc'])
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

        function IsActiveHtml(data, type, full, meta) {
            var result = '';
            var dateFlag = false;
            data.ExpiryDate = moment(data.ExpiryDate).format('DD-MM-YYYY hh:mm:ss a')
            if (data.ExpiryDate == 'Invalid date') {
                dateFlag = true;
            }
            if (data.IsActive == 1) {
                // result = '<span style="font-size: 20px;color: green" ng-click="UpdateStatus(' + data.id + ',false,' + dateFlag + ')"> &#x2714;</span>';
                result = '<md-button  style="font-size: 20px;color: green"  ng-click="UpdateStatus(' + data.id + ',false,' + dateFlag + ')"> &#x2714;<md-tooltip md-visible="" md-direction="">DeActive</md-tooltip></md-button>';
            }
            if (data.IsActive == 0) {
                // result = '<span style="font-size: 20px;color: red" ng-click="UpdateStatus(' + data.id + ',true,' + dateFlag + ')">&#x2716;</span>';
                result = '<md-button style="font-size: 20px;color: red"  ng-click="UpdateStatus(' + data.id + ',true,' + dateFlag + ')">&#x2716;<md-tooltip md-visible="" md-direction="">Active</md-tooltip></md-button>';
            }
            return result;
        }

        function TelCompanyHtml(data, type, full, meta) {
            // if (full.tbltelco != null) {
            //     return full.tbltelco.Name;
            // }
            if (full.Name != null) {
                return full.Name;
            }
            return '';
        }

        function SalesAgentHtml(data, type, full, meta) {
            // if (full.tbluserinformation != null) {
            //     return full.tbluserinformation.username;
            // }
            if (full.username != null) {
                return full.username;
            }
            return '';
        }

        function actionsHtml(data, type, full, meta) {
            var device = data.deviceid;
            var event = '$event';
            var btns = '<div layout="row">';
            btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchDeviceById(' + data.id + ')">' +
                '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                '</md-button>';

            btns += '</div>';
            return btns;
        };
        $scope.formsubmit = false;
        $scope.CreateGpsDevice = function(o, form) {
            o.AppName = _.findWhere($scope.lstAppInfo, { id: parseInt(o.idApp) }).AppName;
            if (form.$invalid) {
                $scope.formsubmit = true;
            } else {
                // if (o.IsActive == true) {
                //     var d = new Date();
                //     var year = d.getFullYear();
                //     var month = d.getMonth();
                //     var day = d.getDate();
                //     var c = new Date(year + 1, month, day)
                //     o.IsActive = 1;
                //     o.ExpiryDate = c;
                // } else {
                //     o.ExpiryDate = null;
                // }
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
                        // $scope.init();
                        $scope.flag = false;
                        $scope.GetSerch($scope.Search)
                        GetPetDevice(true);
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
        }

        $scope.FetchDeviceById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstdata, {
                id: id
            });

            $scope.flagEdit = true;
            $scope.model.id = o.id;
            $scope.model.DeviceId = o.DeviceId;
            $scope.model.Version = o.Version;
            $scope.model.IMEI = o.IMEI
            $scope.model.Type = o.Type;
            $scope.model.CountryId = o.CountryId;
            // $scope.model.TelCoId = o.TelCoId;
            $scope.model.SimNum = parseInt(o.SimNum);
            $scope.model.idSim = o.idSim;
            $scope.model.AppName = o.AppName;
            if ($scope.model.AppName != null) {
                if ($rootScope.UserRoles == 'Super Admin') {
                    $scope.model.idApp = _.findWhere($scope.lstAppInfo, { AppName: o.AppName }).id;
                } else {
                    $scope.model.idApp = $rootScope.idApp;

                }
            }

            if (o.idSalesAgent != null) {
                $scope.model.idSalesAgent = o.idSalesAgent;
            }
            // $scope.model.CreatedDate = o.CreatedDate;
            $scope.model.CreatedBy = o.CreatedBy;
            // if (o.IsActive == 1) {
            //     $scope.model.IsActive = true;
            // } else {
            //     $scope.model.IsActive = false;
            // }

            $scope.flag = true;
        }

        $scope.UpdateStatus = function(id, IsActive, dateFlag) {
            var message = '';
            if (IsActive == true) {
                IsActive = 1;
                message = 'Are you sure to Activate this SIM ?';
            } else {
                IsActive = 0;
                message = 'Are you sure to DeActivate this SIM ?';
            }

            var confirm = $mdDialog.confirm()
                .title(message)
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {

                var params = {
                    IsActive: IsActive,
                    id: id,
                    flg: false,
                    dateFlag: dateFlag,
                }
                if (IsActive == 1) {
                    if (dateFlag == false) {
                        var confirm = $mdDialog.confirm()
                            .title('You want to Update Expiry Date?')
                            .ok('YES')
                            .cancel('NO')
                        $mdDialog.show(confirm).then(function() {
                            var params = {
                                IsActive: IsActive,
                                id: id,
                                flg: true,
                            }
                            updateIsActiveStatus(params)
                        }, function() {
                            updateIsActiveStatus(params);
                        });
                    } else {
                        updateIsActiveStatus(params);
                    }
                } else {
                    updateIsActiveStatus(params);
                }

            });


        }

        function updateIsActiveStatus(params) {
            $http.get($rootScope.RoutePath + "PetDevice/UpdateStatus", { params: params }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                // $scope.resetForm();
                // $scope.init();
                GetPetDevice(true);
            });
        }

        $scope.Export = function() {
            var UserId = '';
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            if ($rootScope.UserRoles == 'Sales Agent') {
                UserId = $rootScope.UserId;
            }
            if ($rootScope.UserRoles == 'Super Admin') {
                setTimeout(function() {
                    $mdDialog.show({
                        controller: 'AppTypeCtrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/main/GpsDevice/dialogs/AppType/AppType.html',
                        parent: angular.element($document.body),
                        clickOutsideToClose: true,
                        locals: {
                            search: $scope.Search,
                        }
                    });
                }, 100);
                // window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            } else {
                window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?AppName=" + $rootScope.AppName + "&UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            }
        }
        $scope.ExportSimTrackerReport = function() {
            window.location.href = $rootScope.RoutePath + "PetDevice/ExportSimTrackerReport"
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
            $scope.resetForm();
        }

        $scope.init();
    }

})();