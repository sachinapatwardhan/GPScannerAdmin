(function() {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('UploadOrderPaymentReceiptController', UploadOrderPaymentReceiptController);

    /** @ngInject */
    function UploadOrderPaymentReceiptController($rootScope, $http, $mdDialog, $scope, event, idOrder, $mdToast, OrderVM) {
        var vm = this;
        $scope.Mediafiles = []
        $scope.SaveOrderReceipt = function() {
            if ($scope.Mediafiles.length > 0) {
                var formData = new FormData();
                angular.forEach($scope.Mediafiles, function(obj) {
                    formData.append(idOrder, obj.lfFile);
                });
                $http.post($rootScope.RoutePath + "billing/uploadImage", formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(function(data) {
                    $scope.apiMedia.removeAll()
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    OrderVM.GetAllOrderServiceFromModal()
                    $mdDialog.hide();
                })
            }
        }
        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();