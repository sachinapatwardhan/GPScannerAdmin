(function () {
    'use strict';

    angular
        .module('app.product')
        .controller('ProductAttributeCombinationController', ProductAttributeCombinationController);

    /** @ngInject */
    function ProductAttributeCombinationController($http, $q, $mdDialog, $scope, event, Lists, ProductVM, model, $rootScope, $mdToast) {
        var vm = this;
        var pendingSearch = angular.noop;
        var objdata = Lists;
        $scope.ProductId = objdata.productId;
        $scope.lstRoles = objdata.lstRoles;
        $scope.lstUsers = objdata.lstUsers;
        $scope.listProductAttribute = objdata.listProductAttribute;

        $scope.modelProductAttributeCombinations = model;
        $scope.modelProductAttributeWithValue = {};

        $scope.selectedItem = null;
        //Clear ProductAttributeCombination UserRoleId
        $scope.ClearProductAttributeCombinationUserRoleId = function () {

            $scope.modelProductAttributeCombinations.UserRoleId = "";
            $scope.selectedItem = null;
            $scope.query = null;
            // $scope.formProductAttributeCombination.ProductAttributeCombinationRole.$touched = false;
            // $scope.formProductAttributeCombination.ProductAttributeCombinationRole.$pristine = false;
            $scope.formProductAttributeCombination.ProductAttributeCombinationUser.$touched = false;
            $scope.formProductAttributeCombination.ProductAttributeCombinationUser.$pristine = false;
            //$scope.formProductAttributeCombination.$setUntouched();

        }

        $scope.GetUserByName = function (query) {

            return $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function (data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            // return pendingSearch;
        }
        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function (q) {
            if (q != null && q != undefined) {
                $scope.modelProductAttributeCombinations.UserRoleId = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.modelProductAttributeCombinations.UserRoleId = '';
                $scope.flgErrorNotFound = 1;
            };
        }


        //CreateProductAttributeCombinations
        $scope.CreateProductAttributeCombinations = function (o, modelProductAttributeWithValue) {

            //ProductVM.CreateProductAttributeCombinations(o,modelProductAttributeWithValue);

            if (o.Id == null || o.Id == "") {
                var lst = $scope.listProductAttribute
                if (lst != undefined && lst != null) {
                    var AttributeString = '';
                    var AttributeValueString = '';
                    var XMLAtt = "<Attributes>";
                    var AttributeXmlFlag = 0;
                    for (var i = 0; i < lst.length; i++) {

                        if (modelProductAttributeWithValue[lst[i].ProductAttributeId] != undefined && modelProductAttributeWithValue[lst[i].ProductAttributeId] != null) {
                            XMLAtt = XMLAtt + '<ProductVariantAttribute ID="' + lst[i].ProductAttributeId + '">';
                            XMLAtt = XMLAtt + '<ProductVariantAttributeValue>';
                            XMLAtt = XMLAtt + '<Value>' + modelProductAttributeWithValue[lst[i].ProductAttributeId] + '</Value>';
                            XMLAtt = XMLAtt + '</ProductVariantAttributeValue>';
                            XMLAtt = XMLAtt + '</ProductVariantAttribute>';

                            AttributeXmlFlag = 1;

                            if (AttributeString == '') {
                                AttributeString = lst[i].ProductAttributeId;
                                AttributeValueString = modelProductAttributeWithValue[lst[i].ProductAttributeId]
                            } else {
                                AttributeString = AttributeString + "," + lst[i].ProductAttributeId;
                                AttributeValueString = AttributeValueString + "," + modelProductAttributeWithValue[lst[i].ProductAttributeId]
                            }
                        }
                    }

                    XMLAtt = XMLAtt + "</Attributes>";
                    if (AttributeXmlFlag = 1) {
                        o.AttributesXml = XMLAtt;
                        o.AttributeString = AttributeString;
                        o.AttributeValueString = AttributeValueString;
                    }
                }
            }
            o.Id = $scope.modelProductAttributeCombinations.Id;

            var obj = {}
            var objTierPrice = {}

            objTierPrice.id = o.Id;
            objTierPrice.Price = o.Price;
            objTierPrice.ProductAttributeCombination = o.ProductAttributeCombination;
            objTierPrice.ProductAttributeCombinationId = o.Id;
            objTierPrice.Quantity = o.StockQuantity;
            objTierPrice.Type = o.Type;
            objTierPrice.UserRoleId = o.UserRoleId;


            obj.Product_Id = $scope.ProductId;
            obj.objProductAttributeCombination = o;
            obj.objTierPrice = objTierPrice;

            $http.post($rootScope.RoutePath + "productAttributeCombination/CreateProductAttributeCombination", obj).success(function (data) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                );
                if (data.success) {
                    $scope.ProductAttributeCombinationsFlg = 0;
                    $scope.modelProductAttributeCombinations.StockQuantity = 0;
                    $scope.modelProductAttributeCombinations.OverriddenPrice = 0;
                    $scope.modelProductAttributeCombinations.NotifyAdminForQuantityBelow = 0;
                    // ProductVM.initProductAttributeCombinationsModel();
                    $scope.ResetModelData();
                }

            });
        }

        $scope.closeModel = function () {
            $scope.modelProductAttributeCombinations.Type = "Role";
            $scope.modelProductAttributeCombinations.UserRoleId = "";
            $scope.modelProductAttributeCombinations.StockQuantity = 0;
            $scope.modelProductAttributeCombinations.OverriddenPrice = 0;
            $scope.modelProductAttributeCombinations.NotifyAdminForQuantityBelow = 0;
            $scope.modelProductAttributeCombinations.Id = "";

            $mdDialog.hide();
        }
        $scope.ResetModelData = function () {
            $scope.formProductAttributeCombination.$setPristine();
            $scope.formProductAttributeCombination.$setUntouched();

            $scope.modelProductAttributeCombinations.Type = "Role";
            $scope.modelProductAttributeCombinations.UserRoleId = "";
            $scope.modelProductAttributeCombinations.StockQuantity = 0;
            $scope.modelProductAttributeCombinations.OverriddenPrice = 0;
            $scope.modelProductAttributeCombinations.NotifyAdminForQuantityBelow = 0;
            $scope.modelProductAttributeCombinations.Id = "";
            $scope.modelProductAttributeWithValue = {};

            ProductVM.GetAllProductAttributeCombinationsFromModal();
        }
    }
})();