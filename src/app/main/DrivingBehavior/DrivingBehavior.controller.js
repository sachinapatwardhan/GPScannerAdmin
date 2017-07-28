(function() {
    'use strict';

    angular
        .module('app.DrivingBehavior')
        .controller('DrivingBehaviorController', DrivingBehaviorController);

    /** @ngInject */
    function DrivingBehaviorController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;

        $scope.init = function() {
            $scope.ModelSearch = {
                DeviceId: '',
                StartDate: '',
                EndDate: '',
            }
            $scope.Search = "";
            $scope.GetAllGpsDevice();

        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllDrivingData(true);
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



        //GetDevice

        $scope.GetAllGpsDevice = function() {
            $http.get($rootScope.RoutePath + "gpsdata/GetAllGpsDevice").then(function(resdata) {
                if (resdata.data.length > 0) {
                    $scope.lstdevice = resdata.data;
                } else {
                    $scope.lstdevice = [];
                }

            })
        }

        //Dynamic Pagging

        $scope.FilterStatus = 1;
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('DeviceId'),
            DTColumnBuilder.newColumn('Datetime').renderWith(Datetimefun),
            DTColumnBuilder.newColumn('TotalIgnition'),
            DTColumnBuilder.newColumn('TotalDrivingTime'),
            DTColumnBuilder.newColumn('TotalIdlingTime'),
            DTColumnBuilder.newColumn('AverageHotStartTime'),
            DTColumnBuilder.newColumn('AverageSpeed'),
            DTColumnBuilder.newColumn('HistoryHighestSpeed'),
            DTColumnBuilder.newColumn('HistoryHighestRotation'),
            DTColumnBuilder.newColumn('TotalHarshAcceleration'),
            DTColumnBuilder.newColumn('TotalHarshBrake'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "canbusdata/GetAllDrivingBehavior",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    d.DeviceId = $scope.ModelSearch.DeviceId;
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
            .withOption('aaSorting', [0, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllDrivingData = function(IsUpdate) {
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
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return '';
            }
        }

        function Datetimefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                var selectedTime = new Date(data * 1000);
                return moment(moment.utc(selectedTime).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return '';
            }
        }

        function IsFlg(data, type, full, meta) {
            var Flg;
            if (data == true || data == 'true' || data == 1) {
                Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
            } else {
                Flg = '<i class="icon-cancel red-500-fg"></i>';
            }

            return Flg;

        }

        $scope.SearchReset = function() {
            $scope.ModelSearch = {
                DeviceId: '',
                StartDate: '',
                EndDate: '',
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllDrivingData(true);
        }

        //Dynamic Pagging End
        $scope.Export = function() {
            window.location.href = $rootScope.RoutePath + "canbusdata/ExportAllDrivingData?DeviceId=" + $scope.ModelSearch.DeviceId + "&StartDate=" + $scope.ModelSearch.StartDate + "&EndDate=" + $scope.ModelSearch.EndDate;

        }

        $scope.init();
    }

})();