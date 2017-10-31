(function() {
    'use strict';

    angular
        .module('app.Customer')
        .controller('DeviceModelController', DeviceModelController);

    /** @ngInject */
    function DeviceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, idUser, Tasks, event) {
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
            }
            if ($rootScope.UserRoles == 'Sales Agent') {
                params.idSalesAgent = $rootScope.UserId
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