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
            $scope.GetAllModule();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetAllModule = function() {
            $http.get($rootScope.RoutePath + "module/GetAllModuleName").then(function(data) {
                $scope.lstModules = data.data;
                for (var i = 0; i < $scope.lstModules.length; i++) {
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

        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('responsive', true)
            .withOption('autoWidth', false)
            .withOption('aaSorting', [0, 'asc'])
            .withOption('deferRender', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            .withOption('dom', '<"top"<"left"<"length"l>>f>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>');

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

        $scope.init();
    }

})();
