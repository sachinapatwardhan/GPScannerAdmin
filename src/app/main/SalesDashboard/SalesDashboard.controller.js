(function () {
    'use strict';

    angular
        .module('app.SalesDashboard')
        .controller('SalesDashboardController', SalesDashboardController);

    function SalesDashboardController($http, $scope, $compile, $mdDialog, $document, $mdToast, DTColumnBuilder, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout, $filter) {
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.appId = localStorage.getItem('appId');
        $scope.init = function () {

            $scope.GetTotallist();
            // $scope.getAllExpiredDevice();
            // $scope.getAllExpiredSoonDevice();
        }

        $scope.GetTotallist = function () {
            var params = {
                IdUser: $rootScope.UserId,
                AppName: $rootScope.AppName
            }
            $http.get($rootScope.RoutePath + "dashboard/SalesDashBoardData", { params: params }).then(function (data) {
                $scope.lstTotalsalesboard = data.data.data;
            });
        }

        // $scope.getAllExpiredDevice = function () {
        //     var params = {
        //         IdUser: $rootScope.UserId,
        //         AppName: $rootScope.AppName
        //     }
        //     $http.get($rootScope.RoutePath + "dashboard/getAllExpiredDevice", { params: params }).then(function (data) {
        //         $scope.lstExpiredDevice = data.data.data;
        //     });
        // }
        // $scope.getAllExpiredSoonDevice = function () {
        //     var params = {
        //         IdUser: $rootScope.UserId,
        //         AppName: $rootScope.AppName
        //     }
        //     $http.get($rootScope.RoutePath + "dashboard/getAllExpiredSoonDevice", { params: params }).then(function (data) {
        //         $scope.lstExpiredSoonDevice = data.data.data;
        //     });
        // }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(NumberHtml).notSortable().withOption('width', '2%').withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
            ]
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "dashboard/getAllExpiredDevice",
                data: function (d) {
                    d.search = "";
                    d.StartDate = '';

                    if (d.StartDate != null && d.StartDate != undefined && d.StartDate != '') {
                        d.StartDate.setHours(0);
                        d.StartDate.setMinutes(0);
                        d.StartDate.setSeconds(0);
                    }
                    d.EndDate = new Date();
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
                    // d.idDistributor = $scope.ModelSearch.idDistributor == "All" ? '' : $scope.ModelSearch.idDistributor;
                    // d.idCountry = $scope.ModelSearch.idCountry == "All" ? '' : $scope.ModelSearch.idCountry;
                    d.idSalesAgent = $rootScope.UserId;
                    $scope.columns = d.columns;
                    // $scope.order = d.order;
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    console.log(json)
                    if (json.success != false) {
                        $scope.lstExpiredSoon = json.data;
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [0, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
            // .withOption('initComplete', function () {
            //     $scope.AdjustColumn();
            // });

            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(NumberHtml).notSortable().withOption('width', '2%').withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
            ]
            $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "dashboard/getAllExpiredSoonDevice",
                data: function (d) {
                    d.search = "";

                    d.StartDate = new Date();

                    if (d.StartDate != null && d.StartDate != undefined && d.StartDate != '') {
                        d.StartDate.setHours(0);
                        d.StartDate.setMinutes(0);
                        d.StartDate.setSeconds(0);
                    }
                    var EndDate = new Date();
                    EndDate.setMonth(EndDate.getMonth() + 1);
                    d.EndDate = EndDate;
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
                    // d.idDistributor = $scope.ModelSearch.idDistributor == "All" ? '' : $scope.ModelSearch.idDistributor;
                    // d.idCountry = $scope.ModelSearch.idCountry == "All" ? '' : $scope.ModelSearch.idCountry;
                    d.idSalesAgent = $rootScope.UserId;
                    $scope.columns = d.columns;
                    // $scope.order = d.order;
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    console.log(json)
                    if (json.success != false) {
                        $scope.lstExpired = json.data;
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [0, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        })
        vm.dtInstance = {};
        vm.dtInstance1 = {};
        vm.resetTable = function () {
            vm.resetExpiredSoon(true);
            vm.resetExpired(true)
        }
        vm.resetExpiredSoon = function (IsUpdate) {
            console.log("1111")
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            vm.dtInstance1.reloadData(callback, resetPaging);
            $('#ExpiredSoon').dataTable()._fnPageChange(0);
            $('#ExpiredSoon').dataTable()._fnAjaxUpdate();
        }

        vm.resetExpired = function (IsUpdate) {
            console.log("111122")
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };

            vm.dtInstance.reloadData(callback, resetPaging);
            $('#Expired').dataTable()._fnPageChange(0);
            $('#Expired').dataTable()._fnAjaxUpdate();
        }

        $(window).resize(function () {
            $scope.AdjustColumn();
        });
        $scope.AdjustColumn = function () {
            if (vm.dtInstance) {
                vm.dtInstance.DataTable.columns.adjust();
            } else if (vm.dtInstance) {
                vm.dtInstance1.DataTable.columns.adjust();
            }
        }
        function dateFormat1(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return 'N/A';
            }
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
        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row" layout-align="center">'
            if (full.iduser != null && full.iduser != '') {
                var LastLoginDate = 'N/A';
                if (full.LastLoginDate != null && full.LastLoginDate != '') {
                    LastLoginDate = moment(full.LastLoginDate).format('DD-MM-YYYY hh:mm:ss a');
                }
                // btns += '<md-button class="edit-button md-icon-button"  ng-click="OpenRemark(' + full.id + ')" aria-label="">' +
                //     '<md-icon md-font-icon="icon-forward"  class="s18 blue-500-fg"></md-icon>' +
                //     '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                //     '</md-button>';
                if (full.DeviceStatus == 'Terminate') {
                    btns += '<span  style="background:#dd2c00;padding: 0px 2px 0px 2px;color: white">Terminated</span>';
                } else {
                    btns += '<span  style="background:#2196F3;padding: 0px 2px 0px 2px;color: white" ng-click="OpenRemark(' + full.Id + ')">Renew</span>';
                }
            }

            btns += '</div>'
            return btns;
        };

        $scope.OpenRemark = function (Id) {
            console.log("...", Id)
            var LastLoginDate = 'N/A';
            var obj = _.findWhere($scope.lstExpired, { Id: Id });
            if (obj == undefined) {
                obj = _.findWhere($scope.lstExpiredSoon, { Id: Id });
            }
            console.log(obj);
            // if (obj.LastLoginDate != null && obj.LastLoginDate != '') {
            //     LastLoginDate = moment(obj.LastLoginDate).format('DD-MM-YYYY hh:mm:ss a');
            // }
            $mdDialog.show({
                controller: 'RemarkController',
                controllerAs: 'vm',
                templateUrl: 'app/main/SalesDashboard/dialogs/OpenRemark/OpenRemark.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                    obj: obj,
                    Role: $rootScope.UserRoles,
                    MainVM: vm,
                }
            })
        }

        $scope.init();
    }
})();