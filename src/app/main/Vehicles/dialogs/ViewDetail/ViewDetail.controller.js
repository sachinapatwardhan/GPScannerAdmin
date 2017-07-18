(function() {
    'use strict';

    angular
        .module('app.ownerVehicle')
        .controller('ViewDetailCtrl', ViewDetailCtrl);

    /** @ngInject */
    function ViewDetailCtrl($http, $mdDialog, $scope, ModalMethod, $rootScope, $mdToast, idVehicle, objVehicle) {
        var vm = this;
        // vm.GetAllDynamicVehicles = GetAllDynamicVehicles;
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.Name = objVehicle.Name;
        $scope.model = objVehicle;
        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.CreateVehicleDetails = function(o) {
            $http.post($rootScope.RoutePath + "vehicles/SaveVehicle", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true;
                    }
                    $scope.closeModel();
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
                    };

                }
            });
        };

    }
})();