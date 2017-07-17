(function() {
    'use strict';

    angular
        .module('app.order')
        .controller('ManageTrackingNumberModalController', ManageTrackingNumberModalController);

    /** @ngInject */
    function ManageTrackingNumberModalController($http, $mdDialog, $scope, idorder, Tasks, event, ModelInfoVM, $rootScope, $mdToast) {
        var vm = this;
        $scope.RoutePath = $rootScope.RoutePath;

        $scope.init = function() {

            $scope.modelTracking = {
                OrderId: '',
                TrackingNumber: '',
                Courier: '',
                ModifiedDate: new Date(),
            }
            if (idorder != null && idorder != undefined) {
                $scope.objdata = _.findWhere(ModelInfoVM.lstdata, { id: idorder });
                $scope.CourierList = ModelInfoVM.CourierList;
                if ($scope.objdata != null && $scope.objdata != undefined) {
                    $scope.modelTracking.OrderId = $scope.objdata.id;
                    if ($scope.objdata.TrackingNumber != null && $scope.objdata.TrackingNumber != '' && $scope.objdata.TrackingNumber != undefined) {
                        $scope.modelTracking.TrackingNumber = parseInt($scope.objdata.TrackingNumber);
                    }
                    $scope.modelTracking.Courier = $scope.objdata.Courier;
                } else {
                    $scope.ResetModel();
                }
            }
        }

        $scope.SaveTrackNumber = function(obj) {
            $http.post($rootScope.RoutePath + "order/AddTrackingNumber", obj).success(function(response) {
                if (response.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();
                    $scope.ResetModel();
                    ModelInfoVM.GetAllOrderFromModal('',false);
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.ResetModel = function() {
            $scope.modelTracking = {
                OrderId: '',
                TrackingNumber: '',
                Courier: '',
                ModifiedDate: new Date(),
            }
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();
