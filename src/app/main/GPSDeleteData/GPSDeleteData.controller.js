(function() {
    'use strict';

    angular
        .module('app.GPSDeleteData')
        .controller('GPSDeleteDataController', GPSDeleteDataController);

    /** @ngInject */
    function GPSDeleteDataController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        $scope.init = function() {

        }

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('username').renderWith(Displayfun),
            DTColumnBuilder.newColumn('Name').renderWith(Displayfun),
            DTColumnBuilder.newColumn('DeviceId').renderWith(Displayfun),
            DTColumnBuilder.newColumn('RequestType'),
            DTColumnBuilder.newColumn('Status').renderWith(Statusfan),
            DTColumnBuilder.newColumn('CreatedBy'),
            DTColumnBuilder.newColumn('DisplayCreatedDate').renderWith(Datefun),
            DTColumnBuilder.newColumn('DisplayModifiedDate').renderWith(Datefun),
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "auditlog/GetAllGPSDeleteData",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        $scope.lstdata = json.data;
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })
            .withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(100) // Page size
            .withOption('aaSorting', [6, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllAuditLog = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function Displayfun(data) {
            var value = 'N/A';
            if (data != '' && data != null && data != undefined) {
                value = data;
            }
            return value;
        }

        function Statusfan(data, type, full, meta) {
            var Status = data;
            if (data == 'Pending') {
                Status = '<span class="text-boxed m-0 orange-bg white-fg">' + data + '</span>'
            }
            if (data == 'Complete') {
                Status = '<span class="text-boxed m-0 green-bg white-fg">' + data + '</span>'
            }
            return Status;
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
                return moment(moment.utc(newdate).toDate()).format("DD/MM/YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllAuditLog(true);
        }
        $scope.SearchReset = function() {
            $scope.ModelSearch = {
                DeviceId: 'All',
                StartDate: '',
                EndDate: '',
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllGpsData(true);
        }



        $scope.init();
    }

})();