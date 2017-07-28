(function() {
    'use strict';

    angular
        .module('app.telco')
        .controller('telcoController', telcoController);

    /** @ngInject */
    function telcoController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        $scope.init = function() {
            $scope.model = {
                Name: '',
                id: '',

            };
            $scope.Search = '';
            $scope.GetAlltelco();
            $scope.flag = false;
        }


        vm.dtInstance = {};

        vm.dtOptions = DTOptionsBuilder.newOptions()
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
            .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withDOM('rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');

        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }

        $scope.DeleteTelco = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Company?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "telco/DeleteTelCompany?id=" + id).then(function(data) {
                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                    } else {
                        if (data.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            }, function() {});

        }

        $scope.FetchCompanyById = function(o) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.model.Name = o.Name;
            $scope.model.id = o.id;
            $scope.flag = true;
        }

        $scope.CreateTelCo = function(o, form) {
            console.log(o);
            $http.post($rootScope.RoutePath + "telco/SaveCompany", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }

                    $scope.init();
                } else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        };
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),

        ];

        $scope.resetForm = function() {
            $scope.FormManageTelCo.$setPristine();
            $scope.FormManageTelCo.$setUntouched();
        }

        $scope.ResetEdit = function() {
            $scope.model = {
                Name: '',
                id: '',
            };
            $scope.resetForm();
            $scope.flag = true;
        }
        $scope.Reset = function() {
            $scope.ResetEdit();
            $scope.resetForm();
            $scope.flag = false;
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
            .withOption('dom', 'rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>');
        $scope.dtInstance = {};

        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };
        $scope.gotoList = function() {
            $scope.init();
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();