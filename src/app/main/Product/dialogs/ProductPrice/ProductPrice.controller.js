(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('ProductPriceController', ProductPriceController);

    /** @ngInject */
    function ProductPriceController($http, $mdDialog, $scope, Lists, model, event, ProductVM) {
        var vm = this;

        // vm.GetAllMedia = GetAllMedia;

        // vm.GetAllMedia = GetAllMedia();

        // function GetAllMedia() {
        //     $http.get("http://localhost:3030/media/GetAllMedia").then(function(data) {
        //         $scope.lstMedia = data.data;
        //     });
        // }

        var objdata = Lists;



        $scope.lstCategory = objdata.lstCategory;
        $scope.lstManufacturer = objdata.lstManufacturer;
        $scope.lstVendor = objdata.lstVendor;
        $scope.lstStores = objdata.lstStores;
        $scope.lstWarehouse = objdata.lstWarehouse;
        $scope.modelSearch = objdata.modelSearch;
        $scope.modelUpdate = model;

        $scope.toggleSeleted = function() {
            $scope.allSelected = !$scope.allSelected;
            angular.forEach($scope.lstProductPanelSearch, function(o) {
                o.checked = $scope.allSelected;
            });
        };

        $scope.UpdateProductPrice = function(o) {
            ProductVM.UpdateProductPrice(o);
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();