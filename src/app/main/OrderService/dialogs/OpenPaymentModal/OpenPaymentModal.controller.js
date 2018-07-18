(function() {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('OpenPaymentModalController', OpenPaymentModalController);

    /** @ngInject */
    function OpenPaymentModalController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, obj, Tasks, event, MainVM) {
        var vm = this;
        // console.log(obj)
        $scope.model = {
            id: obj.id,
            PurchaseOrderNumber: obj.PurchaseOrderNumber,
            OrderTotal: parseFloat(obj.OrderTotal),
            DisplayOrderTotal: 'MYR ' + parseFloat(obj.OrderTotal).toFixed(2),
            Email: obj.tbluserinformation.email,
            username: obj.tbluserinformation.username,
            idUser: obj.tbluserinformation.id,
            idApp: obj.tbluserinformation.idApp,
            AppName: obj.tblappinfo.AppName,
        }

        $scope.SendPaymentLink = function(o) {
            var params = {
                id: o.id,
                PurchaseOrderNumber: o.PurchaseOrderNumber,
                Email: o.Email,
                OrderTotal: o.OrderTotal,
                idUser: o.idUser,
                idApp: o.idApp,
                AppName: o.AppName,
                username: o.username,
            }
            $http.get($rootScope.RoutePath + "billing/SendPaymentLink", { params: params }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    MainVM.GetAllOrderServiceFromModal(true);
                    $mdDialog.hide();
                } else {
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


        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

    }
})();