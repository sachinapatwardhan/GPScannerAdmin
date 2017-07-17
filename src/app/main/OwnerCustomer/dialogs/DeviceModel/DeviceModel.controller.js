(function() {
    'use strict';

    angular
        .module('app.OwnerCustomer')
        .controller('DeviceModelController', DeviceModelController);

    /** @ngInject */
    function DeviceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, objUser, Tasks, event) {
        var vm = this;

        $scope.init = function() {
            $scope.UserName = objUser;
            $scope.GetUserDevices($scope.UserName);
        }

        $scope.GetUserDevices = function(o) {
            var params = {
                id: o,
                DeviceType: "M2-U"
            }           
            $http.get($rootScope.RoutePath + "bike/GetAllPetByUser", { params: params }).then(function(data) {              
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
