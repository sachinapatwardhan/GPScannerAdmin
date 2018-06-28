(function() {
    'use strict';

    angular
        .module('app.userfeedback')
        .controller('UserFeedbackController', UserFeedbackController);

    /** @ngInject */
    function UserFeedbackController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        $scope.init = function() {

        }

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('email'),
            DTColumnBuilder.newColumn('phone'),
            DTColumnBuilder.newColumn('AppsUserFriendly'),
            DTColumnBuilder.newColumn('GPSAccuracy'),
            DTColumnBuilder.newColumn('TrackLocLiverate'),
            DTColumnBuilder.newColumn('TrackLocHistory'),
            DTColumnBuilder.newColumn('Notificaton'),
            DTColumnBuilder.newColumn('DisplayCreatedDate').renderWith(Datefun)
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "feedback/GetAllFeedback",
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
            .withDisplayLength(25) // Page size
            .withOption('aaSorting', [8, 'desc'])
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