(function() {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('OrderServiceController', OrderServiceController);

    /** @ngInject */
    function OrderServiceController($http, $scope, $q, $cookieStore, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        vm.GetAllOrderServiceFromModal = GetAllOrderServiceFromModal;
        var pendingSearch = angular.noop;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.idApp = localStorage.getItem('appId');
        $scope.lstAllExpiryVehicle = [];
        $scope.GetAllProductType = function() {
            $scope.lstProductTypes = [];
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstProductTypes = data.data;
            });
        }
        $scope.GetAllProductType();
        vm.searchcountry = '';
        vm.searchCustomer = '';
        vm.searchDeviceId = '';
        $scope.init = function() {
            $scope.modelNew = {
                idUser: '',
            }
            $scope.model = {
                DeviceId: '',
                UserName: '',
                idApp: '',
                Name: '',
                idType: '',

            }
            $scope.OrderTotal = 0;
            $scope.IsRenewFalgOpen = false;
            $scope.FinalRenewList = [];
            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: 0,
                Type: 0,
                Country: 'All',
                Search: '',
                DeviceId: 'All',
                IdUser: 'All'
            }
            $scope.selectedItem = null;

            // $scope.searchcountry = '';
            // $scope.searchCustomer = '';
            // $scope.searchDeviceId = '';
            vm.searchcountry = '';
            vm.searchCustomer = '';
            vm.searchDeviceId = '';
            $scope.modelUpdateDate = {
                id: 0,
                CreatedOnUtc: null
            }
            $scope.flag = false;
            $scope.ShowDtl = false;
            $scope.GetOrderServiceStatus();
            $scope.GetAllInfoList();
            $scope.GetAllCountry();
            $scope.getAllVehicleType();
            $scope.getAllCustomer();
            $scope.getAllDevice();
        }

        $scope.getAllCustomer = function() {
            var idApp = '';
            if ($rootScope.UserRoles != 'Super Admin') {
                idApp = $rootScope.idApp
            } else {
                if ($scope.modelSearch.Type != null && $scope.modelSearch.Type != undefined && $scope.modelSearch.Type != "" && $scope.modelSearch.Type != 0) {
                    idApp = $scope.modelSearch.Type
                }
            }
            $http.get($rootScope.RoutePath + 'orderservice/GetAllCustomer?idApp=' + idApp).then(function(data) {
                $scope.lstCustomer = data.data;
            });
        }

        $scope.getAllDevice = function() {
            var idApp = '';
            if ($rootScope.UserRoles != 'Super Admin') {
                idApp = $rootScope.idApp
            } {
                if ($scope.modelSearch.Type != null && $scope.modelSearch.Type != undefined && $scope.modelSearch.Type != "" && $scope.modelSearch.Type != 0) {
                    idApp = $scope.modelSearch.Type
                }
            }
            $http.get($rootScope.RoutePath + 'orderservice/GetAllDeviceId?idApp=' + idApp).then(function(data) {
                $scope.lstDeviceId = data.data;
            });
        }

        $scope.GetAllExpirePrice = function(iduser) {
            $http.get($rootScope.RoutePath + 'billing/GetPriceByApp?idUser=' + iduser + '&idApp=' + $rootScope.idApp).then(function(data) {
                $scope.lstExpiryPrice = data.data;
                $scope.GetAllVehicleWithExpire(iduser);
            });
        }

        $scope.GetAllVehicleWithExpire = function(iduser) {
            $http.get($rootScope.RoutePath + 'billing/GetAllVehicleExpirebyUser?idUser=' + iduser).then(function(data) {
                var data = data.data;
                for (var i = 0; i < data.length; i++) {
                    data[i].Checked = false;
                    var objprice = _.findWhere($scope.lstExpiryPrice, { LicenceRenewalType: data[i].LicenceRenewalType, LicenceType: data[i].LicenceType });
                    if (objprice != undefined) {
                        data[i].RenewPrice = objprice.Price;
                        data[i].CountryName = objprice.CountryName;
                        data[i].ProductId = objprice.Id;
                    } else {
                        data[i].RenewPrice = 'N/A';
                        data[i].CountryName = 'N/A';
                        data[i].ProductId = null;
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

                $('#order .dataTables_empty').attr("colspan", 7);

            });

        }

        $scope.CheckRenewDevice = function() {
            var renewLengthCOunt = _.filter($scope.lstAllExpiryVehicle, { Checked: true }).length;
            $scope.FinalRenewList = _.filter($scope.lstAllExpiryVehicle, { Checked: true });
            $scope.OrderTotal = 0;
            _.filter($scope.lstAllExpiryVehicle, function(item) {
                if (item.RenewPrice != 'N/A' && item.Checked == true) {
                    $scope.OrderTotal = $scope.OrderTotal + item.RenewPrice;
                }
            })
            if (renewLengthCOunt > 0) {
                $scope.IsRenewFalgOpen = true;
            } else {
                $scope.IsRenewFalgOpen = false;
            }
        }

        $scope.CheckOut = function() {

            var objorder = {
                idUser: $scope.modelNew.idUser,
                idApp: $rootScope.appId,
                lstProduct: $scope.FinalRenewList,
                OrderTotal: $scope.OrderTotal
            }
            $http.post($rootScope.RoutePath + 'billing/SaveOrderServiceNew', objorder).success(function(data) {
                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.OrderTotal = 0;
                    $scope.IsRenewFalgOpen = false;
                    $scope.BillingSTep = 1;
                    $scope.GetAllVehicleWithExpire($scope.modelNew.idUser);

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
            .withDisplayLength(10)
            .withOption('responsive', true)
            //.withOption('autoWidth', true)
            .withOption('searching', true)
            .withOption('paging', true)
            .withOption('info', true)
            .withOption('deferRender', false)
            // .withOption('language', {
            //     'zeroRecords': "No Record Found",
            //     'emptyTable': "No Record Found"
            // })


        $scope.getAllVehicleType = function() {
            $http.get($rootScope.RoutePath + "vehicletype/GetAllActivevehicletype").then(function(data) {
                $scope.lstVehicleType = data.data
            })
        }

        $scope.clearSearchTerm = function() {
            // $scope.searchcountry = '';
            // $scope.searchCustomer = '';
            // $scope.searchDeviceId = '';
            vm.searchcountry = '';
            vm.searchCustomer = '';
            vm.searchDeviceId = '';
        };

        $scope.onSearchChange = function($event) {

            $event.stopPropagation();
        }



        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;

            });
        }

        $scope.toggle = function() {
            if (!$scope.flgforIcon) {
                $scope.flgforIcon = true;
            } else {
                $scope.flgforIcon = false;
            }

            $(function() {
                $(".showBtn").toggleClass("active");
                $(".ShowContentBox").slideToggle();
            });
        };
        $scope.toggle();

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('PurchaseOrderNumber'),
            DTColumnBuilder.newColumn('AppName').renderWith(TypeHtml),
            DTColumnBuilder.newColumn('Email').renderWith(EmailHtml),
            // DTColumnBuilder.newColumn('UserName').renderWith(UserNameHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('CreatedOnUtc').renderWith(DateFormateHtml),
            // DTColumnBuilder.newColumn('ExpiryDate').renderWith(DateFormateHtml),
            DTColumnBuilder.newColumn('OrderTotal'),
            DTColumnBuilder.newColumn('OrderNotes'),
            DTColumnBuilder.newColumn('ShippAddress1'),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(StatusHtml),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
        ]

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {


            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "orderservice/GetAllOrderServiceNew",
                    data: function(d) {
                        if ($scope.modelSearch.StartDate != '') {
                            d.StartDate = $scope.modelSearch.StartDate.toUTCString();
                        } else {
                            d.StartDate = '';
                        }
                        if ($scope.modelSearch.EndDate != '') {
                            d.EndDate = $scope.modelSearch.EndDate.toUTCString();
                        } else {
                            d.EndDate = '';
                        }
                        if ($rootScope.UserRoles != 'Super Admin') {
                            d.idApp = $rootScope.idApp;
                        }
                        d.Status = $scope.modelSearch.Status;
                        d.Type = $scope.modelSearch.Type;
                        if ($scope.modelSearch.Country != 'All') {
                            d.Country = _.findWhere($scope.lstCountry, { id: parseInt($scope.modelSearch.Country) }).Country;
                        } else {
                            d.Country = '';
                        }
                        d.DeviceId = $scope.modelSearch.DeviceId;
                        d.IdUser = $scope.modelSearch.IdUser;
                        d.search = $scope.modelSearch.Search;
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        $scope.TotalOrderTotal = 0;
                        $scope.TotalOrder = 0;
                        if (json.success != false) {
                            for (var i = 0; i < json.data.length; i++) {
                                $scope.TotalOrderTotal += json.data[i].OrderTotal;
                            }
                            $scope.lstdata = json.data;
                            $scope.TotalOrder = json.recordsTotal;
                            return json.data;
                        } else {
                            $scope.lstdata = [];
                            return [];
                        }
                    },
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withOption('aaSorting', [4, 'desc'])
                .withOption('responsive', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');

        });
        $scope.dtInstance = {};

        $scope.ChangeType = function() {
            $scope.modelSearch.DeviceId = 'All';
            $scope.modelSearch.IdUser = 'All';
            $scope.getAllCustomer();
            $scope.getAllDevice();
            $scope.GetAllOrderService(true);
        }

        //Reload Datatable
        $scope.GetAllOrderService = function(IsUpdate) {


            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#OrderServicetable').dataTable()._fnPageChange(0);
            $('#OrderServicetable').dataTable()._fnAjaxUpdate();

        }

        function GetAllOrderServiceFromModal() {
            $scope.GetAllOrderService(true);

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



        function EmailHtml(data, type, full, meta) {
            var email = '';
            if (full.tbluserinformation != null && full.tbluserinformation != undefined && full.tbluserinformation != '') {
                email = full.tbluserinformation.email;
            }
            return email;
        }

        function UserNameHtml(data, type, full, meta) {
            var username = '';
            if (full.tbluserinformation != null && full.tbluserinformation != undefined && full.tbluserinformation != '') {
                username = full.tbluserinformation.username;
            }
            return username;
        }

        function TypeHtml(data, type, full, meta) {
            var OType = '';
            if (full.tblappinfo != null && full.tblappinfo != undefined && full.tblappinfo != '') {
                OType = full.tblappinfo.AppName;
            }
            return OType;
        }

        function DateFormateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return 'N/A';
            }
        }


        function DeviceHtml(data, type, full, meta) {
            var device = '';
            if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
                device = full.tblorderservicestatus.OrderStatus;
            }
            return device;
        }

        function StatusHtml(data, type, full, meta) {
            var status = '';
            if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
                var statusname = full.tblorderservicestatus.OrderStatus;
                if (statusname == "Approved" || statusname == "Paid") {
                    status = '<b><span style="color:green;">' + statusname + '</span></b>';
                } else if (statusname == "Pending") {
                    status = '<span>Pending</span>';
                } else if (statusname == "Void") {
                    status = '<span style="color:orange;">Void</span>';
                } else if (statusname == "Completed") {
                    status = '<span style="color:blue;">Completed</span>';
                } else if (statusname == "Expire") {
                    status = '<span style="color:red;">Expire</span>';
                }
            }
            return status;
        }


        function actionsHtml(data, type, full, meta) {

            var btns = '<div layout="row" layout-align="center">'

            if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
                var statusname = full.tblorderservicestatus.OrderStatus;
                if (statusname != "Completed" && statusname != "Void") {
                    if ($rootScope.FlgModifiedAccess) {

                        if (statusname == "Pending") {
                            btns += '<md-button class="edit-button md-icon-button" ng-click="OpenPaymentModal($event,' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-cash"  class="s18 green-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Payment</md-tooltip>' +
                                '</md-button>';
                            btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus($event,' + data.id + ',2)" aria-label="">' +
                                '<md-icon md-font-icon="icon-checkbox-marked-circle-outline" class="s18 blue-500-fg" ></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Make Status Paid</md-tooltip>' +
                                '</md-button>';

                            // btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ',2)" aria-label="">' +
                            //     '<md-icon md-font-icon="icon-checkbox-marked-circle"  class="green-500-fg"></md-icon>' +
                            //     '<md-tooltip md-visible="" md-direction="">Approve Order Service</md-tooltip>' +
                            //     '</md-button>';

                            // btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ',4)" aria-label="">' +
                            //     '<md-icon md-font-icon="icon-no"  class="orange-500-fg"></md-icon>' +
                            //     '<md-tooltip md-visible="" md-direction="">Void Order Service</md-tooltip>' +
                            //     '</md-button>';

                        } else if (statusname == "Paid" && full.Terms != null && full.Terms != '') {
                            btns += '<md-button class="edit-button md-icon-button"  ng-click="OpenRemark($event,' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-comment-outline"  class="green-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Approve Order Service</md-tooltip>' +
                                '</md-button>';
                        }

                        // if (statusname == "Expire") {

                        //     btns += '<md-button class="edit-button md-icon-button"  ng-click="OpenUpdateDeviceModal($event,' + data.id + ')" aria-label="">' +
                        //         '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                        //         '<md-tooltip md-visible="" md-direction="">Edit Device</md-tooltip>' +
                        //         '</md-button>';
                        //     btns += '<md-button class="edit-button md-icon-button"  ng-click="EditDates(' + data.id + ')" aria-label="">' +
                        //         '<md-icon md-font-icon="icon-calendar-check-multiple" ></md-icon>' +
                        //         '<md-tooltip md-visible="" md-direction="">Update Date</md-tooltip>' +
                        //         '</md-button>';
                        // }

                        // if (statusname == "Approved" || statusname == "Expire") {
                        //     btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                        //         '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                        //         '<md-tooltip md-visible="" md-direction="">Renew Order Service</md-tooltip>' +
                        //         '</md-button>';
                        //     btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ',4)" aria-label="">' +
                        //         '<md-icon md-font-icon="icon-no"  class="orange-500-fg"></md-icon>' +
                        //         '<md-tooltip md-visible="" md-direction="">Void Order Service</md-tooltip>' +
                        //         '</md-button>';

                        // }

                    }
                }
            }
            btns += '</div>'
            return btns;
        };

        $scope.GetOrderServiceStatus = function() {
            $scope.LstAllStatus = [];
            $http.get($rootScope.RoutePath + "orderservice/GetOrderServiceStatus").then(function(resStatus) {
                $scope.LstAllStatus = resStatus.data;
            });
        }


        $scope.OpenPaymentModal = function(ev, id) {
            var objData = _.findWhere($scope.lstdata, {
                id: id
            });
            $mdDialog.show({
                controller: 'OpenPaymentModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/OrderService/dialogs/OpenPaymentModal/OpenPaymentModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: objData,
                    Tasks: [],
                    event: ev,
                    MainVM: vm,
                }
            })
        }

        $scope.OpenRemark = function(ev, id) {
            var objData = _.findWhere($scope.lstdata, {
                id: id
            });
            $mdDialog.show({
                controller: 'OpenRemarkController',
                controllerAs: 'vm',
                templateUrl: 'app/main/OrderService/dialogs/OpenRemark/OpenRemark.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: objData,
                    Tasks: [],
                    event: ev,
                    MainVM: vm,
                }
            })
        }

        $scope.OpenUpdateDeviceModal = function(ev, id) {
            var objData = _.findWhere($scope.lstdata, {
                id: id
            });
            $mdDialog.show({
                controller: 'UpdateDeviceModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/OrderService/dialogs/UpdateDeviceModal/UpdateDeviceModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: objData,
                    Tasks: [],
                    event: ev,
                    MainVM: vm,

                }
            })
        }

        $scope.RenewOrderService = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to renew this order service?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {
                var objData = _.findWhere($scope.lstdata, {
                    id: id
                });
                var params = {
                    id: objData.id,
                }
                $http.get($rootScope.RoutePath + "orderservice/RenewOrderService", {
                    params: params
                }).then(function(resRenew) {
                    if (resRenew.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(resRenew.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllOrderService(true);
                        $mdDialog.hide();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(resRenew.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });
        }


        $scope.ChangeStatus = function(ev, id, status) {

            var confirm = $mdDialog.prompt()
                .title('Change Status to Paid')
                .textContent('Please Enter Remarks.')
                .placeholder('Remarks')
                .ariaLabel('Remarks')
                .initialValue('')
                .targetEvent(ev)
                .ok('Save')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function(result) {
                if (result == undefined) {

                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Please enter remarks.')
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ChangeStatus(ev, id, status);
                } else {
                    var params = {
                        id: id,
                        status: status,
                        Remark: result
                    }
                    $http.get($rootScope.RoutePath + "billing/MakeStatusPaid", {
                        params: params
                    }).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.GetAllOrderService(true);
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    });
                }
            }, function() {});

            // if (status == 2) {
            //     var msg = "paid";
            // } else {
            //     var msg = "change status for";
            // }
            // var confirm = $mdDialog.confirm()
            //     .title('Are you sure you want to ' + msg + ' this order service?')
            //     .ok('Ok')
            //     .cancel('Cancel')
            // $mdDialog.show(confirm).then(function(ISConfirm) {

            //     var params = {
            //         id: id,
            //         status: status
            //     }
            //     $http.get($rootScope.RoutePath + "billing/MakeStatusPaid", {
            //         params: params
            //     }).then(function(data) {
            //         if (data.data.success == true) {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //             $scope.GetAllOrderService(true);
            //         } else {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //         }
            //     });
            // });

        }

        $scope.SearchReset = function() {
            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: 0,
                Type: 0,
                Country: 'All',
                Search: '',
                DeviceId: 'All',
                IdUser: 'All'
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllOrderService(true);
        }

        $scope.ShowALL = function() {
            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Status: 0,
                Type: 0,
                Country: 'All',
                Search: '',
                DeviceId: 'All',
                IdUser: 'All'
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllOrderService(true);
        }


        $scope.EditDates = function(id) {
            $scope.objOrderData = _.findWhere($scope.lstdata, {
                id: id
            });
            $scope.ShowDtl = true;

            $scope.modelUpdateDate = {
                id: $scope.objOrderData.id,
                CreatedOnUtc: new Date($scope.objOrderData.CreatedOnUtc)
            }
        }
        $scope.UpdateOrderServiceDates = function(o) {
            var params = {
                id: o.id,
                CreatedOnUtc: o.CreatedOnUtc,
            }
            $http.get($rootScope.RoutePath + "orderservice/UpdateOrderServiceDates", {
                params: params
            }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetUpdateDates();
                    $scope.GetAllOrderService(true);
                    $mdDialog.hide();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.ResetUpdateDates = function() {
            $scope.ShowDtl = false;

            $scope.modelUpdateDate = {
                id: 0,
                CreatedOnUtc: null
            }

        }

        $scope.CreateOrder = function() {
                var obj = {
                    UserId: 1,
                    DeviceId: "5418549849648",
                    UserName: "XXX",
                    Country: "Malaysia",
                    ProductTypeId: 1,
                }
                $http.post($rootScope.RoutePath + "orderservice/CreateOrderService", obj).then(function(resRenew) {
                    // console.log(resRenew)
                });
            }
            // $scope.CreateOrder();

        $scope.ExportOrderService = function() {
            var search = $scope.modelSearch.Search;

            var StartDate = '';
            if ($scope.modelSearch.StartDate != '') {
                StartDate = $scope.modelSearch.StartDate.toUTCString();
            } else {
                StartDate = '';
            }
            var EndDate = '';
            if ($scope.modelSearch.EndDate != '') {
                EndDate = $scope.modelSearch.EndDate.toUTCString();
            } else {
                EndDate = '';
            }
            var Status = $scope.modelSearch.Status;
            var Type = $scope.modelSearch.Type;
            if ($scope.modelSearch.Country != 'All') {
                var Country = _.findWhere($scope.lstCountry, { id: parseInt($scope.modelSearch.Country) }).Country;
            } else {
                var Country = '';
            }
            var idApp = 0;
            if ($rootScope.UserRoles != 'Super Admin') {
                idApp = $rootScope.idApp;
            }
            window.location = $rootScope.RoutePath + "orderservice/ExportOrderServiceNew?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Status=" + Status + "&Type=" + Type + "&search=" + search + "&idApp=" + idApp + "&Country=" + Country + "&IdUser=" + $scope.modelSearch.IdUser + "&DeviceId=" + $scope.modelSearch.DeviceId;
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            });
        }


        $scope.resetForm = function() {
            $scope.formOrderService.$setUntouched();
            $scope.formOrderService.$setPristine();
        }
        $scope.AddOrderService = function() {
            $scope.modelNew = {
                idUser: '',
            }
            $scope.model = {
                DeviceId: '',
                UserName: '',
                idApp: '',
                Name: '',
                idType: '',
            }
            $scope.OrderTotal = 0;
            $scope.FinalRenewList = [];
            $scope.IsRenewFalgOpen = false;
            $scope.selectedItem = null;
            $scope.flag = true;
            $scope.resetForm();
            $('#order .dataTables_empty').attr("colspan", 7);
        }

        $scope.ResetModel = function() {
            $scope.modelNew = {
                idUser: '',
            }
            $scope.model = {
                DeviceId: '',
                UserName: '',
                idApp: '',
                Name: '',
                idType: '',
            }
            $scope.OrderTotal = 0;
            $scope.FinalRenewList = [];
            $scope.IsRenewFalgOpen = false;
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.GetAllOrderService(true);
            $scope.flag = false;
        }

        $scope.SaveOrderService = function(o) {

            if (o.idApp == '') {
                o.idApp = $rootScope.idApp;
            }
            _.filter($scope.lstAppInfo, function(item) {
                if (item.id == o.idApp) {
                    o.AppName = item.AppName;
                }
            })
            $http.post($rootScope.RoutePath + "orderservice/SaveOrderService", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetModel();
                    $scope.GetAllOrderService(true);
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

        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function(q) {
            if (q != null && q != undefined) {
                $scope.model.iduser = q.id;
                $scope.modelNew.idUser = q.id;
                $scope.GetAllExpirePrice(q.id);
                $scope.model.UserName = q.email;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.iduser = '';
                $scope.modelNew.idUser = '';
                $scope.GetAllExpirePrice('');
                $scope.model.UserName = '';
                $scope.flgErrorNotFound = 1;
            };
        }
        $scope.GetUserByName = function(query) {
            var params = {
                    email: query,
                    appId: $rootScope.idApp,
                }
                // $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
            $http.get($rootScope.RoutePath + "user/GetUserByEmail", { params: params }).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }
        $scope.GetUserById = function(id) {
            $http.get($rootScope.RoutePath + "user/GetUserById?idUser=" + id).then(function(data) {
                if (data.data.success == true) {
                    $scope.objUser = data.data.data;
                    $scope.selectedItem = $scope.objUser;
                }
            })
        }
        $scope.init();
    }

})();