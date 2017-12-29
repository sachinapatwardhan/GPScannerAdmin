(function () {
    'use strict';

    angular
        .module('app.WalletTransaction')
        .controller('ReceiptModalController', ReceiptModalController);

    /** @ngInject */
    function ReceiptModalController($http, $mdDialog, $mdToast, $scope, $rootScope, ImageN) {

        // console.log($rootScope.RoutePath + "/MediaUploads/WalletReceipt-")
        $scope.ImagePath = $rootScope.RoutePath + "/MediaUploads/WalletReceipt/" + ImageN;

        $scope.closeModel = function () {
            $mdDialog.hide();
        }

    }
})();