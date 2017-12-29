(function () {
    'use strict';

    angular
        .module('app.wallet')
        .controller('WalletController', WalletController);

    /** @ngInject */
    function WalletController($http, $scope, $cookieStore, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;

        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.idApp = localStorage.getItem('appId');

        $scope.IsMark = false;
        var GidApp = 0;
        $scope.GetAllProductType = function (callback) {
            $scope.lstProductTypes = [];
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
                $scope.lstProductTypes = data.data;
                var AppInfo = _.findWhere(data.data, { id: parseInt(localStorage.getItem('appId')) });
                if (AppInfo != undefined && AppInfo.AppName == "Maark") {
                    $scope.lstProductTypes = _.filter(data.data, function (item) {
                        if (parseInt(item.id) != parseInt(localStorage.getItem('appId'))) {
                            return item;
                        }
                    });
                } else {
                    console.log("CAL")
                    GidApp = parseInt(localStorage.getItem('appId'));
                }
                return callback();
            });
        }


        $scope.init = function () {
            $scope.GetAllProductType(function () {
                $scope.modelSearch = {
                    StartDate: '',
                    EndDate: '',
                    Type: 'All',
                    idApp: GidApp,
                }

                console.log($scope.modelSearch)
            });
        }

        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
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
            });
        };



        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
                var AppInfo = _.findWhere(data.data, { id: parseInt(localStorage.getItem('appId')) });
                if (AppInfo != undefined && AppInfo.AppName == "Maark") {
                    $scope.IsMark = true;
                    ForwardProced();
                } else {
                    $scope.IsMark = false;
                    $scope.modelSearch.idApp = parseInt(localStorage.getItem('appId'));
                    ForwardProced();
                }

                function ForwardProced() {

                    $scope.dtColumns = [
                        DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center').withOption('width', '2%'),
                        DTColumnBuilder.newColumn('OrderNo').renderWith(OrderNoHtml).withOption('class', 'text-center').withOption('width', '15%'),
                        DTColumnBuilder.newColumn('AppName').renderWith(AppNameHtml).withOption('class', 'text-center'),
                        DTColumnBuilder.newColumn('Amount').withOption('class', 'text-center'),
                        DTColumnBuilder.newColumn('Type').renderWith(TypeHtml).withOption('class', 'text-center'),
                        DTColumnBuilder.newColumn('Country').renderWith(CountryHtml).withOption('class', 'text-center'),
                        DTColumnBuilder.newColumn('CreatedDate').renderWith(DateFormateHtml).withOption('class', 'text-center'),
                        DTColumnBuilder.newColumn('Remark').withOption('class', 'text-center'),
                    ]

                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                        url: $rootScope.RoutePath + "WalletTransaction/GetAllWalletes",
                        data: function (d) {
                            if ($scope.Search == '') {
                                d.search = '';
                            } else {
                                d.search = $scope.Search;
                            }
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
                            } else {
                                d.idApp = $scope.modelSearch.idApp;
                            }
                            d.Type = $scope.modelSearch.Type;
                            return d;
                        },
                        type: "get",
                        dataSrc: function (json) {
                            $scope.TotalOrderTotal = 0;
                            $scope.TotalCredit = 0;
                            $scope.TotalDebit = 0;
                            if (json.success != false) {
                                for (var i = 0; i < json.data.length; i++) {
                                    if (json.data[i].Type == "Credit") {
                                        $scope.TotalCredit += json.data[i].Amount;
                                    } else {
                                        $scope.TotalDebit += json.data[i].Amount;
                                    }
                                }
                                $scope.TotalOrderTotal = $scope.TotalCredit - $scope.TotalDebit;
                                $scope.lstdata = json.data;
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
                        .withOption('aaSorting', [6, 'desc'])
                        .withOption('responsive', true)
                        .withOption('createdRow', createdRow)
                        .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                        .withOption('scrollY', 'auto');
                }
            });
        });


        $scope.dtInstance = {};

        //Reload Datatable
        $scope.GetAllWalletes = function (IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#WalletDttable').dataTable()._fnPageChange(0);
            $('#WalletDttable').dataTable()._fnAjaxUpdate();

        }
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

        function OrderNoHtml(data, type, full, meta) {
            var OrderNo = '';
            if (full.tblwallettransaction != null && full.tblwallettransaction != undefined && full.tblwallettransaction != '') {
                OrderNo = full.tblwallettransaction.OrderNumber;
            }
            return OrderNo;
        }

        function AppNameHtml(data, type, full, meta) {
            var AppName = '';
            if (full.tblwallettransaction != null && full.tblwallettransaction != undefined && full.tblwallettransaction != '') {
                if (full.tblwallettransaction.tblappinfo != null && full.tblwallettransaction.tblappinfo != undefined && full.tblwallettransaction.tblappinfo != '') {
                    AppName = full.tblwallettransaction.tblappinfo.AppName;
                }
            }
            return AppName;
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

        function CountryHtml(data, type, full, meta) {
            var cntry = '';
            if (full.tblwallettransaction != null && full.tblwallettransaction != undefined && full.tblwallettransaction != '') {
                cntry = full.tblwallettransaction.Country;
            }
            return cntry;
        }

        function DateFormateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return 'N/A';
            }
        }

        $scope.GetSerch = function (Search) {
            $scope.Search = Search;
            $scope.GetAllWalletes(true);
        }

        $scope.ExportWallet = function () {
            var search = '';
            if ($scope.Search == '' || $scope.Search == '') {
                search = '';
            } else {
                search = $scope.Search;
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
            var Type = $scope.modelSearch.Type;

            var idApp = 0;
            if ($rootScope.UserRoles != 'Super Admin') {
                idApp = $rootScope.idApp;
            } else {
                idApp = $scope.modelSearch.idApp;
            }

            window.location = $rootScope.RoutePath + "WalletTransaction/ExportWallet?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Type=" + Type + "&search=" + search + "&idApp=" + idApp;
        }

        $scope.SearchReset = function () {
            $scope.modelSearch = {
                StartDate: '',
                EndDate: '',
                Type: 'All',
                idApp: GidApp
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllWalletes(true);
        }

        $scope.init();

    }

})();