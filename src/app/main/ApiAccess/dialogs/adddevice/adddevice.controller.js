(function() {
    'use strict';

    angular
        .module('app.apiaccess')
        .controller('devicemodelController', devicemodelController);

    /** @ngInject */
    function devicemodelController($http, $mdDialog, $mdToast, $scope, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $rootScope, $compile, VM, AppName, event, apiaccessid) {
        var vm = this;

        $scope.init = function() {}

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).renderWith(numberHtml).notSortable().withOption('class', 'text-center').withOption('width', '3%'),
            DTColumnBuilder.newColumn(null).renderWith(CheckboxHtml).notSortable().withOption('class', 'text-center').withOption('width', '1%'),
            DTColumnBuilder.newColumn('DeviceId').notSortable().withOption('class', 'text-center').withOption('width', '3%'),
        ]
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(req, res) {
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "apiaccess/getAllDeviceFromAppName",
                    data: function(d) {
                        d.search = $scope.Search;
                        d.deviceid = $scope.DeviceId;
                        d.AppName = AppName;
                        d.APIAccessId = apiaccessid;
                        console.log(d)
                        return d
                    },
                    type: 'get',
                    dataSrc: (function(json) {
                        $scope.lstdevicelist = json.data;
                        return json.data;
                    })
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('simple')
                .withDisplayLength(25)
                .withOption('aaSorting', [2, 'asc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto')
        })
        $scope.dtInstance = {};
        //Reload Datatable
        $scope.GetAllDeviceList = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };

            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#devicelist').dataTable()._fnPageChange(0);
            $('#devicelist').dataTable()._fnAjaxUpdate();

        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function numberHtml(type, data, full, meta) {
            return (meta.row + 1)
        }

        $scope.devices = {};

        function CheckboxHtml(data, type, full, meta) {
            if (full.tblapiaccessclient.DeviceId != null) {
                var deviceID = full.tblapiaccessclient.DeviceId.split(',');
                var index = deviceID.indexOf(full.DeviceId)
                if (index > -1) {
                    $scope.devices[full.DeviceId] = true;
                } else {
                    $scope.devices[full.DeviceId] = false;
                }
            }
            var btn = "<div layout='row' >";
            btn += '<md-checkbox style="text-align : center" aria-label="assign" ng-model="devices[' + full.DeviceId + ']" ng-change="giveAccess(' + full.DeviceId + ')"></md-checkbox>';
            btn += '</div>';
            return btn;

        }

        $scope.giveAccess = function(DeviceId) {
            var params = {
                id: apiaccessid,
                DeviceId: DeviceId,
            }
            console.log(params)
            $http.get($rootScope.RoutePath + "apiaccess/giveAccess", { params: params }).then(function(data) {
                console.log(data)
            })

        }

        $scope.clearSearchTerm = function() {
            $scope.searchtermDevice = '';
        }

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllDeviceList();
        }

        $scope.init();
    }
})();