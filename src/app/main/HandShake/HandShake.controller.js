(function() {
    'use strict';

    angular
        .module('app.HandShake')
        .controller('HandShakeController', HandShakeController);

    /** @ngInject */
    function HandShakeController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        vm.dtInstanceGps = {};
        $scope.init = function() {
            var StartDate = new Date();
            StartDate.setHours(0);
            StartDate.setMinutes(0);
            StartDate.setSeconds(0);

            var EndDate = new Date();
            EndDate.setHours(23);
            EndDate.setMinutes(59);
            EndDate.setSeconds(59);

            $scope.modelDevice = {
                DeviceId: '',
                Command: '',
            }
            $scope.modelHandShake = {
                FromDate: StartDate,
                ToDate: EndDate,
                DeviceId: '',
            };
            $scope.modelSearch = {
                FromDate: '',
                ToDate: '',
                DeviceId: '',
            };
            $scope.flaglink = 1;
            $scope.Search = '';
            $scope.flag = false;
            // $scope.GetAllGpsDevice();
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
        }

        $scope.GetAllGpsDevice = function() {
            $http.get($rootScope.RoutePath + "gpsdata/GetAllGpsDevice?idApp=" + $rootScope.appId).then(function(resdata) {
                if (resdata.data.length > 0) {
                    $scope.lstdevice = resdata.data;
                } else {
                    $scope.lstdevice = [];
                }
            })
        }

        //-----------------------------------------------------  Device Logs -----------------------------------------------------------------//


        $scope.lstDevice = [];
        var socket = io($rootScope.Socket_URL);

        socket.on('emit_from_server', function(msg) {
            $scope.$apply(function() {
                var obj = new Object();
                obj.Datetime = new Date();
                obj.Device = msg.substring(1, 13);
                obj.Command = msg.substring(13, 17);
                obj.Values = msg.substring(17, msg.length - 1);
                obj.Type = 'Server';
                $scope.lstDevice.unshift(obj);
                $scope.SearchDeviceLogs();
            });
        });


        socket.on('emit_from_client', function(msg) {
            $scope.$apply(function() {
                var obj123 = new Object();
                obj123.Datetime = new Date();
                obj123.Device = msg.substring(1, 13);
                obj123.Command = msg.substring(13, 17);
                obj123.Values = msg.substring(17, msg.length - 1);
                obj123.Type = 'Client';
                $scope.lstDevice.unshift(obj123);
                $scope.SearchDeviceLogs();
            });
        });

        $scope.$on('$stateChangeStart', function() {
            socket.disconnect();
        });

        $scope.SearchDeviceLogs = function() {
            if ($scope.modelDevice.DeviceId != '' && $scope.modelDevice.Command != '') {
                $scope.lstDevice1 = _.filter($scope.lstDevice, function(item) {
                    return (item.Command.indexOf($scope.modelDevice.Command) >= 0 || item.Command.toLowerCase().indexOf($scope.modelDevice.Command.toLowerCase()) >= 0) && (item.Device.toLowerCase().indexOf($scope.modelDevice.DeviceId.toLowerCase()) >= 0 || item.Device.indexOf($scope.modelDevice.DeviceId) >= 0);
                });
            } else if ($scope.modelDevice.DeviceId != '') {
                $scope.lstDevice1 = _.filter($scope.lstDevice, function(item) {
                    return item.Device.indexOf($scope.modelDevice.DeviceId) >= 0 || item.Device.toLowerCase().indexOf($scope.modelDevice.DeviceId.toLowerCase()) >= 0;
                });
            } else if ($scope.modelDevice.Command != '') {
                $scope.lstDevice1 = _.filter($scope.lstDevice, function(item) {
                    return item.Command.indexOf($scope.modelDevice.Command) >= 0 || item.Command.toLowerCase().indexOf($scope.modelDevice.Command.toLowerCase()) >= 0;
                });
            } else {
                $scope.lstDevice1 = $scope.lstDevice;
            }
        }

        vm.dtOptionsDevice = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(25)
            .withOption('lengthMenu', [25, 50, 100])
            .withOption('responsive', true)
            .withOption('autoWidth', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            .withOption('scrollY', 'auto')
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            // .withDOM('rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>');
        vm.dtInstanceDevice = {};

        //-----------------------------------------------------  HandShake Logs -----------------------------------------------------------------//

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = '';

            $scope.dtColumnsHandShake = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable().withOption('width', '5%'),
                DTColumnBuilder.newColumn('Datetime').renderWith(dateFormat),
                DTColumnBuilder.newColumn('DeviceId').renderWith(DeviceIdHtml),
                // DTColumnBuilder.newColumn('Power'),
                // DTColumnBuilder.newColumn('Charging'),
            ]

            $scope.dtOptionsHandShake = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "settings/GetAllDynamickHandshakeNew",
                data: function(d) {
                    if ($scope.Search == '' || $scope.Search == undefined || $scope.Search == null) {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                        // d.start = 0;
                    }
                    d.DeviceId = $scope.modelHandShake.DeviceId == 'All' ? '' : $scope.modelHandShake.DeviceId;
                    if ($scope.modelHandShake.FromDate != '') {
                        d.fromdate = $scope.modelHandShake.FromDate.toUTCString();
                    } else {
                        d.fromdate = ''
                    }
                    if ($scope.modelHandShake.ToDate != '') {
                        d.todate = $scope.modelHandShake.ToDate.toUTCString();
                    } else {
                        d.todate = ''
                    }

                    // if ($scope.modelHandShake.DeviceId != '' && $scope.modelHandShake.DeviceId != null) {
                    //     d.DeviceId = $scope.modelHandShake.DeviceId;
                    // }
                    d.idApp = $rootScope.appId;
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.AppName = $rootScope.AppName;
                    }
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        $scope.lstVehicledata = json.data;
                        $scope.lstTotal = json.recordsTotal;
                        return json.data;
                    } else {
                        return [];
                        $scope.lstTotal = 0;
                    }
                },
            })


            .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(100) // Page size
                .withOption('aaSorting', [1, 'desc'])
                .withOption('responsive', true)
                .withOption('createdRow', createdRow)
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        vm.dtInstanceHandshake = {};

        function callback(json) {}

        $scope.GetAllDynamicHandShake = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            vm.dtInstanceHandshake.reloadData(callback, resetPaging);
            $('#HandShakeLog').dataTable()._fnPageChange(0);
            $('#HandShakeLog').dataTable()._fnAjaxUpdate();
        }

        $scope.reloadData = function() {}

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function DeviceIdHtml(data, type, full, meta) {
            if (data != null && data != '') {
                return data;
            } else {
                return "N/A";
            }
        }

        function dateFormat(data, type, full, meta) {
            if (data != null && data != '') {
                // return $rootScope.convertdateformat(data, 1);
                return moment(data).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return "";
            }

        }

        //---------------------------------------------------------- GPS Logs _--------------------------------------------------------------//

        // $scope.dtColumnsGps = [
        //     DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
        //     DTColumnBuilder.newColumn('DeviceId'),
        //     DTColumnBuilder.newColumn('Date').renderWith(Datetimefun),
        //     DTColumnBuilder.newColumn('Latitude'),
        //     DTColumnBuilder.newColumn('Longitude'),
        //     DTColumnBuilder.newColumn('Speed'),
        //     DTColumnBuilder.newColumn('Direction'),
        //     DTColumnBuilder.newColumn('Status'),
        //     DTColumnBuilder.newColumn('IsEngine').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsRelayToStopTheCar').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsSirenSound').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsLockTheDoor').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsUnlockTheDoor').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsSOS').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('IsDoor').renderWith(IsFlg),
        //     DTColumnBuilder.newColumn('GPSPositioning'),
        //     DTColumnBuilder.newColumn('Altitude'),
        //     DTColumnBuilder.newColumn('AD1'),
        //     DTColumnBuilder.newColumn('AD2'),
        //     DTColumnBuilder.newColumn('OdoMeter'),
        // ]

        // $scope.dtOptionsGps = DTOptionsBuilder.newOptions().withOption('ajax', {
        //         url: $rootScope.RoutePath + "gpsdata/GetAllGpsData",
        //         data: function(d) {
        //             if ($scope.Search != "") {
        //                 d.search = $scope.Search;
        //             } else {
        //                 d.search = "";
        //             }
        //             d.DeviceId = $scope.modelSearch.DeviceId == 'All' ? '' : $scope.modelSearch.DeviceId;
        //             if ($scope.modelSearch.FromDate != '') {
        //                 d.StartDate = $scope.modelSearch.FromDate.toUTCString();
        //             } else {
        //                 d.StartDate = ''
        //             }
        //             if ($scope.modelSearch.ToDate != '') {
        //                 d.EndDate = $scope.modelSearch.ToDate.toUTCString();
        //             } else {
        //                 d.EndDate = ''
        //             }
        //             return d;
        //         },
        //         type: "get",
        //         dataSrc: function(json) {
        //             if (json.success != false) {

        //                 $scope.lstdata = json.data;
        //                 return json.data;
        //             } else {
        //                 return [];
        //             }
        //         },
        //     })
        //     .withOption('processing', true) //for show progress bar
        //     .withOption('serverSide', true) // for server side processing
        //     .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        //     .withDisplayLength(25) // Page size
        //     .withOption('aaSorting', [2, 'desc'])
        //     .withOption('responsive', true)
        //     .withOption('createdRow', createdRow)
        //     //.withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
        //     .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
        //     .withOption('scrollY', 'auto');


        // function GetAllGpsData(IsUpdate) {
        //     var resetPaging = false;
        //     if (IsUpdate == true) {
        //         resetPaging = true;
        //     };
        //     vm.dtInstanceGps.reloadData(callback, resetPaging);
        //     $('#GPSLogs').dataTable()._fnAjaxUpdate();
        // }

        // function Datetimefun(data, type, full, meta) {
        //     if (data != '' && data != null && data != undefined) {
        //         var newdate = data * 1000;
        //         return moment(moment.utc(newdate).toDate()).format("DD-MM-YYYY hh:mm A");
        //     } else {
        //         return '';
        //     }
        // }

        // function IsFlg(data, type, full, meta) {
        //     var Flg;
        //     if (data == true || data == 'true' || data == 1) {
        //         Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
        //     } else {
        //         Flg = '<i class="icon-cancel red-500-fg"></i>';
        //     }

        //     return Flg;

        // }

        // function Datefun(data, type, full, meta) {
        //     if (data != '' && data != null && data != undefined) {
        //         // return $filter('date')(data, "dd-MM-yyyy");
        //         return moment(moment.utc(data).toDate()).format("DD-MM-YYYY hh:mm A");
        //     } else {
        //         return '';
        //     }
        // }
        $scope.SearchReset = function() {
                var StartDate = new Date();
                StartDate.setHours(0);
                StartDate.setMinutes(0);
                StartDate.setSeconds(0);

                var EndDate = new Date();
                EndDate.setHours(23);
                EndDate.setMinutes(59);
                EndDate.setSeconds(59);

                $scope.modelHandShake = {
                    FromDate: StartDate,
                    ToDate: EndDate,
                    DeviceId: '',
                };
                $scope.Search = "";
                $scope.flag = false;
                $scope.flaglink = 1;
                $scope.formHandShake.$setUntouched();
                $scope.formHandShake.$setPristine();
                // $("#gps").DataTable().destroy();
                $('#HandShakeLog').dataTable()._fnPageChange(0);
                $('#HandShakeLog').dataTable()._fnAjaxUpdate();
                // $("#gps").remove();
                $('#modelsearch').val("");
                // $scope.GetAllGpsData(true);
            }
            // $scope.ResetTab = function() {
            //     $scope.modelDevice = {
            //         DeviceId: '',
            //         Command: '',
            //     }
            //     $scope.flag = false;
            //     $scope.flaglink = 1;
            // }

        // $scope.ResetModel1 = function() {
        //     $scope.modelHandShake = {
        //         FromDate: '',
        //         ToDate: '',
        //         DeviceId: '',
        //     };
        //     $scope.flag = false;
        //     $scope.flaglink = 1;
        //     $scope.formHandShake.$setUntouched();
        //     $scope.formHandShake.$setPristine();
        // }

        // $scope.ResetModel2 = function() {
        //     $scope.modelSearch = {
        //         FromDate: '',
        //         ToDate: '',
        //         DeviceId: '',
        //     };
        //     $scope.flag = false;
        //     $scope.flaglink = 2;
        // }

        // $scope.ResetSearch = function() {
        //     if ($scope.flaglink == 1) {
        //         $scope.ResetModel1();
        //         $('#HandShakeLog').dataTable()._fnPageChange(0);
        //         $('#HandShakeLog').dataTable()._fnAjaxUpdate();
        //         // $("#HandShakeLog").remove();
        //         // GetAllDynamicHandShake(true);
        //     } else if ($scope.flaglink == 2) {
        //         $scope.ResetModel2();
        //         GetAllGpsData(true);
        //     }
        // }

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

        $scope.GetSearch = function(Search) {
            $scope.Search = Search;
            if ($scope.flaglink == 0) {
                console.log("!...............0")
                vm.dtInstanceDevice.DataTable.search(Search);
                vm.dtInstanceDevice.DataTable.search(Search).draw();
            } else if ($scope.flaglink == 1) {
                console.log("!...............1")
                $scope.GetAllDynamicHandShake(true);
            } else if ($scope.flaglink == 2) {
                console.log("!...............2")
                GetAllGpsData(true);
            }
        }

        $scope.clearSearchTerm = function() {
            $scope.searchDevice = "";
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.init();
    }

})();