(function() {
    'use strict';

    angular
        .module('app.VehicleLastUse')
        .controller('VehicleLastUseController', VehicleLastUseController);

    /** @ngInject */
    function VehicleLastUseController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        // vm.GetLastUseVehicle = getAllSIMInfo;
        $scope.init = function() {
            $scope.GetLastUseVehicle();
        }

        $scope.GetLastUseVehicle = function() {
            $http.get($rootScope.RoutePath + "vehicles/GetAllNotUseDevcie").then(function(data) {
                $scope.lstdata = data.data;
                for (var i = 0; i < $scope.lstdata.length; i++) {
                    var newdate = $scope.lstdata[i].Date * 1000;
                    // $scope.lstdata[i].Date = moment(moment.utc(newdate).toDate()).format("DD/MM/YYYY hh:mm:ss A");
                    var timeDiff = (new Date()).getTime() - (new Date($scope.lstdata[i].Date * 1000)).getTime();
                    var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                    $scope.lstdata[i].Days = diffDays + ' days';
                    $scope.lstdata[i].Date = moment(new Date($scope.lstdata[i].Date * 1000)).format('DD-MM-YYYY hh:mm:ss a');

                }
                $scope.lstdata = data.data;
            })
        }


        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(25)
            .withOption('responsive', true)
            // .withOption('autoWidth', true)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('deferRender', true)
            .withOption('paging', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto'),

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5),
                DTColumnDefBuilder.newColumnDef(6),
                DTColumnDefBuilder.newColumnDef(7),
                DTColumnDefBuilder.newColumnDef(8),
            ];
        $scope.dtInstance = {};
        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);
            $scope.dtInstance.DataTable.search(Search).draw();
        };


        $scope.init();
    }


})();