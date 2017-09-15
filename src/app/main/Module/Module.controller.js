(function() {
    'use strict';

    angular
        .module('app.Module')
        .controller('ModuleController', ModuleController);


    /** @ngInject */
    function ModuleController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                Module: '',
                IsActive: '',
            };
            $scope.Search = '';
            $scope.GetAllModule();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetAllModule = function() {
            $http.get($rootScope.RoutePath + "module/GetAllModuleName").then(function(data) {
                $scope.lstModules = data.data;
                for (var i = 0; i < $scope.lstModules.length; i++) {
                    if ($scope.lstModules[i].IsActive == 1) {
                        $scope.lstModules[i].IsActive = true;
                    } else {
                        $scope.lstModules[i].IsActive = false;
                    }
                    $scope.lstModules.IsUpdate = false;
                };
            });
        }

        $scope.SaveModule = function(o) {
            $http.post($rootScope.RoutePath + "module/UpdateModule", o).then(function(data) {
                if (data.data.success == false) {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    }
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                o.IsUpdate = false;
            });
        }

        $scope.FetchmoduleById = function(o) {
            o.IsUpdate = true;
        }

        $scope.ResetEdit = function(o) {
            o.IsUpdate = false;
            $scope.GetAllModule();
        }


        $scope.Reset = function() {
            $scope.init();
        }


        //vm.dtOptions = DTOptionsBuilder.newOptions()
        //    .withPaginationType('full_numbers')
        //    .withDisplayLength(10)
        //    .withOption('responsive', true)
        //    .withOption('autoWidth', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //    .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');

        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(100)
            .withOption('responsive', true)
            // .withOption('autoWidth', true)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('deferRender', true)
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
                DTColumnDefBuilder.newColumnDef(3).notSortable(),
                //DTColumnDefBuilder.newColumnDef(2),
                //DTColumnDefBuilder.newColumnDef(3),
                //DTColumnDefBuilder.newColumnDef(4),
                // DTColumnDefBuilder.newColumnDef(5)
            ];
        $scope.dtInstance = {};

        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };
        $scope.init();
    }

})();