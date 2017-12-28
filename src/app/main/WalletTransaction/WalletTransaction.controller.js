(function() {
    'use strict';

    angular
        .module('app.WalletTransaction')
        .controller('WalletTransactionController', WalletTransactionController);

    /** @ngInject */
    function WalletTransactionController($http, $scope, $cookieStore, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

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
                Type: 'Credit',
                Remark: '',
                OrderNumber: '',
                IsPaymentSuccess: 0,
                PaymentType: 'Offline',
                Country: $cookieStore.get('UserCountry')
            };

            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Status: -1,
                Type: 0,
                Search: ''
            }


            $scope.flag = false;
            $scope.IsShow = false;
            $scope.FlgImage = false;
            $scope.GetAllAppInfo();

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

        $scope.GetAllAppInfo = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                var AppInfo = _.findWhere(data.data, { id: parseInt(localStorage.getItem('appId')) });
                if (AppInfo.AppName == "Maark") {

                    $scope.lstAppInfo = _.filter(data.data, function(item) {
                        if (parseInt(item.id) != parseInt(localStorage.getItem('appId'))) {
                            return item;
                        }
                    });
                    $scope.IsShow = true;
                } else {
                    $scope.IsShow = false;
                    $scope.model.idApp = parseInt(localStorage.getItem('appId'));
                }
            });
        }

        $scope.clearSearchTerm = function() {
            $scope.searchdropdown = {
                searchAppInfo: '',
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

        //Create Wallet
        $scope.CreateWallet = function(o) {
            $http.post($rootScope.RoutePath + "WalletTransaction/Savewallettransaction", o).then(function(data) {
                if (data.data.success == true) {
                    var id;
                    if (o.id != 0) {
                        id = o.id;
                    } else {
                        id = data.data.data.id;
                    }
                    if ($scope.Mediafiles.lenght > 0) {
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
                                $scope.init();
                                $scope.restForm();
                                $scope.apiMedia.removeAll();
                                $scope.WalletTransactionReload(true);

                            }
                        })
                    } else {
                        $scope.init();
                        $scope.restForm();
                        $scope.apiMedia.removeAll();
                        $scope.WalletTransactionReload(true);
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


        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('OrderNumber'),
            DTColumnBuilder.newColumn('AppName'),
            DTColumnBuilder.newColumn('Amount').withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('Type').renderWith(TypeHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('Remark').renderWith(RemarkHtml),
            DTColumnBuilder.newColumn('IsPaymentSuccess').renderWith(StatusHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('CreatedBy'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(DateHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('ExpiryDate').renderWith(DateHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn(null).renderWith(actionsHtml).notSortable(),

        ]

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
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

                        d.search = $scope.modelSearch.Search;
                        d.Status = $scope.modelSearch.Status;
                        d.Type = $scope.modelSearch.Type;
                        console.log($rootScope.UserRoles)
                        if ($rootScope.UserRoles != 'Super Admin') {
                            d.idApp = '';
                        } else {
                            d.idApp = $scope.modelSearch.idApp;
                        }
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstWalletList = json.data;
                            $scope.recordsTotal = json.recordsTotal;
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
                .withOption('aaSorting', [8, 'asc'])
                .withOption('responsive', true)
                .withOption('createdRow', createdRow)
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
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

        function NullHtml(data, type, full, meta) {
            if (data == null) {
                return "N/A"
            } else {
                return data;
            }
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
                .title('Are you sure you want to renew this renew Transaction?')
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

        $scope.RemoveImage = function() {
            $scope.apiMedia.removeAll();
            $scope.model.PaymentReceipt = '';
            $scope.FlgImage = false;
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                idApp: '',
                Amount: '',
                Type: 'Credit',
                Remark: '',
                OrderNumber: '',
                IsPaymentSuccess: 0,
                PaymentType: 'Offline',
                Country: $cookieStore.get('UserCountry')
            };

            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Status: -1,
                Type: 0,
                Search: ''
            }

            $scope.flag = true;
            $scope.FlgImage = false;
            $scope.GetAllAppInfo()
            $scope.restForm();
            $scope.apiMedia.removeAll();
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
                Country: $cookieStore.get('UserCountry')
            };

            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Status: -1,
                Type: 0,
                Search: ''
            }
            $scope.flag = false;
            $scope.restForm();

        }
        $scope.init();
    }
})();