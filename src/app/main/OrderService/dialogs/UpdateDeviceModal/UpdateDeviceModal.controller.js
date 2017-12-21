(function () {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('UpdateDeviceModalController', UpdateDeviceModalController);

    /** @ngInject */
    function UpdateDeviceModalController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, obj, Tasks, event, MainVM) {
        var vm = this;
        console.log(obj)

        $scope.model = {
            id: obj.id,
            DeviceId: obj.OrderNotes,
        }

        $scope.SaveDevice = function (o) {
            var params = {
                id: o.id,
                DeviceId: o.DeviceId,
            }
            $http.get($rootScope.RoutePath + "orderservice/UpdateDevice", { params: params }).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );
                    MainVM.GetAllOrderServiceFromModal(true);
                    $mdDialog.hide();
                }
                else {
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
        }

        $scope.Reset = function () {
            $mdDialog.hide();
        }

        $scope.closeModel = function () {
            $mdDialog.hide();
        }
    }
})();
