(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('UpdateCombinationPriceController', UpdateCombinationPriceController);

    /** @ngInject */
    function UpdateCombinationPriceController($rootScope, $http, $mdDialog, $scope, pid, event, ProductVM, $mdToast) {
        var vm = this;

        $scope.init = function() {
            $scope.modelCombinationPrice = {
                Percentage: 0,
                Amount: 0,
                AmountFlag: '1',
                ProductId: 0,
            }
        }

        $scope.UpdateCombinationPrice = function(o) {
            o.ProductId = pid;
            $http.post($rootScope.RoutePath + "productAttributeCombination/UpdateCombinationPrice", o).success(function(data) {
                if (data.success) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();
                    ProductVM.GetAllProductAttributeCombinationsFromModal();

                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.ClearData = function() {
            $scope.modelCombinationPrice.Amount = 0;
            $scope.modelCombinationPrice.Percentage = 0;
        }

        $scope.ResetCombinationPrice = function() {
            $scope.modelCombinationPrice = {
                Percentage: 0,
                Amount: 0,
                AmountFlag: '1',
            }
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.init();
    }
})();