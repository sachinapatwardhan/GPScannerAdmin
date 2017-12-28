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
            };

            $scope.modelSearch = {
                Search: ''
            }

            $scope.GetAllAppInfo();
            $scope.flag = false;
            $scope.IsShow = false;
            $scope.FlgImage = false;

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
                            }
                        })
                        //$scope.GetAllUserWallet(true);
                        //$scope.GetAllDynamicLocation(true);
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


        //Filter
        // $scope.toggle = function() {
        //     // $scope.Reset()
        //     if (!$scope.flgforIcon) {
        //         $scope.flgforIcon = true;
        //     } else {
        //         $scope.flgforIcon = false;
        //     }

        //     $(function() {
        //         $(".showBtn").toggleClass("active");
        //         $(".ShowContentBox").slideToggle();
        //     });
        // };

        //Dynamic Pagging



        $scope.FilterStatus = '';

        $scope.dtUserColumns = [
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
            $scope.dtUsercustomOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "WalletTransaction/GetAllWallettransaction",
                    type: "get",
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
                    dataSrc: function(json) {
                        if (json.success != false) {
                            console.log(json.data)
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
                .withPaginationType('simple') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [7, 'asc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtUserInstance = {};

        // function actionsHtml(data, type, full, meta) {
        //     var btns = '<div layout="row">';
        //     if ($rootScope.FlgModifiedAccess) {
        //         btns += '<md-button class="edit-button md-icon-button"  ng-click="EditWalletById(' + data.id + ')" aria-label="Edit Location">' +
        //             '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
        //             '<md-tooltip md-visible="" md-direction="">Edit Wallet</md-tooltip>' +
        //             '</md-button>';
        //     }
        //     if ($rootScope.FlgDeletedAccess) {
        //         btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteWalletById(' + data.id + ',false)" aria-label="Make Location InActive">' +
        //             '<i class="icon-cancel s18 red-500-fg"></i>' +
        //             '<md-tooltip md-visible="" md-direction="">Make Location InActive</md-tooltip>' +
        //             '</md-button>';
        //     }
        //     btns += '</div>';
        //     return btns;
        // }
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

                    // if ($rootScope.FlgModifiedAccess && full.tblorderservicestatus.OrderStatus == "Pending") {
                    //     btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ')" aria-label="">' +
                    //         '<md-icon md-font-icon="icon-checkbox-marked-circle"  class="green-500-fg"></md-icon>' +
                    //         '<md-tooltip md-visible="" md-direction="">Approve Order Service</md-tooltip>' +
                    //         '</md-button>';
                    // }

                    // if ($rootScope.FlgModifiedAccess) {
                    //     if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
                    //         var statusname = full.tblorderservicestatus.OrderStatus;
                    //         if (statusname == "Approved") {
                    //             btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
                    //                 '<md-icon md-font-icon="icon-account-network"  class="blue-500-fg"></md-icon>' +
                    //                 '<md-tooltip md-visible="" md-direction="">Renew Order Service</md-tooltip>' +
                    //                 '</md-button>';

                    //         }

                    //         if (statusname != "Completed") {

                    //             btns += '<md-button class="edit-button md-icon-button"  ng-click="EditDates(' + data.id + ')" aria-label="">' +
                    //                 '<md-icon md-font-icon="icon-calendar-check-multiple" ></md-icon>' +
                    //                 '<md-tooltip md-visible="" md-direction="">Update Date</md-tooltip>' +
                    //                 '</md-button>';
                    //         }
                    //     }
                    // }
                }
                btns += '</div>'
                return btns;
            }

        };

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

        $scope.reloadData = function() {}

        function callback(json) {}

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        //Reload Datatable
        $scope.WalletTransaction = function(IsUpdate) {

            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };

            $scope.dtUserInstance.reloadData(callback, resetPaging);
            $('#WalletTransaction').dataTable()._fnAjaxUpdate();
        }

        $scope.ChangeStatus = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to approve this Transaction?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {

                var params = {
                    id: id,
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
                        $scope.WalletTransaction(true);
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
                .title('Are you sure you want to renew this order service?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {
                var params = {
                    id: id,
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
                        $scope.WalletTransaction(true);
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

        //Edit Wallet
        // $scope.EditWalletById = function(id) {
        //     $rootScope.FlgAddedEditlocal = true;
        //     var o = _.findWhere($scope.lstWalletList, { id: id });
        //     //$scope.GetAllStateByCountry(o.Countryid);
        //     //$scope.GetAllCityByState(o.Stateid);          
        //     $scope.model.id = o.id;
        //     $scope.model.idUser = o.idUser;
        //     $scope.model.Amount = o.Amount;
        //     $scope.model.Remark = o.Remark;
        //     $scope.model.Type = o.Type;
        //     $scope.model.PaymentType = o.PaymentType;
        //     $scope.model.OrderNumber = o.OrderNumber;
        //     $scope.flag = true;
        // }

        $scope.restForm = function() {
            $scope.formWalletTransaction.$setUntouched();
            $scope.formWalletTransaction.$setPristine();

        }

        $scope.RemoveImage = function() {
            $scope.apiMedia.removeAll();
            $scope.model.PaymentReceipt = '';
            $scope.FlgImage = false;
        }

        // $scope.ResetTab = function() {
        //     if ($rootScope.FlgAddedAccess != true) {
        //         $rootScope.FlgAddedEditlocal = false;
        //     }
        // }
        // $scope.GetSerch = function(Search) {
        //     $scope.Search = Search;
        //     $scope.GetAllUserWallet(true);
        // }
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
            };

            $scope.modelSearch = {
                Search: ''
            }
            $scope.restForm();
            $scope.flag = true;
            $scope.FlgImage = false;
        }

        // $scope.ResetModel1 = function() {
        //     $scope.model = {
        //         id: 0,
        //         idUser: '',
        //         Amount: '',
        //         Type: 'Credit',
        //         Remark: '',
        //         PaymentType: 'Admin',
        //         OrderNumber: '',
        //         CreatedDate: new Date(),
        //         Createdby: $rootScope.UserName,
        //     };
        //     $scope.restForm();
        //     $scope.flag = true;
        // }

        // //Reload Datatable

        // $scope.Reset = function() {
        //     $scope.model = {
        //         id: 0,
        //         idCountry: $scope.idCountry,
        //         idState: '',
        //         idCity: '',
        //         LocationName: '',
        //         Address: '',
        //         Zipcode: '',
        //         CreatedDate: new Date(),
        //         Createdby: $rootScope.UserName,
        //         Latitude: '',
        //         Longitude: '',
        //         Search: '',
        //     };
        //     $scope.GetAllStateByCountry($scope.model.idCountry)
        //     $scope.restForm();

        // }

        // $scope.ResetSearch = function() {
        //     $scope.tab = { selectedIndex: 0 };
        //     $scope.modelSearch = {
        //         idCountry: 'All',
        //         idState: 'All',
        //         idCity: 'All',
        //         IsActive: 'All',
        //         idRegion: 'All',

        //     }
        //     $scope.lstSearchState = '';
        //     $scope.lstSearchCity = '';
        //     $scope.GetAllUserWallet(true);
        // }
        // $scope.gotoWalletList = function() {
        //     $scope.model = {
        //         id: 0,
        //         idUser: '',
        //         Amount: '',
        //         Type: 'Credit',
        //         Remark: '',
        //         PaymentType: 'Admin',
        //         OrderNumber: '',
        //         CreatedDate: new Date(),
        //         Createdby: $rootScope.UserName,
        //     };

        //     $scope.modelSearch = {
        //         Search: ''
        //     }
        //     $scope.flag = false
        //     $scope.GetAllUserWallet(true);
        // }
        $scope.init();
    }
})();