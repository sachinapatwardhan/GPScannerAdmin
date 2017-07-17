(function () {
    'use strict';

    angular
        .module('app.order')
        .controller('EditOrderProductModalController', EditOrderProductModalController);

    /** @ngInject */
    function EditOrderProductModalController($http, $mdDialog, $scope, $cookieStore, objorderProducts, Tasks, event, ModelInfoVM, $rootScope, $mdToast) {
        var vm = this;
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.init = function () {
            $scope.modelOrderDetailInfo = {
                id: '',
                OrderId: 0,
                ProductName: '',
                Quantity: null,
                UnitPriceInclTax: '',
                PriceInclTax: '',
                Attribute: '',
                AttributeValue: '',
            };
            if (objorderProducts != null && objorderProducts != undefined && objorderProducts != '') {
                $scope.FetchData();
            }
        }

        //Change Order detail Price
        $scope.setOrderDetailPrice = function () {
            if ($scope.modelOrderDetailInfo.Quantity == null) {
                $scope.modelOrderDetailInfo.Quantity = 1;
            }
            if ($scope.modelOrderDetailInfo.UnitPriceExclTax == null) {
                $scope.modelOrderDetailInfo.UnitPriceExclTax = 0;
            }

            $scope.modelOrderDetailInfo.PriceExclTax = parseInt($scope.modelOrderDetailInfo.Quantity) * parseFloat($scope.modelOrderDetailInfo.UnitPriceExclTax);
        }

        $scope.UpdateOrderDetail = function (o) {
            $http.post($rootScope.RoutePath + "order/UpdateOrderDetail", o).success(function (response) {
                if (response.success == true) {
                    // message
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    if (response.data != null) {
                        var OrderSubtotalInclTax = response.data.OrderSubtotal;
                        var OrderTotal = response.data.OrderTotal;
                        ModelInfoVM.SetOrderTotal(OrderTotal, OrderSubtotalInclTax);
                    }
                    $scope.closeModel();
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });

        }


        $scope.FetchData = function () {
            $scope.modelOrderDetailInfo.id = objorderProducts.id;
            $scope.modelOrderDetailInfo.OrderId = objorderProducts.OrderId;
            $scope.modelOrderDetailInfo.ProductName = objorderProducts.ProductName;
            $scope.modelOrderDetailInfo.Quantity = objorderProducts.Quantity;
            $scope.modelOrderDetailInfo.UnitPriceInclTax = objorderProducts.UnitPriceInclTax;
            $scope.modelOrderDetailInfo.PriceInclTax = objorderProducts.PriceInclTax;
            $scope.modelOrderDetailInfo.UnitPriceExclTax = objorderProducts.UnitPriceExclTax;
            $scope.modelOrderDetailInfo.PriceExclTax = objorderProducts.PriceExclTax;
            $scope.modelOrderDetailInfo.lstAttribute = objorderProducts.lstAttribute;
            $scope.modelOrderDetailInfo.Attribute = objorderProducts.Attribute;
            $scope.modelOrderDetailInfo.AttributeValue = objorderProducts.AttributeValue;
        }

        $scope.closeModel = function () {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();
