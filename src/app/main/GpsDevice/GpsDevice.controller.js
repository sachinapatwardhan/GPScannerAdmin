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
        $scope.init = function() {
            $scope.model = {
                id: 0,
                DeviceId: '',
                IMEI: '',
                CreatedDate: '',
                Type: '',
                Version: '',
                CreatedBy: '',
                CountryId: null,
                TelCoId: null,
                SimNum: '',
                idSalesAgent: 0,
                IsActive: false,
                ExpiryDate: null,
            };
            $scope.GetAllCountry();
            $scope.GetAlltelco();
            $scope.GetAllUserBySalesRole();
            $scope.Search = '';
            $scope.flag = false;
            $scope.flagEdit = false;
            $scope.flgSalesAgent = false;
            $scope.tab = {
                selectedIndex: 0
            };
            if ($rootScope.UserRoles == "Sales Agent") {
                $scope.flgSalesAgent = true;
                $scope.model.idSalesAgent = $rootScope.UserId;
            }
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
                CreatedDate: '',
                Type: '',
                Version: '',
                CreatedBy: '',
                CountryId: null,
                TelCoId: null,
                SimNum: '',
                idSalesAgent: 0,
                IsActive: false,
                ExpiryDate: null,
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
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#TRACKERDetail').dataTable()._fnAjaxUpdate();

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

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('IMEI'),
                DTColumnBuilder.newColumn('Version'),
                DTColumnBuilder.newColumn('SimNum'),
                DTColumnBuilder.newColumn('tbltelco.Name').renderWith(TelCompanyHtml),
                DTColumnBuilder.newColumn('tbluserinformation.username').renderWith(SalesAgentHtml),
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedBy'),
                DTColumnBuilder.newColumn(null).renderWith(IsActiveHtml).notSortable(),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
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
                    d.UserId = $rootScope.UserId;
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
                        // console.log($scope.lstdata);
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
            if (date != null) {
                return $rootScope.convertdateformat(date);
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

            if (data.IsActive == 1) {
                result = '<span style="font-size: 20px;color: green" ng-click="UpdateStatus(' + data.id + ',false)"> &#x2714;</span>';
            }
            if (data.IsActive == 0) {
                result = '<span style="font-size: 20px;color: red" ng-click="UpdateStatus(' + data.id + ',true)">&#x2716;</span>';
            }
            return result;
        }

        function TelCompanyHtml(data, type, full, meta) {
            if (full.tbltelco != null) {
                return full.tbltelco.Name;
            }
            return '';
        }

        function SalesAgentHtml(data, type, full, meta) {
            if (full.tbluserinformation != null) {
                return full.tbluserinformation.username;
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
            if (form.$invalid) {
                $scope.formsubmit = true;
            } else {
                if (o.IsActive == true) {
                    var d = new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth();
                    var day = d.getDate();
                    var c = new Date(year + 1, month, day)
                    o.IsActive = 1;
                    o.ExpiryDate = c;
                } else {
                    o.ExpiryDate = null;
                }
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
            $scope.model.DeviceId = parseInt(o.DeviceId);
            $scope.model.Version = o.Version;
            $scope.model.IMEI = parseInt(o.IMEI);
            $scope.model.Type = o.Type;
            $scope.model.CountryId = o.CountryId;
            $scope.model.TelCoId = o.TelCoId;
            $scope.model.SimNum = parseInt(o.SimNum);
            if (o.idSalesAgent != null) {
                $scope.model.idSalesAgent = o.idSalesAgent;
            }
            $scope.model.CreatedDate = o.CreatedDate;
            $scope.model.CreatedBy = o.CreatedBy;
            if (o.IsActive == 1) {
                $scope.model.IsActive = true;
            } else {
                $scope.model.IsActive = false;
            }

            $scope.flag = true;
        }

        $scope.UpdateStatus = function(id, IsActive) {
            if (IsActive == true) {
                IsActive = 1;
            } else {
                IsActive = 0;
            }
            var params = {
                IsActive: IsActive,
                id: id,
            }
            $http.get($rootScope.RoutePath + "PetDevice/UpdateStatus", { params: params }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                $scope.resetForm();
                $scope.init();
                GetPetDevice(true);
            });

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
                IsActive: false,
                ExpiryDate: null,
            };
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
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
                IsActive: false,
                ExpiryDate: null,
            };
            $scope.resetForm();
            $scope.flgSalesAgent = false;
            if ($rootScope.UserRoles == "Sales Agent") {
                $scope.flgSalesAgent = true;
                $scope.model.idSalesAgent = $rootScope.UserId;
            }
            $scope.flagEdit = false;
            $scope.flag = false;
        }

        $scope.init();
    }

})();