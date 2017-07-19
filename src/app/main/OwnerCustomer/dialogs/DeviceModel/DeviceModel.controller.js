(function() {
    'use strict';

    angular
        .module('app.OwnerCustomer')
        .controller('DeviceModelController', DeviceModelController);

    /** @ngInject */
    function DeviceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, idUser, Tasks, event) {
        var vm = this;

        $scope.init = function() {
            $scope.idUser = idUser;
            $scope.GetUserDevices($scope.idUser);
        }

        $scope.GetUserDevices = function(idUser) {
            var params = {
                iduser: idUser,
            }
            $http.get($rootScope.RoutePath + "vehicles/GetAllVehicleByUser", { params: params }).then(function(data) {
                $scope.lstDevice = data.data;
            });
        }

        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();