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



        $scope.Reset = function() {
            $scope.init();
        }


        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('responsive', true)
            .withOption('autoWidth', true)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })
            .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            // .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
            // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)
        ];

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();