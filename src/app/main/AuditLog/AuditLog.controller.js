(function () {
    'use strict';

    angular
        .module('app.AuditLog')
        .controller('AuditLogController', AuditLogController);

    /** @ngInject */
    function AuditLogController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        $scope.init = function () {

            var StartDate = new Date();
            StartDate.setHours(0);
            StartDate.setMinutes(0);
            StartDate.setSeconds(0);

            var EndDate = new Date();
            EndDate.setHours(23);
            EndDate.setMinutes(59);
            EndDate.setSeconds(59);
            $scope.ModelSearch = {
                StartDate: StartDate,
                EndDate: EndDate,
            }

        }

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('type'),
            DTColumnBuilder.newColumn('createdby'),
            DTColumnBuilder.newColumn('createddate').renderWith(Datefun), ,
            DTColumnBuilder.newColumn('message')
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            url: $rootScope.RoutePath + "auditlog/GetAllAditlog",
            data: function (d) {
                if ($scope.Search != "") {
                    d.search = $scope.Search;
                } else {
                    d.search = "";
                }
                if ($scope.ModelSearch.StartDate != '') {
                    d.StartDate = $scope.ModelSearch.StartDate.toUTCString();
                } else {
                    d.StartDate = ''
                }
                if ($scope.ModelSearch.EndDate != '') {
                    d.EndDate = $scope.ModelSearch.EndDate.toUTCString();
                } else {
                    d.EndDate = ''
                }
                return d;
            },
            type: "get",
            dataSrc: function (json) {
                if (json.success != false) {
                    $scope.$apply(function () {
                        $scope.lstdata = json.data;
                        $scope.Totallog = json.recordsTotal;
                    })
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
            .withOption('aaSorting', [3, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllAuditLog = function (IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
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

        function Datefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                // return $filter('date')(data, "dd-MM-yyyy");
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        function Datetimefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                var newdate = data * 1000;
                return moment(moment.utc(newdate).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return '';
            }
        }

        $scope.GetSerch = function (Search) {
            $scope.Search = Search;
            $scope.GetAllAuditLog(true);
        }
        $scope.SearchReset = function () {
            $scope.ModelSearch = {
                DeviceId: 'All',
                StartDate: '',
                EndDate: '',
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllGpsData(true);
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

        $scope.SearchReset = function () {
            var StartDate = new Date();
            StartDate.setHours(0);
            StartDate.setMinutes(0);
            StartDate.setSeconds(0);

            var EndDate = new Date();
            EndDate.setHours(23);
            EndDate.setMinutes(59);
            EndDate.setSeconds(59);
            $scope.ModelSearch = {
                StartDate: StartDate,
                EndDate: EndDate,
            }
            $scope.GetAllAuditLog(true);
        }



        $scope.init();
    }

})();