(function() {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('OpenRemarkController', OpenRemarkController);

    /** @ngInject */
    function OpenRemarkController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, obj, Tasks, event, MainVM) {
        var vm = this;
        // console.log(obj)
        $scope.model = {
            id: obj.id,
            PurchaseOrderNumber: obj.PurchaseOrderNumber,
            OrderTotal: 'MYR ' + parseFloat(obj.OrderTotal).toFixed(2),
            MaarkAsManualBy: obj.Courier,
            Remark: obj.Terms,
            RemarkDate: obj.ModifiedDate,
        }
        if (obj.ModifiedDate != null) {
            $scope.model.RemarkDate = moment(obj.ModifiedDate).format('DD-MM-YYYY hh:mm:ss a');
        } else {
            $scope.model.RemarkDate = 'N/A';
        }

        if (obj.Courier == null) {
            $scope.model.MaarkAsManualBy = 'N/A';
        }

        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

    }
})();