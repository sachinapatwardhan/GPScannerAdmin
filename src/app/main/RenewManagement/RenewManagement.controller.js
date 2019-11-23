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
        $rootScope.Amount = $cookieStore.get('RenewAmount');
        var vm = this;
        vm.ReloadTable = ReloadTable;
        var pendingSearch = angular.noop;
        vm.search1country = '';
        vm.search1Distributor = '';
        vm.search1Sa = '';
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
                Search: '',
                idDistributor: 'All',
                idCountry: 'All',
                idSalesAgent: 'All',
            }
            $scope.ModelRenewMultiple = {
                iduser: '',
                UserName: '',
                Remark: '',
                LastloginDate: 'N/A'
            }
            $scope.ChangeSearchDate();
            $scope.selectedItem = null;
            $scope.flag = false;
            $scope.checked = {};
            $scope.getAllApps();
            $scope.GetAllDistributorForSearch();
            $scope.GetAllSAForSearch();
            $scope.flaglink = 0;
        }

        $scope.ResetTabExpiringSoon = function () {
            $scope.ModelSearch.StartDate = new Date();
            var EndDate = new Date();
            EndDate.setMonth(EndDate.getMonth() + 1);
            $scope.ModelSearch.EndDate = EndDate;
            $scope.flaglink = 0;
            vm.GetAllRenewDetail(true)
        }
        $scope.ResetTabActive = function () {
            var StartDate = new Date();
            StartDate.setMonth(StartDate.getMonth() + 1);
            $scope.ModelSearch.StartDate = StartDate;
            $scope.ModelSearch.EndDate = '';
            $scope.flaglink = 1;
            vm.GetAllRenewDetail(true)
        }
        $scope.ResetTabExpired = function () {
            $scope.ModelSearch.StartDate = '';
            $scope.ModelSearch.EndDate = new Date();
            $scope.flaglink = 2;
            vm.GetAllRenewDetail(true)
        }

        $scope.getAllApps = function () {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppInfo").then(function (res) {
                $scope.appNames = res.data;
            });
        };
        $scope.GetAllDistributorForSearch = function () {
            var params = {
                idApp: $scope.ModelSearch.idApp,
            }
            $http.get($rootScope.RoutePath + "assigndistributor/GetAllDistributor", { params: params }).then(function (data) {
                $scope.lstDistributor = data.data;
            });
        }

        $scope.GetAllSAForSearch = function () {
            var params = {
                idApp: $scope.ModelSearch.idApp,
            }
            $http.get($rootScope.RoutePath + "billing/GetAllSalesAgentRole", { params: params }).then(function (data) {
                $scope.lstSA = data.data.data;
                $scope.GetAllCountry();
            });
        }
        $scope.clearSearchTerm = function () {
            vm.search1country = '';
            vm.search1Distributor = '';
            vm.search1Sa = '';
        };
        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
        }
        $scope.GetAllCountry = function () {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (data) {
                $scope.lstCountry = data.data;
            });
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '2%').withOption('class', 'text-center'),
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
                    DTColumnBuilder.newColumn('LastLoginDate').notSortable().renderWith(dateFormat),
                    DTColumnBuilder.newColumn('GpsDate').notSortable().renderWith(gpsdateFormat),
                    // DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    // DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            } else {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '2%').withOption('class', 'text-center'),
                    // DTColumnBuilder.newColumn('LicenceNo'),
                    DTColumnBuilder.newColumn('DeviceId'),
                    // DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                    DTColumnBuilder.newColumn('LicenceType'),
                    DTColumnBuilder.newColumn('LicenceRenewalType'),
                    DTColumnBuilder.newColumn('LastLoginDate').notSortable().renderWith(dateFormat),
                    DTColumnBuilder.newColumn('GpsDate').notSortable().renderWith(gpsdateFormat),
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
                    d.idDistributor = $scope.ModelSearch.idDistributor == "All" ? '' : $scope.ModelSearch.idDistributor;
                    d.idCountry = $scope.ModelSearch.idCountry == "All" ? '' : $scope.ModelSearch.idCountry;
                    d.idSalesAgent = $scope.ModelSearch.idSalesAgent == 'All' ? '' : $scope.ModelSearch.idSalesAgent;
                    $scope.columns = d.columns;
                    $scope.order = d.order;
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
                return 'N/A';
            }
        }

        function gpsdateFormat(date) {
            if (date != null) {
                return moment(moment.utc(date * 1000).toDate()).format("DD-MM-YYYY hh:mm:ss A")
            } else {
                return 'N/A';
            }
        }

        function dateFormat1(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return 'N/A';
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
                var LastLoginDate = 'N/A';
                if (full.LastLoginDate != null && full.LastLoginDate != '') {
                    LastLoginDate = moment(full.LastLoginDate).format('DD-MM-YYYY hh:mm:ss a');
                }
                btns += '<md-button class="edit-button md-icon-button"  ng-click="renewMultiple(' + full.iduser + ',\'' + full.email + '\',\'' + full.DeviceId + '\',\'' + LastLoginDate + '\')" aria-label="">' +
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

        $scope.renewMultiple = function (idUser, Email, DeviceId, LastLoginDate) {
            $scope.flag = true;
            $scope.ModelRenewMultiple.iduser = idUser;
            $scope.ModelRenewMultiple.UserName = Email;
            $scope.ModelRenewMultiple.Remark = '';
            $scope.ModelRenewMultiple.LastloginDate = LastLoginDate;
            $scope.IsRenewFalgOpen = false;
            $scope.GetAllVehicleWithExpire(idUser, DeviceId, LastLoginDate);
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
                    if ($rootScope.Amount != null && $rootScope.Amount != undefined && $rootScope.Amount != '') {
                        data[i].RenewPrice = parseFloat($rootScope.Amount);
                    } else {
                        data[i].RenewPrice = 0;
                    }
                    if (data[i].GpsDate != null) {
                        var newdate = data[i].GpsDate * 1000;
                        data[i].LastGpsDate = moment(moment.utc(newdate).toDate()).format("DD-MM-YYYY hh:mm:ss A");
                    } else {
                        data[i].LastGpsDate = 'N/A';
                    }
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
                        var oldexpdate = data[i].renewaldate;
                        var AddMonth = 0;
                        if (data[i].LicenceRenewalType == 'Monthly') {
                            data[i].UOM = '1M';
                            AddMonth = 1;
                        } else if (data[i].LicenceRenewalType == 'Quarterly') {
                            data[i].UOM = '3M';
                            AddMonth = 3;
                        } else {
                            data[i].UOM = '12M';
                            AddMonth = 12;
                        }
                        nextRenewalDate = nextRenewalDate.setMonth(nextRenewalDate.getMonth() + AddMonth);
                        data[i].NextExpireDate = moment(nextRenewalDate).format('DD-MM-YYYY');

                        var timeDiff = (new Date(oldexpdate)).getTime() - (new Date()).getTime();
                        var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                        var days = diffDays;
                        if (days < 0) {
                            var date = new Date();
                            nextRenewalDate = date.setMonth(date.getMonth() + AddMonth);
                            data[i].NextExpireDate = moment(nextRenewalDate).format('DD-MM-YYYY');
                        }
                    } else {
                        data[i].UOM = 'N/A';
                    }

                }
                $scope.lstAllExpiryVehicle = data;
                $('#RenewalMultiple .dataTables_empty').attr("colspan", 8);
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
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('class', 'text-center'),

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
        $scope.flgforIcon = false;

        $scope.ResetModel = function () {
            $scope.Reset();
            $scope.flag = false;
        }
        $scope.Reset = function () {
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
                idApp: $rootScope.appId,
                Search: '',
                idDistributor: 'All',
                idCountry: 'All',
                idSalesAgent: 'All',
            }
            $scope.ChangeSearchDate();
            ReloadTable();
            $scope.selectedItem = null;
            $scope.query = '';
            $scope.formRenew.$setUntouched();
            $scope.formRenew.$setPristine();
        }

        $scope.SearchReset = function () {
            // $scope.ModelSearch = {
            //     StartDate: '',
            //     EndDate: '',
            //     idApp: '',
            //     Search: ''
            // }
            $scope.ModelSearch.idApp = $rootScope.appId;
            $scope.ModelSearch.Search = '';
            $scope.ModelSearch.idDistributor = 'All';
            $scope.ModelSearch.idSalesAgent = 'All';
            $scope.ModelSearch.idCountry = 'All';
            // $scope.ChangeSearchDate();
            vm.GetAllRenewDetail(true);
        }

        $scope.GoToBack = function () {
            vm.GetAllRenewDetail(false);
            $scope.flag = false;
        }





        $scope.Export = function () {
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            var search = $scope.ModelSearch.Search;
            var StartDate = $scope.ModelSearch.StartDate;
            if (StartDate != null && StartDate != undefined && StartDate != '') {
                StartDate.setHours(0);
                StartDate.setMinutes(0);
                StartDate.setSeconds(0);
            }
            var EndDate = $scope.ModelSearch.EndDate;
            if (EndDate != null && EndDate != undefined && EndDate != '') {
                EndDate.setHours(0);
                EndDate.setMinutes(0);
                EndDate.setSeconds(0);
            }
            if ($rootScope.UserRoles != 'Super Admin') {
                var idApp = $rootScope.appId;
            } else {
                if ($scope.ModelSearch.idApp != null && $scope.ModelSearch.idApp != undefined && $scope.ModelSearch.idApp != '' && $scope.ModelSearch.idApp != '-1') {
                    var idApp = $scope.ModelSearch.idApp;
                }
            }
            var columns = JSON.stringify($scope.columns);
            var order = JSON.stringify($scope.order);
            var IsSuperAdmin = $rootScope.UserRoles == 'Super Admin' ? '1' : '0';
            var idDistributor = $scope.ModelSearch.idDistributor == "All" ? '' : $scope.ModelSearch.idDistributor;
            var idSalesAgent = $scope.ModelSearch.idSalesAgent == "All" ? '' : $scope.ModelSearch.idSalesAgent;
            var idCountry = $scope.ModelSearch.idCountry == "All" ? '' : $scope.ModelSearch.idCountry;
            console.log(idSalesAgent)
            window.location.href = $rootScope.RoutePath + "billing/ExportAllRenewData?idApp=" + idApp + "&CurrentOffset=" + CurrentOffset + "&search=" + search + "&StartDate=" + StartDate + "&EndDate=" + EndDate + "&columns=" + columns + "&order=" + order + "&IsSuperAdmin=" + IsSuperAdmin + "&idDistributor=" + idDistributor + "&idCountry" + idCountry + "&idSalesAgent=" + idSalesAgent;



        }
        $scope.init();
    }

})();