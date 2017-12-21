(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('ImportModelController', ImportModelController);

    /** @ngInject */
    function ImportModelController($http, $q, $mdDialog, $scope, $rootScope, Lists, $mdToast, ProdAttrCombi_ProductId, event, ProductVM, model) {
        var vm = this;
        var pendingSearch = angular.noop;
        $scope.selectedItem = null;
        var objdata = Lists;
        $scope.lstRoles = objdata.lstRoles;
        $scope.model = model;
        $scope.ProductId = ProdAttrCombi_ProductId;

        //Clear ProductAttributeCombination UserRoleId
        $scope.ClearProductAttributeCombinationUserRoleId = function() {
            $scope.model.UserRoleId = "";
            $scope.selectedItem = null;
            $scope.query = null;
            $scope.formImport.User.$touched = false;
            $scope.formImport.User.$pristine = false;
        }

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
            if (q != null && q != undefined) {
                $scope.model.UserRoleId = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.UserRoleId = '';
                $scope.flgErrorNotFound = 1;
            };
        }

        $scope.Import = function(obj) {
            var formData = new FormData();
            angular.forEach($scope.Mediafiles1, function(obj) {
                formData.append('files[]', obj.lfFile);
                formData.append('ProdAttrCombi_ProductId', $scope.ProductId);
            });
            $http.post($rootScope.RoutePath + "ProductAttributeCombination/ImportProductAttributeCombinations?ProductId=" + $scope.ProductId + "&Type=" + obj.Type + "&UserRoleId=" + obj.UserRoleId, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();

                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();