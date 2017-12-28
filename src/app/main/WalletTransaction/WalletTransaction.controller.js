(function() {
    'use strict';

    angular
        .module('app.WalletTransaction')
        .controller('WalletTransactionController', WalletTransactionController);

    /** @ngInject */
    function WalletTransactionController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        vm.isFormValid = isFormValid;

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
                Search: ''
            }


            $scope.flag = false;
            $scope.IsShow = false;
            $scope.FlgImage = false;
            $scope.GetAllAppInfo();

        }

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


        $scope.dtWalletColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('OrderNumber'),
            DTColumnBuilder.newColumn('AppName'),
            DTColumnBuilder.newColumn('Amount'),
            DTColumnBuilder.newColumn('Type'),
            DTColumnBuilder.newColumn('Remark').renderWith(RemarkHtml),
            DTColumnBuilder.newColumn('IsPaymentSuccess').renderWith(StatusHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('CreatedBy'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(DateHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('ExpiryDate').renderWith(DateHtml).withOption('class', 'text-center'),
            DTColumnBuilder.newColumn(null).renderWith(actionsHtml).notSortable(),

        ]

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.dtWalletcustomOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "WalletTransaction/GetAllWallettransaction",
                    data: function(d) {
                        d.search = $scope.modelSearch.Search;
                        // if ($scope.modelSearch.idCountry == 'All') {
                        //     d.idCountry = '';
                        // } else {
                        //     d.idCountry = $scope.modelSearch.idCountry;
                        // }
                        // if ($scope.modelSearch.idState == 'All') {
                        //     d.idState = '';
                        // } else {
                        //     d.idState = $scope.modelSearch.idState;
                        // }
                        // if ($scope.modelSearch.idCity == 'All') {
                        //     d.idCity = '';
                        // } else {
                        //     d.idCity = $scope.modelSearch.idCity;
                        // }

                        // if ($scope.modelSearch.IsActive == 'All') {
                        //     d.IsActive = '';
                        // } else {
                        //     d.IsActive = $scope.modelSearch.IsActive;
                        // }                      
                        if ($scope.IsShow == true) {
                            d.idApp = '';
                        } else {
                            d.idApp = parseInt(localStorage.getItem('appId'));
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
            $('#WalletTransactiontable').dataTable()._fnPageChange(0);
            $('#WalletTransactiontable').dataTable()._fnAjaxUpdate();
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

        function DateHtml(data, type, full, meta) {
            if (full != null && full != undefined && full != '') {
                return $rootScope.convertdateformat(full.CreatedDate, 1);
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
                Search: ''
            }

            $scope.flag = true;
            $scope.FlgImage = false;
            $scope.GetAllAppInfo()
            $scope.restForm();
            $scope.apiMedia.removeAll();
        }

        $scope.init();
    }
})();