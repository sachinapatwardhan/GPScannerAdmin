(function() {
    'use strict';

    angular
        .module('app.roles')
        .controller('RolesController', RolesController);

    /** @ngInject */
    function RolesController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.GetAllRoles = GetAllRoles;
        vm.RemoveCountryToRole=RemoveCountryToRole;
        $scope.init = function() {
            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }
            $scope.model = {
                RoleName: '',
                Description: '',
                id: '',

            };
            $scope.GetAllRoles();
            $scope.RoleCountry = "";
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        function GetAllRoles() {
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function(data) {
                $scope.lstRoles = data.data;
                $scope.GetAllCountry();
            });
        }

        $scope.GetAllRoles = function() {
            // Data
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function(data) {
                $scope.lstRoles = data.data;
                $scope.GetAllCountry();
            });
        }

        $scope.DeleteRole = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Role?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "role/DeleteRole?idRole=" + id).then(function(data) {
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

        $scope.FetchRoleById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model.Description = o.Description;
            $scope.model.RoleName = o.RoleName;
            $scope.model.id = o.id;
        }

        $scope.CreateRole = function(o, form) {
            $http.post($rootScope.RoutePath + "role/SaveRole", o).then(function(data) {
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

        function RemoveCountryToRole(o, ev) {
            $mdDialog.show({
                controller: 'RemoveCountryModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Roles/dialogs/RemoveCountryModel/RemoveCountryModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    CountryList: $scope.lstCountry,
                    event: ev,
                    RoleVM: vm,
                    RoleCountry: o.Country,
                    FlgDeletedAccess: $rootScope.FlgDeletedAccess,
                    RoleObj: o,
                    CountrydtColumnDefs1: $scope.CountrydtColumnDefs1
                }
            })
        }


        $scope.RemoveCountryToRole = function(o, ev) {
            $mdDialog.show({
                controller: 'RemoveCountryModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Roles/dialogs/RemoveCountryModel/RemoveCountryModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    CountryList: $scope.lstCountry,
                    event: ev,
                    RoleVM: vm,
                    RoleCountry: o.Country,
                    FlgDeletedAccess: $rootScope.FlgDeletedAccess,
                    RoleObj: o,
                    CountrydtColumnDefs1: $scope.CountrydtColumnDefs1
                }
            })
        }

        // $scope.dtOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(10)
        //     .withOption('responsive', true)
        //     .withOption('autoWidth', true)
        //      .withOption('language', {
        //          'zeroRecords': "No Record Found",
        //          'emptyTable': "No Record Found"
        //      })
        //     .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),

        ];

        $scope.CountrydtColumnDefs1 = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
        ];


        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {

                $scope.FormManageRoles.$setPristine();
                $scope.FormManageRoles.$setUntouched();
                $scope.model = {
                    RoleName: '',
                    Description: '',
                    id: '',

                };
            }
        }
        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.init();
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();
