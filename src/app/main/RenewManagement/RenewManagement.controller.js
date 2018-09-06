(function () {
    'use strict';

    angular
        .module('app.RenewManagement')
        .controller('RenewManagementController', RenewManagementController);

    /** @ngInject */
    function RenewManagementController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.AppName = localStorage.getItem('appName');
        var vm = this;
        vm.ReloadTable = ReloadTable;
        var pendingSearch = angular.noop;

        function ReloadTable() {
            vm.GetAllRenewDetail(true)
        }
        // vm.GetAllRenewDetail = GetAllRenewDetail;
        $scope.init = function () {
            $scope.SelectedRenew = [];
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
                idApp: $rootScope.appId,
                Search: ''
            }
            $scope.ModelRenewMultiple = {
                iduser: '',
                UserName: '',
                Remark: '',
            }
            $scope.ChangeSearchDate();
            $scope.selectedItem = null;
            $scope.flag = false;
            $scope.checked = {};
            $scope.getAllApps();
        }

        $scope.getAllApps = function () {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppInfo").then(function (res) {
                $scope.appNames = res.data;
            });
        };

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {

            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    // DTColumnBuilder.newColumn('LicenceNo'),
                    DTColumnBuilder.newColumn('DeviceId'),
                    // DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                    DTColumnBuilder.newColumn('LicenceType'),
                    DTColumnBuilder.newColumn('LicenceRenewalType'),
                    DTColumnBuilder.newColumn('AppName'),
                    // DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    // DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            } else {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    // DTColumnBuilder.newColumn('LicenceNo'),
                    DTColumnBuilder.newColumn('DeviceId'),
                    // DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                    DTColumnBuilder.newColumn('LicenceType'),
                    DTColumnBuilder.newColumn('LicenceRenewalType'),
                    // DTColumnBuilder.newColumn('AppName'),
                    // DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    // DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "billing/GetAllRenewData",
                data: function (d) {
                    if ($scope.ModelSearch.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.ModelSearch.Search;
                    }
                    d.StartDate = $scope.ModelSearch.StartDate;

                    if (d.StartDate != null && d.StartDate != undefined && d.StartDate != '') {
                        d.StartDate.setHours(0);
                        d.StartDate.setMinutes(0);
                        d.StartDate.setSeconds(0);
                    }
                    d.EndDate = $scope.ModelSearch.EndDate;
                    if (d.EndDate != null && d.EndDate != undefined && d.EndDate != '') {
                        d.EndDate.setHours(0);
                        d.EndDate.setMinutes(0);
                        d.EndDate.setSeconds(0);
                    }
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.idApp = $rootScope.appId;
                    } else {
                        if ($scope.ModelSearch.idApp != null && $scope.ModelSearch.idApp != undefined && $scope.ModelSearch.idApp != '' && $scope.ModelSearch.idApp != '-1') {
                            d.idApp = $scope.ModelSearch.idApp;
                        }
                    }
                    // console.log(d)
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    if (json.success != false) {
                        $scope.lstRenew = json.data;
                        for (var i = 0; i < $scope.lstRenew.length; i++) {
                            var IsChecked = false;
                            if ($scope.checked[$scope.lstRenew[i].DeviceId] != undefined) {
                                IsChecked = $scope.checked[$scope.lstRenew[i].DeviceId];
                            }
                            $scope.lstRenew[i].Checked = IsChecked;
                        }
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
                .withOption('aaSorting', [5, 'asc'])
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

        function daysHtml(data, type, full, meta) {
            var days = '';
            if (full.ExpiryDate != null && full.ExpiryDate != '') {
                var timeDiff = (new Date(full.ExpiryDate)).getTime() - (new Date()).getTime();
                var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                days = diffDays + ' days';

            }
            return days;
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

        function dateFormat1(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return '';
            }
        }

        function actionsHtml(data, type, full, meta) {
            $scope.checked[full.DeviceId] = full.Checked ? full.Checked : false;
            var btns = '<div layout="row" layout-align="center">'
            btns += '<md-checkbox style="text-align : center;margin-bottom:0;" ng-model="checked[\'' + full.DeviceId + '\']" ng-change="SelectVehicle( \'' + full.DeviceId + '\')" aria-label="Checkbox 1" class="md-primary"></md-checkbox>';
            if (full.iduser != null && full.iduser != '') {
                // var btn = "<div layout='row'>";
                // btn += '<md-checkbox ng-model="checked[' + data + ']" ng-change="Select( ' + full.IsActive + ',' + full.id + ')" aria-label="Checkbox 1" class="md-primary"></md-checkbox>';
                // btn += '</div>';
                btns += '<md-button class="edit-button md-icon-button"  ng-click="renewMultiple(' + full.iduser + ',\'' + full.email + '\',\'' + full.DeviceId + '\')" aria-label="">' +
                    '<md-icon md-font-icon="icon-forward"  class="s18 blue-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                    '</md-button>';
            }

            btns += '</div>'
            return btns;
        };

        vm.GetAllRenewDetail = function (IsUpdate) {
            if (($scope.ModelSearch.StartDate == null || $scope.ModelSearch.EndDate == null)) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Please select Date.")
                        .position('top right')
                        .hideDelay(3000)
                );
            } else {

                var resetPaging = false;
                if (IsUpdate == true) {
                    resetPaging = true;
                };
                if ($rootScope.UserRoles == 'Super Admin') {
                    vm.dtInstance.reloadData(callback, resetPaging);
                    $('#RenewDetail').dataTable()._fnPageChange(0);
                    $('#RenewDetail').dataTable()._fnAjaxUpdate();
                } else {
                    vm.dtInstance1.reloadData(callback, resetPaging);
                    $('#RenewDetail1').dataTable()._fnPageChange(0);
                    $('#RenewDetail1').dataTable()._fnAjaxUpdate();
                }
            }
        }

        $scope.SelectVehicle = function (DeviceId) {
            if ($scope.checked[DeviceId] == true) {
                var objdata = _.findWhere($scope.lstRenew, { DeviceId: DeviceId });
                if (objdata) {
                    var obj = new Object();
                    obj.DeviceId = objdata.DeviceId;
                    obj.iduser = objdata.iduser;
                    obj.email = objdata.email;
                    obj.AppName = objdata.AppName;
                    obj.idApp = objdata.idApp;
                    obj.ExpiryDate = dateFormat1(objdata.ExpiryDate);
                    obj.ExpiryDays = daysHtml(objdata.ExpiryDate, '', objdata, '');
                    obj.VehicleName = objdata.VehicleName;
                    $scope.SelectedRenew.push(obj);
                }
            } else {
                $scope.SelectedRenew = _.without($scope.SelectedRenew, _.findWhere($scope.SelectedRenew, { DeviceId: DeviceId }));
            }
        }

        $scope.SendEmail = function () {
            if ($scope.SelectedRenew.length > 0) {
                var objRenew = {
                    idApp: $rootScope.appId,
                    lstRenewalList: $scope.SelectedRenew
                }
                $http.post($rootScope.RoutePath + 'billing/SendEmailNotification', objRenew).success(function (data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
                        $scope.SelectedRenew = [];
                        $scope.checked = {};
                        vm.GetAllRenewDetail(false);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );

                    }
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Please select at least one Device.")
                        .position('top right')
                        .hideDelay(3000)
                );
            }
        }

        $scope.GetSerch = function (Search) {
            vm.GetAllRenewDetail(true)
        };

        $rootScope.reloadRenew = function () {
            vm.GetAllRenewDetail(true)
        }

        $scope.ChangeSearchDate = function (days) {
            var StartDate = new Date();
            var EndDate = new Date();
            EndDate.setMonth(EndDate.getMonth() + 1);
            $scope.ModelSearch.StartDate = StartDate;
            $scope.ModelSearch.EndDate = EndDate;
        }

        $scope.renewMultiple = function (idUser, Email, DeviceId) {
            $scope.flag = true;
            $scope.ModelRenewMultiple.iduser = idUser;
            $scope.ModelRenewMultiple.UserName = Email;
            $scope.ModelRenewMultiple.Remark = '';
            $scope.IsRenewFalgOpen = false;
            $scope.GetAllVehicleWithExpire(idUser, DeviceId);
        }

        $scope.GetAllVehicleWithExpire = function (iduser, DeviceId) {
            $http.get($rootScope.RoutePath + 'billing/GetAllVehicleExpirebyUser?idUser=' + iduser).then(function (data) {
                var data = data.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].deviceid == DeviceId) {
                        data[i].Checked = true;
                    } else {
                        data[i].Checked = false;
                    }
                    data[i].RenewPrice = 0;
                    if (data[i].renewaldate != null && data[i].renewaldate != '') {
                        var timeDiff = (new Date(data[i].renewaldate)).getTime() - (new Date()).getTime();
                        var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                        if (diffDays < 0) {
                            diffDays = 0;
                        }
                        data[i].Expiring = diffDays + ' days';
                        data[i].ExpireDays = diffDays;
                        data[i].ExpireDate = moment(data[i].renewaldate).format('DD-MM-YYYY');
                    } else {
                        data[i].Expiring = 'N/A';
                        data[i].ExpireDate = 'N/A';
                        data[i].ExpireDays = 0;
                    }

                    if (data[i].LicenceRenewalType != null && data[i].LicenceRenewalType != '') {
                        var nextRenewalDate = new Date(data[i].renewaldate);
                        if (data[i].LicenceRenewalType == 'Monthly') {
                            data[i].UOM = '1M';
                            nextRenewalDate = nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
                        } else if (data[i].LicenceRenewalType == 'Quarterly') {
                            data[i].UOM = '3M';
                            nextRenewalDate = nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 3);
                        } else {
                            data[i].UOM = '12M';
                            nextRenewalDate = nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 12);
                        }
                        data[i].NextExpireDate = moment(nextRenewalDate).format('DD-MM-YYYY');

                    } else {
                        data[i].UOM = 'N/A';
                    }

                }
                $scope.lstAllExpiryVehicle = data;
                $('#RenewalMultiple .dataTables_empty').attr("colspan", 7);
                $scope.CheckRenewDevice();

            });

        }

        $scope.CheckRenewDevice = function () {
            var renewLengthCOunt = _.filter($scope.lstAllExpiryVehicle, { Checked: true }).length;
            $scope.FinalRenewList = _.filter($scope.lstAllExpiryVehicle, { Checked: true });
            if (renewLengthCOunt > 0) {
                $scope.IsRenewFalgOpen = true;
            } else {
                $scope.IsRenewFalgOpen = false;
            }
        }

        $scope.dtColumnDefs1 = [
            DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('class', 'text-center'),

        ];
        vm.dtInstance = {};

        $scope.dtOptions1 = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(25)
            .withOption('responsive', true)
            //.withOption('autoWidth', true)
            .withOption('searching', true)
            .withOption('paging', true)
            .withOption('info', true)
            .withOption('deferRender', false);

        $scope.RenewMultipleDevice = function (o) {

            var objorder = {
                idUser: o.iduser,
                idApp: $rootScope.appId,
                lstProduct: $scope.FinalRenewList,
                Remark: $scope.ModelRenewMultiple.Remark,
                OrderTotal: 0
            }
            $http.post($rootScope.RoutePath + 'billing/SaveOrderServiceRenew', objorder).success(function (data) {
                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );
                    $scope.IsRenewFalgOpen = false;
                    $scope.ResetModel();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );

                }

            });
        }

        $scope.toggle = function () {
            if (!$scope.flgforIcon) {
                $scope.flgforIcon = true;
            } else {
                $scope.flgforIcon = false;
            }
            $(function () {
                $(".showBtn").toggleClass("active");
                $(".ShowContentBox").slideToggle();
            })
        }

        $(function () {
            $(".showBtn").toggleClass("active");
            $(".ShowContentBox").slideToggle();
        });
        $scope.flgforIcon = true;

        $scope.ResetModel = function () {
            $scope.Reset();
            $scope.flag = false;
        }
        $scope.Reset = function () {
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
                idApp: $rootScope.appId,
                Search: ''
            }
            $scope.ChangeSearchDate();
            ReloadTable();
            $scope.selectedItem = null;
            $scope.query = '';
            $scope.formRenew.$setUntouched();
            $scope.formRenew.$setPristine();
        }

        $scope.SearchReset = function () {
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
                idApp: $rootScope.appId,
                Search: ''
            }
            $scope.ChangeSearchDate();
            vm.GetAllRenewDetail(true);
        }

        $scope.GoToBack = function () {
            vm.GetAllRenewDetail(false);
            $scope.flag = false;
        }
        $scope.init();
    }

})();