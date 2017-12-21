(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('ProductListController', ProductListController);

    /** @ngInject */
    function ProductListController($http, $mdDialog, $scope, lstProduct, Tasks, event, ProductVM, $rootScope) {
        var vm = this;

        // vm.GetAllMedia = GetAllMedia;

        // vm.GetAllMedia = GetAllMedia();

        // function GetAllMedia() {
        //     $http.get("http://localhost:3030/media/GetAllMedia").then(function(data) {
        //         $scope.lstMedia = data.data;
        //     });
        // }
        $scope.RoutePath = $rootScope.RoutePath;
        $scope.lstProductPanelSearch = lstProduct;

        $scope.toggleSeleted = function() {
            $scope.allSelected = !$scope.allSelected;
            angular.forEach($scope.lstProductPanelSearch, function(o) {
                o.checked = $scope.allSelected;
            });
        };

        $scope.SelectProductList = function() {
            ProductVM.SelectProductList($scope.lstProductPanelSearch);
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();