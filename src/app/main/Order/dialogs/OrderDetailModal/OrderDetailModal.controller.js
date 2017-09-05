(function() {
    'use strict';

    angular
        .module('app.order')
        .controller('OrderDetailModalController', OrderDetailModalController);

    /** @ngInject */
    function OrderDetailModalController($http, $mdDialog, $scope, objorder, Tasks, event, MediaVM, $rootScope, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.RoutePath = $rootScope.RoutePath;
        $scope.CurrencyCode = $rootScope.CurrencyCode;

        // GetOrderDetailByOrderId

        $scope.dtColumnDefs = [
            // DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];

        $scope.dtOptionsOrderDetail = DTOptionsBuilder.newOptions()
            .withOption('paging', false)
            .withOption('bFilter', false)
            .withOption('bInfo', false)
            .withOption('language', {
                'zeroRecords': "No Record Found",
                'emptyTable': "No Record Found"
            })

        $scope.GetOrderDetailByOrderId = function() {
            $http.get($scope.RoutePath + 'order/GetOrderDetailByOrderId?idOrder=' + objorder.id).then(function(data) {
                // console.log(data);
                if (data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {

                        if (data.data[i].Attribute != '' && data.data[i].AttributeValue != '' && data.data[i].Attribute != null && data.data[i].AttributeValue != null) {
                            var Attribute = data.data[i].Attribute.split(",");
                            var AttributeValue = data.data[i].AttributeValue.split(",");

                            var lstAttribute = [];
                            for (var j = 0; j < Attribute.length; j++) {
                                var obj = new Object();
                                obj["Name"] = Attribute[j];
                                obj["Value"] = AttributeValue[j];

                                lstAttribute.push(obj);
                            }
                            data.data[i]["lstAttribute"] = lstAttribute;
                        }
                    }
                    $scope.lstOrderDetail = data.data;
                } else {
                    $scope.lstOrderDetail = [];
                }
                // console.log($scope.lstOrderDetail)
            });
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.GetOrderDetailByOrderId();
    }
})();