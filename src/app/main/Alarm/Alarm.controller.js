(function() {
    'use strict';

    angular
        .module('app.alarm')
        .controller('AlarmController', AlarmController);

    /** @ngInject */
    function AlarmController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $element) {
        var vm = this;
        $scope.ResponseAlarm = [];
        $scope.init = function() {
            $scope.ModelSearch = {
                DeviceId: 'All',
                StartDate: '',
                EndDate: '',
                AlarmCode: 'All',
            }
            $scope.Search = "";
            $scope.searchAlarm = "";
            $scope.searchDevice = "";
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $scope.GetAllGpsDevice();
            AlarmCode();
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllAlarm(true);
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
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('Date').renderWith(Datetimefun),
            DTColumnBuilder.newColumn('AlarmCode').renderWith(CodeFun),
            DTColumnBuilder.newColumn('DeviceId'),
            DTColumnBuilder.newColumn('Latitude'),
            DTColumnBuilder.newColumn('Longitude'),
            DTColumnBuilder.newColumn('GPSPositioning'),
            DTColumnBuilder.newColumn('Status'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "gpsdata/GetAllAlarmNew",
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
                    d.AlarmCode = $scope.ModelSearch.AlarmCode == 'All' ? '' : $scope.ModelSearch.AlarmCode;
                    d.idApp = $rootScope.appId;
                    d.AppName = $rootScope.AppName;
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
            .withOption('aaSorting', [1, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllAlarm = function(IsUpdate) {
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
                
                return moment(data).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }

        function Datetimefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                var newdate = data * 1000;
                return moment(moment.utc(newdate).toDate()).format("DD-MM-YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        function CodeFun(data, type, full, meta) {
            var code = '';
            if (data != '' && data != undefined && data != null) {
                var List = _.findWhere($scope.ResponseAlarm, { AlarmCode: data });
                if (List != null && List != undefined && List != '') {
                    if (data == '66' || data == '6') {
                        code = full.FenceName + " " + List.Alarm;
                    } else {
                        code = List.Alarm;
                    }
                }
            }

            return code;

        }


        $scope.SearchReset = function() {
            $scope.ModelSearch = {
                DeviceId: 'All',
                StartDate: '',
                EndDate: '',
                AlarmCode: 'All',
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllAlarm(true);
        }

        //search dropdownclear
        $scope.clearSearchTerm = function() {
            $scope.searchAlarm = "";
            $scope.searchDevice = "";
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        //Dynamic Pagging End

        $scope.Export = function() {
            console.log($scope.ModelSearch.EndDate)
            var StartDate = '';
            var EndDate = '';
            if ($scope.ModelSearch.EndDate != '') {
                EndDate = $scope.ModelSearch.EndDate.toUTCString()
            }
            if ($scope.ModelSearch.StartDate != '') {
                StartDate = $scope.ModelSearch.StartDate.toUTCString()
            }
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            window.location.href = $rootScope.RoutePath + "gpsdata/ExportAlarm?DeviceId=" + $scope.ModelSearch.DeviceId + "&StartDate=" + StartDate + "&EndDate=" + EndDate + "&AlarmCode=" + $scope.ModelSearch.AlarmCode + "&idApp=" + $rootScope.appId + "&TimeZone=" + $rootScope.CurrentTimeZone + "&CurrentOffset=" + CurrentOffset;

        }

        function AlarmCode() {
            $scope.ResponseAlarm = [];
            var obj = new Object();
            obj.AlarmCode = "01";
            obj.Alarm = "SOS alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "02";
            obj.Alarm = "Line broken alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "03";
            obj.Alarm = "Door open alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "04";
            obj.Alarm = "Engine on alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "05";
            obj.Alarm = "Original triggering alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "10";
            obj.Alarm = "Law battery alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "11";
            obj.Alarm = "Over speed alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "12";
            obj.Alarm = "Movment alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "13";
            obj.Alarm = "Geo-fence alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "30";
            obj.Alarm = "Vibration alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "50";
            obj.Alarm = "External power cut alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "52";
            obj.Alarm = "Veer report";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "60";
            obj.Alarm = "Fatigue driving alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "71";
            obj.Alarm = "Crash alarm(Harsh brake)";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "71";
            obj.Alarm = "Acceleration alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "81";
            obj.Alarm = "Fuel loss alarm";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "66";
            obj.Alarm = "Fence OUT";
            $scope.ResponseAlarm.push(obj);
            var obj = new Object();
            obj.AlarmCode = "6";
            obj.Alarm = "Fence IN";
            $scope.ResponseAlarm.push(obj);


        }
        $scope.init();
    }

})();