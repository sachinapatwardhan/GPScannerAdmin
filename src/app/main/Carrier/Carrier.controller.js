(function() {
    'use strict';

    angular
        .module('app.carrier', [])
        .controller('CarrierController', CarrierController);

    /** @ngInject */
    function CarrierController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                Name: '',
                idCountry: '',
            };
            $scope.GetAllCarrier();
            $scope.GetAllCountry();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllCarrier = function() {
            $http.get($rootScope.RoutePath + "carrier/GetAllCarrier").then(function(data) {
                $scope.lstCarrier = data.data;
            });
        }

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.CreateCarrier = function(o) {
            $http.post($rootScope.RoutePath + "carrier/SaveCarrier", o).then(function(data) {
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

        }

        $scope.FetchCarrierById = function(o) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.idCountry = o.idCountry;
        }

        $scope.DeleteCarrier = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Carrier?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "carrier/DeleteCarrier?idCarrier=" + id).then(function(data) {
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

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.init();
            $scope.restForm();
        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
        ];

        $scope.restForm = function() {
            $scope.formCarrier.$setUntouched();
            $scope.formCarrier.$setPristine();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }
        $scope.ResetModel = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.model = {
                    id: '',
                    Name: '',
                    idCountry: '',
                };
                $scope.restForm();
            }
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })

    }

})();
