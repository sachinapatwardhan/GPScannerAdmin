(function() {
    'use strict';

    angular
        .module('app.WalletTransaction')
        .controller('WalletTransactionController', WalletTransactionController);

    /** @ngInject */
    function WalletTransactionController($http, $scope, $cookieStore, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var First = 1;
        var vm = this;
        vm.isFormValid = isFormValid;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.idApp = localStorage.getItem('appId');
        $scope.GetAllProductType = function() {
            $scope.lstProductTypes = [];
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstProductTypes = data.data;
            });
        }
        $scope.GetAllProductType();

        $scope.init = function() {
            $scope.model = {
                id: 0,
                idApp: '',
                Amount: '',
                Type: 'Debit',
                Remark: '',
                OrderNumber: '',
                IsPaymentSuccess: 0,
                PaymentType: 'Offline',
                Country: $cookieStore.get('UserCountry'),
                DeviceId: ''
            };

            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: -1,
                idApp: 0,
                Search: '',
                idAppsearch: 0,
                Type: 'All',
                idCountry: 'All'
            }


            $scope.flag = false;
            //$scope.IsShow = false;
            $scope.FlgImage = false;
            // $scope.GetAllAppInfo(function() {

            // });

            $scope.GetAllCountry();

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
        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.clearSearchTerm = function() {
            $scope.searchdropdown = {
                searchCountry: '',
            }
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.GetAllAppInfo = function(callback) {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                var AppInfo = _.findWhere(data.data, { id: parseInt(localStorage.getItem('appId')) });
                if (AppInfo.AppName == "Maark") {
                    $scope.lstAppInfo = _.filter(data.data, function(item) {
                        if (parseInt(item.id) != parseInt(localStorage.getItem('appId'))) {
                            return item;
                        }
                    });
                } else {
                    $scope.model.idApp = parseInt(localStorage.getItem('appId'));
                    $scope.modelSearch.idAppsearch = parseInt(localStorage.getItem('appId'));
                }
                $scope.GetDeviceID(AppInfo.AppName, false)
                return callback();
            });
        }

        $scope.GetDeviceID = function(AppName, Isflag) {
            if (Isflag == true) {
                var AppName = _.findWhere($scope.lstAppInfo, { id: parseInt(AppName) }).AppName;
            }
            var params = {
                AppName: AppName
            }
            $http.get($rootScope.RoutePath + "WalletTransaction/GetAllDeviceID", {
                params: params
            }).then(function(DeviceID) {
                console.log(DeviceID)
                if (DeviceID.data.length > 0) {
                    $scope.lstDeviceId = _.uniq(DeviceID.data, 'DeviceId');
                } else {
                    $scope.lstDeviceId = [];
                }
            });
        }

        $scope.clearSearchTerm = function() {
            $scope.searchdropdown = {
                searchAppInfo: '',
                searchDeviceId: ''
            }
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        $scope.CreateWallet = function(o) {
            $http.post($rootScope.RoutePath + "WalletTransaction/Savewallettransaction", o).then(function(data) {

                if (data.data.success == true) {
                    var id;
                    if (o.id != 0) {
                        id = o.id;
                    } else {
                        id = data.data.data.id;
                    }
                    if ($scope.Mediafiles != undefined && $scope.Mediafiles != '' && $scope.Mediafiles != null) {
                        var formData = new FormData();
                        angular.forEach($scope.Mediafiles, function(obj) {
                            formData.append(id, obj.lfFile);
                        });
                        $http.post($rootScope.RoutePath + "WalletTransaction/uploadImage", formData, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).then(function(data) {
                            if (data.data.success == true) {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(data.data.message)
                                    .position('top right')
                                    .hideDelay(3000)
                                );
                                $scope.restForm();
                                $scope.SearchReset();
                                $scope.apiMedia.removeAll();
                                // $scope.GetAllAppInfo(function () {
                                //     $scope.init();
                                //     $scope.restForm();
                                //     $scope.apiMedia.removeAll();
                                //     $scope.WalletTransactionReload(true);
                                // });
                            }
                        })
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.restForm();
                        $scope.SearchReset();
                        $scope.apiMedia.removeAll();
                    }
                } else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    };
                    HideLoader()
                }
            });

        };

        //Dynamic Pagging




        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            if (First > 0) {
                First = 0;
                $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                    var AppInfo = _.findWhere(data.data, { id: parseInt(localStorage.getItem('appId')) });
                    if (AppInfo.AppName == "Maark") {
                        $scope.IsShow = true;
                    } else {
                        $scope.IsShow = false;
                    }
                    ResCall();
                });
            } else {
                ResCall();

            }

            function ResCall() {

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center').withOption('width', '2%').withOption('responsivePriority', 0),
                    DTColumnBuilder.newColumn('OrderNumber').withOption('width', '15%').withOption('class', 'text-center').withOption('responsivePriority', 1),
                    DTColumnBuilder.newColumn('DeviceId').renderWith(DeviceIdHtml).withOption('class', 'text-center').withOption('responsivePriority', 2),
                    DTColumnBuilder.newColumn('AppName').withOption('class', 'text-center').withOption('responsivePriority', 3),
                    DTColumnBuilder.newColumn('Amount').withOption('class', 'text-center').withOption('width', '2%').withOption('responsivePriority', 4),
                    DTColumnBuilder.newColumn('Type').renderWith(TypeHtml).withOption('class', 'text-center').withOption('responsivePriority', 6),
                    DTColumnBuilder.newColumn('CreatedBy').withOption('class', 'text-center').withOption('responsivePriority', 7),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(DateHtml).withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(DateHtml).withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('Remark').renderWith(RemarkHtml).withOption('width', '10%'),
                    DTColumnBuilder.newColumn('Country').renderWith(CountryHtml).withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('IsPaymentSuccess').renderWith(StatusHtml).withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn(null).renderWith(ImageHtml).withOption('class', 'text-center').notSortable().withOption('responsivePriority', 5),
                    DTColumnBuilder.newColumn(null).renderWith(actionsHtml).notSortable(),

                ]

                $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                        url: $rootScope.RoutePath + "WalletTransaction/GetAllWallettransaction",
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
                            if ($scope.modelSearch.Type != 'All') {
                                d.Type = $scope.modelSearch.Type;
                            } else {
                                d.Type = '';
                            }
                            if ($scope.modelSearch.idCountry != 'All') {
                                d.Country = _.findWhere($scope.lstCountry, { id: parseInt($scope.modelSearch.idCountry) }).Country;
                            } else {
                                d.Country = '';
                            }
                            d.search = $scope.modelSearch.Search;
                            d.Status = $scope.modelSearch.Status;

                            if ($rootScope.UserRoles != 'Super Admin') {
                                d.idApp = $rootScope.idApp;
                            }
                            d.idAppsearch = $scope.modelSearch.idAppsearch;
                            console.log(d)
                            return d;
                        },
                        type: "get",
                        dataSrc: function(json) {
                            $scope.lstWalletList = [];
                            if (json.success != false) {
                                $scope.lstWalletList = json.data;
                                $scope.recordsTotal = json.recordsTotal;
                                $scope.TotalCredit = 0;
                                $scope.TotalDebit = 0;
                                $scope.Amount = _.reduce($scope.lstWalletList, function(m, x) {
                                    if (x.Type == 'Credit') {
                                        $scope.TotalCredit = $scope.TotalCredit + x.Amount;
                                        return m + x.Amount;
                                    } else {
                                        $scope.TotalDebit = $scope.TotalDebit + x.Amount;
                                        return m - x.Amount;
                                    }
                                }, 0)
                                $scope.recordsTotal = json.recordsTotal;
                                return json.data;

                            } else {
                                return [];
                            }
                        },
                    }).withOption('processing', true) //for show progress bar
                    .withOption('serverSide', true) // for server side processing
                    .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                    .withDisplayLength(25) // Page size
                    .withOption('aaSorting', [7, 'desc'])
                    .withOption('responsive', true)
                    .withOption('createdRow', createdRow)
                    // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                    .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                    .withOption('scrollY', 'auto')
            }
        });


        $scope.dtInstance = {}

        //Reload Datatable
        $scope.WalletTransactionReload = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Transactiontable').dataTable()._fnPageChange(0);
            $('#Transactiontable').dataTable()._fnAjaxUpdate();
        }

        $scope.reloadData = function() {}

        function callback(json) {}

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function StatusHtml(data, type, full, meta) {
            var status = '';
            if (data == 0) {
                status = '<span>Pending</span>';
            } else if (data == 1) {
                status = '<span style="color:green;">Approve</span>';
            } else if (data == 2) {
                status = '<span style="color:orange;">Completed</span>';
            } else if (data == 3) {
                status = '<span style="color:Brown;">Void</span>';
            } else if (data == 4) {
                status = '<span style="color:red;">Expired</span>';
            }
            return status;

        }

        function TypeHtml(data, type, full, meta) {
            var ttyp = 'N/A';
            if (data == "Credit") {
                ttyp = ' <span style="color:green;">Credit</span>'
            } else if (data == "Debit") {
                ttyp = ' <span style="color:red;">Debit</span>'
            }
            return ttyp;
        }


        function DateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return 'N/A';
            }
        }

        function RemarkHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return data;
            } else {
                return 'N/A';
            }
        }

        function DeviceIdHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return data;
            } else {
                return 'N/A';
            }
        }

        function CountryHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return data;
            } else {
                return 'N/A';
            }
        }

        function NullHtml(data, type, full, meta) {
            if (data == null) {
                return "N/A"
            } else {
                return data;
            }
        }

        function ImageHtml(data, type, full, meta) {
            var img = '';
            if (full.PaymentReceipt != "") {
                img = '<a ng-click="OpenPaymentReceiptModal($event,' + full.id + ')"><img ng-src="' + $rootScope.RoutePath + 'MediaUploads/WalletReceipt/' + full.PaymentReceipt + '" err-src="assets/images/no-image.png" height="50px" width="50px"></a>';

            } else if (full.PaymentReceipt == "") {
                img = '<img ng-src="assets/images/no-image.png" height="50px" width="50px">';
            }
            return img;
        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">'
            if ($scope.IsShow == true) {
                var status = full.IsPaymentSuccess;
                if (status == 0) {
                    if ($rootScope.FlgModifiedAccess) {
                        btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ')" aria-label="">' +
                            '<md-icon md-font-icon="icon-checkbox-marked-circle"  class="green-500-fg"></md-icon>' +
                            '<md-tooltip md-visible="" md-direction="">Approve</md-tooltip>' +
                            '</md-button>';
                    }
                } else if (status == 1) {
                    if ($rootScope.FlgModifiedAccess) {
                        btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                            '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                            '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                            '</md-button>';
                    }
                } else if (status == 4) {
                    if ($rootScope.FlgModifiedAccess) {
                        btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                            '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                            '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                            '</md-button>';

                        btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatusVoid(' + data.id + ')" aria-label="">' +
                            '<md-icon md-font-icon="icon-no"  class="Brown-500-fg"></md-icon>' +
                            '<md-tooltip md-visible="" md-direction="">Void Wallet Transaction</md-tooltip>' +
                            '</md-button>';
                    }
                }
                btns += '</div>'
                return btns;
            } else {
                if (full.Type == 'Debit') {
                    var status = full.IsPaymentSuccess;
                    if (status == 0) {
                        if ($rootScope.FlgModifiedAccess) {
                            btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-checkbox-marked-circle"  class="green-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Approve</md-tooltip>' +
                                '</md-button>';
                        }
                    } else if (status == 1) {
                        if ($rootScope.FlgModifiedAccess) {
                            btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                                '</md-button>';
                        }
                    } else if (status == 4) {
                        if ($rootScope.FlgModifiedAccess) {
                            btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                                '</md-button>';


                            btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatusVoid(' + data.id + ')" aria-label="">' +
                                '<md-icon md-font-icon="icon-no"  class="Brown-500-fg"></md-icon>' +
                                '<md-tooltip md-visible="" md-direction="">Void Wallet Transaction</md-tooltip>' +
                                '</md-button>';
                        }
                    }
                }
                btns += '</div>'
                return btns;
            }

        };

        $scope.ChangeStatus = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to approve this Transaction?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {

                var params = {
                    id: id,
                    UserName: $cookieStore.get('UserName')
                }
                $http.get($rootScope.RoutePath + "WalletTransaction/ApproveTransaction", {
                    params: params
                }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        First = 1;
                        $scope.WalletTransactionReload(true);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });

        }

        $scope.ChangeStatusVoid = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to Void this Transaction?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {

                var params = {
                    id: id,
                    UserName: $cookieStore.get('UserName')
                }
                $http.get($rootScope.RoutePath + "WalletTransaction/VoidTransaction", {
                    params: params
                }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        First = 1;
                        $scope.WalletTransactionReload(true);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });

        }

        $scope.RenewOrderService = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to renew this Transaction?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {
                var params = {
                    id: id,
                    UserName: $cookieStore.get('UserName')
                }
                $http.get($rootScope.RoutePath + "WalletTransaction/RenewTransaction", {
                    params: params
                }).then(function(resRenew) {
                    if (resRenew.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(resRenew.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        First = 1;

                        $scope.WalletTransactionReload(true);
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


        $scope.restForm = function() {
            $scope.formWalletTransaction.$setUntouched();
            $scope.formWalletTransaction.$setPristine();

        }


        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                idApp: '',
                Amount: '',
                Type: 'Debit',
                Remark: '',
                OrderNumber: '',
                IsPaymentSuccess: 0,
                PaymentType: 'Offline',
                Country: $cookieStore.get('UserCountry'),
                DeviceId: ''
            };

            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: -1,
                idApp: 0,
                Search: '',
                Type: 'All',
                idCountry: 'All'
            }

            $scope.flag = true;
            $scope.FlgImage = false;

            $scope.GetAllAppInfo(function() {
                $scope.restForm();
                $scope.apiMedia.removeAll();
            });

        }

        $scope.Cancel = function() {
            $scope.model = {
                id: 0,
                idApp: '',
                Amount: '',
                Type: 'Credit',
                Remark: '',
                OrderNumber: '',
                IsPaymentSuccess: 0,
                PaymentType: 'Offline',
                Country: $cookieStore.get('UserCountry'),
                DeviceId: ''
            };
            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: -1,
                idApp: 0,
                Search: '',
                idAppsearch: 0,
                Type: 'All',
                idCountry: 'All'
            }
            $scope.GetAllAppInfo(function() {

                $scope.flag = false;
                $scope.restForm();
                $scope.WalletTransactionReload(true);
            })

        }

        $scope.SearchReset = function() {
            $scope.modelSearch = {
                StartDate: new Date(),
                EndDate: new Date(),
                Status: -1,
                idApp: 0,
                Search: '',
                idAppsearch: 0,
                Type: 'All',
                idCountry: 'All'
            }
            $scope.flag = false;
            //$scope.apiMedia.removeAll();
            $scope.GetAllAppInfo(function() {
                $scope.WalletTransactionReload(true);
            });

        }

        $scope.ShowAll = function() {
            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Status: -1,
                idApp: 0,
                Search: '',
                idAppsearch: 0,
                Type: 'All',
                idCountry: 'All'
            }
            $scope.flag = false;
            //$scope.apiMedia.removeAll();
            //$scope.GetAllAppInfo(function() {
            $scope.WalletTransactionReload(true);
            //});

        }

        $scope.ExportWalletTransaction = function() {
            var search = '';
            if ($scope.modelSearch.Search == '' || $scope.modelSearch.Search == '') {
                search = '';
            } else {
                search = $scope.modelSearch.Search;
            }
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
            var Country = '';
            if ($scope.modelSearch.idCountry != 'All') {
                Country = _.findWhere($scope.lstCountry, { id: parseInt($scope.modelSearch.idCountry) }).Country;
            } else {
                Country = '';
            }
            var Status = $scope.modelSearch.Status;

            var idApp = 0;
            if ($rootScope.UserRoles != 'Super Admin') {
                idApp = $rootScope.idApp;
            }
            var idAppsearch = $scope.modelSearch.idAppsearch;

            window.location = $rootScope.RoutePath + "WalletTransaction/ExportWalletTransaction?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Status=" + Status + "&search=" + search + "&idApp=" + idApp + "&idAppsearch=" + idAppsearch + "&Country=" + Country;
        }

        $scope.OpenPaymentReceiptModal = function(ev, id) {
            var imgsrc = _.findWhere($scope.lstWalletList, { id: id }).PaymentReceipt;
            $mdDialog.show({
                controller: 'ReceiptModalController',
                controllerAs: 'vm',
                templateUrl: 'app/main/WalletTransaction/dialogs/ReceiptModal/ReceiptModal.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    ImageN: imgsrc
                }
            });
        }

        $scope.init();
    }
})();