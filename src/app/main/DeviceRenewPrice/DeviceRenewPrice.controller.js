(function () {
    'use strict';

    angular
        .module('app.DeviceRenewPrice')
        .controller('DeviceRenewPriceController', DeviceRenewPriceController);

    /** @ngInject */
    function DeviceRenewPriceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId').toString();
        $rootScope.AppName = localStorage.getItem('appName');
        var vm = this;
        // vm.GetAllSIMDetail = GetAllSIMDetail;
        $scope.init = function () {
            $scope.model = {
                Id: 0,
                IdUser: '',
                Type: '',
                Price: null,
                idApp: $rootScope.appId,
            }
            $scope.modelSearch = {
                Search: '',
            }
            // $scope.Search = '';  
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            // getAllSIMInfo();
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.GetAllInfoList();
            }
            if ($scope.model.idApp != null && $scope.model.idApp != undefined && $scope.model.idApp != '') {
                $scope.GetAllAgent()
            }
        }

        $scope.GetAllAgent = function () {
            $scope.model.IdUser = "";
            var params = {
                idApp: $scope.model.idApp,
            }
            $http.get($rootScope.RoutePath + "assignagentretailer/GetAllAgent", { params: params }).then(function (data) {
                $scope.lstAgent = data.data;
                if ($scope.model.Id != 0) {
                    var o = _.filter($scope.lstdata, { Id: $scope.model.Id });
                    o = o[0];
                    $scope.model.IdUser = o.IdUser;
                }
            });
        }
        $scope.GetAllInfoList = function () {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetAlltelco = function () {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function (data) {
                $scope.lstCompany = data.data;
            });
        }

        // function getAllSIMInfo() {
        //     $http.get($rootScope.RoutePath + "sim/GetAllSIMInfo").then(function(data) {
        //         $scope.lstSIMInfo = data.data;
        //     })
        // }
        // ----------------------------------------------------------------------
        vm.GetAllSIMDetail = function (IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            if ($rootScope.UserRoles == "Super Admin") {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#RenewDetail').dataTable()._fnPageChange(0);
                $('#RenewDetail').dataTable()._fnAjaxUpdate();
            } else {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#RenewDetail').dataTable()._fnPageChange(0);
                $('#RenewDetail').dataTable()._fnAjaxUpdate();
            }
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == "Super Admin") {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('Type'),
                    DTColumnBuilder.newColumn('Price').renderWith(Valuefun),
                    DTColumnBuilder.newColumn('AppName').renderWith(Valuefun),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            } else {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('Type'),
                    DTColumnBuilder.newColumn('Price').renderWith(Valuefun),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "devicerenewprice/GetAllAgentDevicePrice",
                data: function (d) {
                    if ($scope.modelSearch.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.modelSearch.Search;
                    }
                    d.idApp = '';
                    if ($rootScope.UserRoles != "Super Admin") {
                        d.idApp = $rootScope.appId;
                    }
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    if (json.success != false) {
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
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [0, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');

        });
        vm.dtInstance = {};
        vm.dtInstance1 = {};

        $scope.reloadData = function () { }

        function callback(json) { }

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function DrawDateFormatNumberHtml(data, type, full, meta) {
            var date = data.tbldrawdate.DrawDate;
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return '';
            }
        }

        function Valuefun(data) {
            var value = '';
            if (data != null && data != undefined && data != '') {
                value = data;
            }
            return value;
        }

        function dateFormat(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }


        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row" layout-align="center">'

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="editDevicePrice(' + data.Id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteDevicePrice(' + data.Id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>'
            return btns;
        };
        //--------------------------------------------------------------------------


        $scope.SaveDevcieRenewPrice = function (o) {
            $http.post($rootScope.RoutePath + "devicerenewprice/SaveDevcieRenewPrice", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );
                    $scope.flag = false;
                    // $scope.init();
                    $scope.ResetModel();
                    // getAllSIMInfo();
                    vm.GetAllSIMDetail(true);
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
        $scope.editDevicePrice = function (Id) {
            var o = _.filter($scope.lstdata, { Id: Id });
            o = o[0];
            $scope.model.Id = o.Id;

            $scope.model.Type = o.Type;
            $scope.model.idApp = o.idApp;
            $scope.GetAllAgent();


            $scope.model.Price = o.Price;
            $scope.flag = true;
        }
        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
        }
        $scope.DeleteDevicePrice = function (Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Agent device type price ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "devicerenewprice/DeleteDevicePrice", {
                    params: params
                }).success(function (data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        // getAllSIMInfo();
                        vm.GetAllSIMDetail(true);

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

        $scope.resetForm = function () {
            $scope.formRenewPrice.$setUntouched();
            $scope.formRenewPrice.$setPristine();
        }

        $scope.Reset = function () {
            $scope.model = {
                Id: 0,
                IdUser: '',
                Type: '',
                Price: null,
                idApp: $rootScope.appId,
            }

            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.ResetModel = function () {
            $scope.model = {
                Id: 0,
                IdUser: '',
                Type: '',
                Price: null,
                idApp: $rootScope.appId,
            }
            $scope.modelSearch = {
                Search: '',
            }
            $scope.flag = false;
            $scope.resetForm();
        }


        $scope.DownloadExcelTemplate = function () {
            window.location = $rootScope.RoutePath + "sim/DownloadTemplate";
        }

        $scope.ShowImportSimModal = function (ev) {
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
                    // UserRoles: $rootScope.UserRoles,
                }
            })
        }
        $scope.ExportExcel = function () {
            var idApp = '';
            if ($rootScope.UserRoles != "Super Admin") {
                idApp = $rootScope.appId;
            }
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            window.location = $rootScope.RoutePath + "sim/Export?CurrentOffset=" + CurrentOffset + "&idApp=" + idApp;
        }

        $scope.GetSerch = function (Search) {
            vm.GetAllSIMDetail(true)
            // $scope.dtInstance.DataTable.search(Search);
            // $scope.dtInstance.DataTable.search(Search).draw();
        };

        $scope.init();
    }

})();