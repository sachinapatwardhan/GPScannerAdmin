(function() {
    'use strict';

    angular
        .module('app.gps')
        .controller('GpsController', GpsController);

    /** @ngInject */
    function GpsController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            var StartDate = new Date();
            StartDate.setHours(0);
            StartDate.setMinutes(0);
            StartDate.setSeconds(0);

            var EndDate = new Date();
            EndDate.setHours(23);
            EndDate.setMinutes(59);
            EndDate.setSeconds(59);

            $scope.ModelSearch = {
                DeviceId: '',
                StartDate: StartDate,
                EndDate: EndDate,
            }
            $scope.Search = "";
            $scope.searchDevice = "";
            // $scope.GetAllGpsDevice();

        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllGpsData(true);
        }
        $scope.clearSearchTerm = function() {
            $scope.searchDevice = "";
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
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
        $(function() {
            $(".showBtn").toggleClass("active");
            $(".ShowContentBox").slideToggle();
        });



        //GetDevice

        $scope.GetAllGpsDevice = function() {
            $http.get($rootScope.RoutePath + "gpsdata/GetAllGpsDevice?idApp=" + $rootScope.appId).then(function(resdata) {
                if (resdata.data.length > 0) {
                    $scope.lstdevice = resdata.data;
                } else {
                    $scope.lstdevice = [];
                }

            })
        }

        //Dynamic Pagging

        $scope.FilterStatus = 1;
        if ($rootScope.AppName == 'Tracking') {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Date').renderWith(Datetimefun),
                DTColumnBuilder.newColumn('Latitude'),
                DTColumnBuilder.newColumn('Longitude'),
                DTColumnBuilder.newColumn('GPSPositioning'),
                DTColumnBuilder.newColumn('Speed'),
                DTColumnBuilder.newColumn('Direction'),
                DTColumnBuilder.newColumn('IsEngine').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('AD2').renderWith(voltageCalc),
                // DTColumnBuilder.newColumn('OdoMeter'),
                // DTColumnBuilder.newColumn('AD1'),
                // DTColumnBuilder.newColumn('AD2'),
                DTColumnBuilder.newColumn('Altitude'),
                DTColumnBuilder.newColumn('Status'),
                // DTColumnBuilder.newColumn('IsRelayToStopTheCar').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('IsSirenSound').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('IsLockTheDoor').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('IsUnlockTheDoor').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('IsSOS').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('IsDoor').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
            ]
        } else {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('Date').renderWith(Datetimefun),
                DTColumnBuilder.newColumn('Latitude'),
                DTColumnBuilder.newColumn('Longitude'),
                DTColumnBuilder.newColumn('GPSPositioning'),
                DTColumnBuilder.newColumn('Speed'),
                DTColumnBuilder.newColumn('Direction'),
                DTColumnBuilder.newColumn('IsEngine').renderWith(IsFlg),
                DTColumnBuilder.newColumn('AD2').renderWith(voltageCalc),
                DTColumnBuilder.newColumn('OdoMeter'),
                DTColumnBuilder.newColumn('AD1'),
                DTColumnBuilder.newColumn('AD2'),
                DTColumnBuilder.newColumn('Altitude'),
                DTColumnBuilder.newColumn('Status'),
                DTColumnBuilder.newColumn('IsRelayToStopTheCar').renderWith(IsFlg),
                DTColumnBuilder.newColumn('IsSirenSound').renderWith(IsFlg),
                DTColumnBuilder.newColumn('IsLockTheDoor').renderWith(IsFlg),
                DTColumnBuilder.newColumn('IsUnlockTheDoor').renderWith(IsFlg),
                DTColumnBuilder.newColumn('IsSOS').renderWith(IsFlg),
                DTColumnBuilder.newColumn('IsDoor').renderWith(IsFlg),
                // DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
            ]
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "gpsdata/GetAllGpsDataNew",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    d.DeviceId = $scope.ModelSearch.DeviceId == 'All' ? '' : $scope.ModelSearch.DeviceId;
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
                    d.idApp = $rootScope.appId;
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.AppName = $rootScope.AppName;
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
            .withOption('aaSorting', [2, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllGpsData = function(IsUpdate) {
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
                var newdate = data * 1000;
                return moment(moment.utc(newdate).toDate()).format("DD/MM/YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        function voltageCalc(data) {
            var Voltage = '';
            if (data != null & data != '' && data != undefined) {
                Voltage = Math.round((parseInt(data, 16) * 6 / 1024) * 100) / 100;
            }
            return Voltage;
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
            var StartDate = new Date();
            StartDate.setHours(0);
            StartDate.setMinutes(0);
            StartDate.setSeconds(0);

            var EndDate = new Date();
            EndDate.setHours(23);
            EndDate.setMinutes(59);
            EndDate.setSeconds(59);

            $scope.ModelSearch = {
                DeviceId: '',
                StartDate: StartDate,
                EndDate: EndDate,
            }
            $scope.Search = "";
            $scope.formGPS.$setUntouched();
            $scope.formGPS.$setPristine();
            // $("#gps").DataTable().destroy();
            $('#gps').dataTable()._fnPageChange(0);
            $('#gps').dataTable()._fnAjaxUpdate();
            // $("#gps").remove();
            $('#modelsearch').val("");
            // $scope.GetAllGpsData(true);
        }

        //Dynamic Pagging End
        $scope.Export = function() {
            var AppName = '';
            if ($rootScope.UserRoles == 'Super Admin') {
                AppName = $rootScope.AppName;
            }
            window.location.href = $rootScope.RoutePath + "gpsdata/ExportAllGpsDataNew?DeviceId=" + $scope.ModelSearch.DeviceId + "&StartDate=" + $scope.ModelSearch.StartDate + "&EndDate=" + $scope.ModelSearch.EndDate + "&TimeZone=" + $rootScope.CurrentTimeZone + "&AppName=" + AppName;

        }

        $scope.init();
    }

})();