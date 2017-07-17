(function() {
    'use strict';

    angular
        .module('app.DeviceStatus')
        .controller('DeviceStatusController', DeviceStatusController);

    /** @ngInject */
    function DeviceStatusController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $cookieStore, $compile) {
        var vm = this;

        $scope.init = function() {
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.FilterStatus = 1;
        $scope.dtColumns1 = [
            DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
            DTColumnBuilder.newColumn('deviceid'),
            DTColumnBuilder.newColumn('IsOnline').renderWith(StatusHtml)
        ]

        $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "PetDevice/GetAllPetbyCountry",
                data: function(d) {
                    d.UserCountry = $rootScope.UserCountry;
                    d.UserRoles = $rootScope.UserRoles;
                    d.CountryList = $rootScope.CountryList;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.data.length > 0) {
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
            .withDisplayLength(10) // Page size
            .withOption('aaSorting', [0, 'desc'])
            .withOption('responsive', true)
            // .withOption('autoWidth', false)
            .withOption('createdRow', createdRow);

        $scope.dtInstance1 = {};


        //Reload Datatable
        $scope.GetAllPet = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance1.reloadData(callback, resetPaging);
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

        function StatusHtml(data, type, full, meta) {
            var str = '';
            if (data == true) {
                str = '<span  style="font-size: 20px;color: green"> &#x2714;</span>';
            } else {
                str = '<span style="font-size: 20px;color: red">&#x2716;</span>';
            }
            return str;
        }

        $scope.init();
    }

})();
