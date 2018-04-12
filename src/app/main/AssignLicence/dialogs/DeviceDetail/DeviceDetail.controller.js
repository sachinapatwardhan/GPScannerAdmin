(function() {
    'use strict';

    angular
        .module('app.AssignLicence')
        .controller('LicenceDeviceDetailCtrl', LicenceDeviceDetailCtrl);

    /** @ngInject */
    function LicenceDeviceDetailCtrl($http, $cookieStore, $mdDialog, $scope, $rootScope, $mdToast, Id, OldDeviceId) {
        var vm = this;
        vm.searchTermDeviceId = '';
        $scope.init = function() {
            $scope.DeviceId = '';
            $scope.Id = Id;
            // $scope.idUser = userId;
            // $scope.lstDevice = lstDevice;
            $scope.OldDeviceId = OldDeviceId;
        };
        $scope.closeModel = function() {
                $mdDialog.hide();
            }
            // $scope.GetAllDevice = function(idUser) {
            //     $http.get($rootScope.RoutePath + "vehicles/GetAllNotAssignDevice").then(function(data) {
            //         $scope.lstDevice = data.data.data;
            //         HideLoader();
            //     });
            // }

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
        $scope.TransferDevicetoUser = function(DeviceId) {
            // var o = _.findWhere($scope.lstDevice, { id: id })
            var params = {
                Id: $scope.Id,
                DeviceId: DeviceId,
                OldDeviceId: $scope.OldDeviceId,
                CreatedBy: $cookieStore.get('UserName'),
            }
            $http.get($rootScope.RoutePath + "licence/SwipeDeviceAdmin", { params: params }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                if (data.data.success == true) {
                    $scope.ResetModel();
                    $scope.closeModel();
                    $rootScope.reloadLicence();
                }
            });
        }
        $scope.init();
    }


})();