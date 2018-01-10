(function() {
    'use strict';

    angular
        .module('app.EmailTemplate')
        .controller('EmailTemplateController', EmailTemplateController);

    /** @ngInject */
    function EmailTemplateController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        vm.GetAllEmailTemplate = GetAllEmailTemplate;


        $scope.init = function() {
            //$scope.model = {
            //    id: '',
            //    Type: '',
            //    EmailSubject: '',
            //    EmailBody: '',
            //    EmailFrom: '',
            //};
            vm.GetAllEmailTemplate();
            $scope.modelSearch = { Search: '' }
                //$scope.tab = { selectedIndex: 0 };
        }

        function GetAllEmailTemplate() {
            $http.get($rootScope.RoutePath + "email/GetAllEmailTemplate").then(function(data) {
                $scope.lstEmailTemplate = data.data;
            });
        }


        $scope.FetchEmailTemplate = function(ev, o) {
            $mdDialog.show({
                controller: 'EmailTemplateModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/EmailTemplate/dialogs/EmailTemplateModel/EmailTemplateModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: o,
                    Tasks: [],
                    event: ev,
                    EmailTemplateVM: vm
                }
            })
        }
        $scope.DeleteEmailTemplate = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Email Template ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idEmailTemplate: Id
                };
                $http.get($rootScope.RoutePath + "email/DeleteEmailTemplate", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.modelSearch.search = '';
                        vm.GetAllEmailTemplate();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });
        }


        $scope.Reset = function() {
            $scope.init();
        }


        vm.dtOptions = DTOptionsBuilder.newOptions()
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


            // .withPaginationType('full_numbers')
            //     .withDisplayLength(10)
            //     .withOption('responsive', true)
            //     .withOption('autoWidth', true)
            //     .withOption('language', {
            //         'zeroRecords': "No Record Found",
            //         'emptyTable': "No Record Found"
            //     })
            //     // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            //     .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
            // // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4)
            ];
        $scope.dtInstance = {};
        $scope.GetSerch = function(Search) {

            $scope.dtInstance.DataTable.search(Search);
            $scope.dtInstance.DataTable.search(Search).draw();
        };

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();