(function () {
    'use strict';

    angular
        .module('app.Support')
        .controller('DeviceModelController', DeviceModelController);

    /** @ngInject */
    function DeviceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, objUser, Tasks, event) {
        var vm = this;

        $scope.init = function () {
            
            $scope.UserName = objUser.username;
            $scope.GetUserDevices($scope.UserName);
        }
                
        $scope.GetUserDevices = function (o) {
            var params = {
                username: o
            }
            
            $http.get($rootScope.RoutePath + "pet/GetAllPetByUser", { params: params }).then(function (data) {
                $scope.lstDevice = data.data;
            });
        }

        $scope.Reset = function () {
            $mdDialog.hide();
        }

        $scope.closeModel = function () {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();
