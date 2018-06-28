(function() {
    'use strict';

    angular
        .module('app.deviceaccvalue')
        .controller('DeviceAccValueController', DeviceAccValueController);

    /** @ngInject */
    function DeviceAccValueController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
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
                DeviceId: 'All',
                IsACCValueSet: 'All',
                StartDate: StartDate,
                EndDate: EndDate,
            }
            $scope.Search = "";
            $scope.searchDevice = "";
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $rootScope.UserRoles = $cookieStore.get('UserRoles');
            $scope.GetAllGpsDevice();
        }

        $scope.GetSerch = function(Search) {
                $scope.Search = Search;
                $scope.GetAllDeviceAccValue(true);
            }
            //search dropdownclear
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
            DTColumnBuilder.newColumn('DeviceId'),
            DTColumnBuilder.newColumn('IsACCValueSet').renderWith(IsFlg).withOption('class', 'text-center'), ,
            DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun).notSortable(),
            DTColumnBuilder.newColumn('ACCValueSetTime').renderWith(Datefun).notSortable(),
        ]

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "deviceacc/GetAllDeviceAccValue",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    d.DeviceId = $scope.ModelSearch.DeviceId == 'All' ? '' : $scope.ModelSearch.DeviceId;
                    if ($scope.ModelSearch.StartDate != '') {
                        d.StartDate = moment($scope.ModelSearch.StartDate).format('YYYY-MM-DD HH:mm:ss a');
                    } else {
                        d.StartDate = ''
                    }
                    if ($scope.ModelSearch.EndDate != '') {
                        d.EndDate = moment($scope.ModelSearch.EndDate).format('YYYY-MM-DD HH:mm:ss a');
                    } else {
                        d.EndDate = ''
                    }
                    d.idApp = $rootScope.appId;
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.AppName = $rootScope.AppName;
                    } else {
                        d.AppName = '';
                    }
                    d.IsACCValueSet = $scope.ModelSearch.IsACCValueSet == 'All' ? null : $scope.ModelSearch.IsACCValueSet;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    console.log(json)
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
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        $scope.dtInstance = {};


        //Reload GetAllDeviceAccValue
        $scope.GetAllDeviceAccValue = function(IsUpdate) {
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
                DeviceId: 'All',
                StartDate: StartDate,
                EndDate: EndDate,
                IsACCValueSet: 'All',
            }
            $scope.Search = "";
            $('#modelsearch').val("");
            $scope.GetAllDeviceAccValue(true);
        }

        //Dynamic Pagging End


        $scope.init();
    }

})();