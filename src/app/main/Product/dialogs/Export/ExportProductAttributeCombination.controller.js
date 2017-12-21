(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('ExportProductAttributeCombinationController', ExportProductAttributeCombinationController);

    /** @ngInject */
    function ExportProductAttributeCombinationController($http, $q, $mdDialog, $mdToast, $scope, $rootScope, Lists, model, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder) {

        $scope.ProductId = Lists.productId;
        $scope.lstRoles = Lists.lstRoles;
        $scope.lstUsers = Lists.lstUsers;

        var pendingSearch = angular.noop;
        $scope.selectedItem = null;


        $scope.GetUserByName = function(query) {
            $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }
        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function(q) {

            if (q != null && q != undefined && !isNaN(q.id)) {
                $scope.modelProductAttributeCombinations.UserRoleId = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.modelProductAttributeCombinations.UserRoleId = '';
                $scope.flgErrorNotFound = 1;
            };
        }

        $scope.init = function() {
            $scope.modelProductAttributeCombinations = {
                UserRoleId: '',
                Type: 'Role'
            }
        }

        $scope.ClearProductAttributeCombinationUserRoleId = function(form) {
            $scope.query = null;
            $scope.selectedItem = null;
            $scope.modelProductAttributeCombinations.UserRoleId = "";
            // $scope.formProductAttributeCombinationExport.FromUserRoleIdRole.$touched = false;
            // $scope.formProductAttributeCombinationExport.FromUserRoleIdRole.$pristine = false;
            $scope.formProductAttributeCombinationExport.FromUserRoleIdUser.$touched = false;
            $scope.formProductAttributeCombinationExport.FromUserRoleIdUser.$pristine = false;
        }

        $scope.ExportProductAttributeCombinations = function(o) {

            o.UserRoleId = $scope.modelProductAttributeCombinations.UserRoleId;
            window.location = $rootScope.RoutePath + "productAttributeCombination/ExportProductAttributeCombinations?ProductId=" + $scope.ProductId + "&Type=" + o.Type + "&UserRoleId=" + o.UserRoleId;
            $scope.closeModel();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();