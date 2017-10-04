(function() {
    'use strict';

    angular
        .module('app.TransferDevice')
        .controller('DeviceDetailCtrl', DeviceDetailCtrl);

    /** @ngInject */
    function DeviceDetailCtrl($http, $mdDialog, $scope, $rootScope, $mdToast, id, userId, lstDevice, olddeviceid) {
        var vm = this;
        vm.searchTermDeviceId = '';
        $scope.init = function() {
            $scope.DeviceId = '';
            $scope.id = id;
            $scope.idUser = userId;
            $scope.lstDevice = lstDevice;
            $scope.olddeviceid = olddeviceid;
        };
        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.GetAllDevice = function(idUser) {
            $http.get($rootScope.RoutePath + "vehicles/GetAllNotAssignDevice").then(function(data) {
                $scope.lstDevice = data.data.data;
                HideLoader();
            });
        }

        $scope.clearSearchTerm = function() {
            vm.searchTermDeviceId = '';
        };
        $scope.Reset = function() {
            $mdDialog.hide();
        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.ResetModel = function() {
            $scope.DeviceId = '';
            vm.searchTermDeviceId = '';
        }
        $scope.TransferDevicetoUser = function(id) {
            var o = _.findWhere($scope.lstDevice, { id: id })
            var params = {
                id: $scope.id,
                iduser: $scope.idUser,
                deviceid: o.DeviceId,
                olddeviceid: $scope.olddeviceid,
            }
            $http.get($rootScope.RoutePath + "vehicles/TransferDevicetoUser", { params: params }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                $scope.ResetModel();
                $scope.closeModel();
                $rootScope.reload();
            });
        }
        $scope.init();
    }


})();