(function() {
    'use strict';

    angular
        .module('app.CanBusData')
        .controller('CanBusDataController', CanBusDataController);

    /** @ngInject */
    function CanBusDataController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

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
            $scope.GetAllCanbusData(true);
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
            DTColumnBuilder.newColumn('Datetime').renderWith(Datefun),
            DTColumnBuilder.newColumn('BatteryVoltage'),
            DTColumnBuilder.newColumn('EngineSpeed'),
            DTColumnBuilder.newColumn('RunningSpeed'),
            DTColumnBuilder.newColumn('CoolantTemperature'),
            DTColumnBuilder.newColumn('ThrottleOpeningWidth'),
            DTColumnBuilder.newColumn('EngineLoad'),
            DTColumnBuilder.newColumn('InstantaneousFuelConsumption'),
            DTColumnBuilder.newColumn('AverageFuelConsumption'),
            DTColumnBuilder.newColumn('DrivingRange'),
            DTColumnBuilder.newColumn('TotalMileage'),
            DTColumnBuilder.newColumn('SingleFuelConsumptionVolume'),
            DTColumnBuilder.newColumn('TotalFuelConsumptionVolume'),
            DTColumnBuilder.newColumn('CurrentErrorCodeNumbers'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
            DTColumnBuilder.newColumn('HarshAccelerationNo'),
            DTColumnBuilder.newColumn('HarshBrakeNo'),
            // DTColumnBuilder.newColumn('IsLockTheDoor').renderWith(IsFlg),
            // DTColumnBuilder.newColumn('IsUnlockTheDoor').renderWith(IsFlg),
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "canbusdata/GetAllCanbusData",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    d.DeviceId = $scope.ModelSearch.DeviceId;
                    d.StartDate = $scope.ModelSearch.StartDate;
                    d.EndDate = $scope.ModelSearch.EndDate;
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
        $scope.GetAllCanbusData = function(IsUpdate) {
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
                return $filter('date')(data, "dd-MM-yyyy");
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
            $scope.GetAllCanbusData(true);
        }

        //Dynamic Pagging End
        $scope.Export = function() {
            window.location.href = $rootScope.RoutePath + "canbusdata/ExportAllCanbusData?DeviceId=" + $scope.ModelSearch.DeviceId + "&StartDate=" + $scope.ModelSearch.StartDate + "&EndDate=" + $scope.ModelSearch.EndDate;

        }

        $scope.init();
    }

})();