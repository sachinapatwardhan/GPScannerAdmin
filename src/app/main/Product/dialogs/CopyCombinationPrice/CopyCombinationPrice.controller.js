(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('CopyCombinationPriceController', CopyCombinationPriceController);

    /** @ngInject */
    function CopyCombinationPriceController($rootScope, $q, $http, $mdDialog, $scope, List, pid, event, ProductVM, $mdToast) {
        var vm = this;
        $scope.selectedItemFrom = null;
        $scope.selectedItemTo = null;
        var pendingSearchFrom = angular.noop;
        var pendingSearchTo = angular.noop;
        $scope.lstRoles = List.lstRoles;
        $scope.lstUsers = List.lstUsers;

        $scope.init = function() {
            $scope.modelCopyCombinationPrice = {
                FromType: 'Role',
                FromUserRoleId: '',
                ToType: 'Role',
                ToUserRoleId: '',
                AmountFlag: '1',
                Amount: 0,
                Percentage: 0,
            }
        }

        $scope.CopyCombinationPrice = function(o) {

            o.idProduct = pid;
            $http.post($rootScope.RoutePath + "productAttributeCombination/CopyCombinationPrice", o).success(function(data) {
                if (data.success) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();
                    ProductVM.GetAllProductAttributeCombinationsFromModal();

                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.ClearData = function() {
            $scope.modelCopyCombinationPrice.Amount = 0;
            $scope.modelCopyCombinationPrice.Percentage = 0;
        }

        $scope.ClearProductAttributeCombinationUserRoleId = function(step, value) {

            if (step == 'From') {
                $scope.modelCopyCombinationPrice.FromUserRoleId = "";
                $scope.selectedItemFrom = null;
                $scope.queryFrom = null;
                $scope.formCopyProductPrice.FromUserRoleIdUser.$touched = false;
                $scope.formCopyProductPrice.FromUserRoleIdUser.$pristine = false;
            }
            if (step == 'To') {
                $scope.modelCopyCombinationPrice.ToUserRoleId = "";
                $scope.selectedItemTo = null;
                $scope.queryTo = null;
                $scope.formCopyProductPrice.ToUserRoleIdUser.$touched = false;
                $scope.formCopyProductPrice.ToUserRoleIdUser.$pristine = false;
            }
        }

        $scope.ResetCombinationPrice = function() {
            $scope.modelCopyCombinationPrice = {
                FromType: 'Role',
                FromUserRoleId: '',
                ToType: 'Role',
                ToUserRoleId: '',
                AmountFlag: '1',
                ProductPrice: 0,
                Amount: 0,
            }
        }

        $scope.GetUserByNameFrom = function(query) {

            $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearchFrom = deferred.promise;
                return pendingSearchFrom
            });

            return pendingSearchFrom;
        }
        $scope.GetUserByNameTo = function(query) {

            $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearchTo = deferred.promise;
                return pendingSearchTo
            });

            return pendingSearchTo;
        }
        $scope.flgErrorNotFoundFrom = 1;
        $scope.selectedItemChangeFrom = function(q) {
            if (q != null && q != undefined && !isNaN(q.id)) {
                $scope.modelCopyCombinationPrice.FromUserRoleId = q.id;
                $scope.flgErrorNotFoundFrom = 0;
            } else {
                $scope.modelCopyCombinationPrice.FromUserRoleId = '';
                $scope.flgErrorNotFoundFrom = 1;
            };
        }
        $scope.flgErrorNotFoundTo = 1;
        $scope.selectedItemChangeTo = function(q) {
            if (q != null && q != undefined && !isNaN(q.id)) {
                $scope.modelCopyCombinationPrice.ToUserRoleId = q.id;
                $scope.flgErrorNotFoundTo = 0;
            } else {
                $scope.modelCopyCombinationPrice.ToUserRoleId = '';
                $scope.flgErrorNotFoundTo = 1;
            };
        }


        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();