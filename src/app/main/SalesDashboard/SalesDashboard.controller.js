(function() {
    'use strict';

    angular
        .module('app.SalesDashboard')
        .controller('SalesDashboardController', SalesDashboardController);

    function SalesDashboardController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout, $filter) {
        $rootScope.UserId = $cookieStore.get('UserId');

        $scope.init = function() {

            $scope.GetTotallist();
        }

        $scope.GetTotallist = function() {
            var params = {
                IdUser: $rootScope.UserId,
            }
            $http.get($rootScope.RoutePath + "dashboard/SalesDashBoardData", { params: params }).then(function(data) {
                $scope.lstTotalsalesboard = data.data.data;
            });
        }
        $scope.init();
    }
})();