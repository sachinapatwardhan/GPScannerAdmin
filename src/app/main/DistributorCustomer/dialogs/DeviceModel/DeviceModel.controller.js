(function() {
    'use strict';

    angular
        .module('app.DistributorCustomer')
        .controller('DistributorDeviceModelController', DistributorDeviceModelController);

    /** @ngInject */
    function DistributorDeviceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, idUser, Tasks, event) {
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $scope.idUser = idUser;
            $scope.GetUserDevices($scope.idUser);
        }

        $scope.GetUserDevices = function(idUser) {
            var params = {
                iduser: idUser,
                DistibutorId: $rootScope.UserId,
            }
            $http.get($rootScope.RoutePath + "distributor/GetAllVehicleByUserForDistibutor", { params: params }).then(function(data) {
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