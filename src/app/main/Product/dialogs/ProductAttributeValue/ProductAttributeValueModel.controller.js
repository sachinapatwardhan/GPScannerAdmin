(function() {
    'use strict';

    angular
        .module('app.product')
        .controller('ProductAttributeValueModelController', ProductAttributeValueModelController);

    /** @ngInject */
    function ProductAttributeValueModelController($http, $mdDialog, $mdToast, $scope, $rootScope, $cookieStore, $document, ProductAttributeobj, Tasks, event, ProductAttributeVM, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                Id: '',
                ProductAttributeMappingId: '',
                AttributeValueTypeId: '',
                AssociatedProductId: 0,
                Name: '',
                ColorSquaresRgb: '',
                PriceAdjustment: 0.00,
                WeightAdjustment: 0.00,
                Cost: 0.00,
                Quantity: 1,
                IsPreSelected: 0,
                DisplayOrder: 0,
                PictureId: 0,
                ProductId: '',
                AttributeName: '',
                ProductAttributeId: '',
                Price: 0.0000,
                OldPrice: 0.0000,
                ProductCost: 0.0000,
                SpecialPrice: null,
                SpecialPriceStartDateTimeUtc: new Date(),
                SpecialPriceEndDateTimeUtc: new Date(),
            };

            $scope.model.ProductAttributeMappingId = ProductAttributeobj.ProductAttributeMappingId;
            $scope.model.AttributeValueTypeId = ProductAttributeobj.AttributeValueTypeId;
            $scope.model.AttributeName = ProductAttributeobj.Name;
            $scope.model.ProductAttributeId = ProductAttributeobj.ProductAttributeId;
            //$scope.lstProductAttributeValue = ProductAttributeobj.lstProductAttributeValue;

            $scope.GetProductAttributeValues();
            $scope.GetAllCountry();

        }

        $scope.RoutePath = $rootScope.RoutePath;
        $http.get($rootScope.RoutePath + "productPictureMapping/GetAllProductPictureByProductId?idProductPicture=" + ProductAttributeobj.ProductId).success(function(data) {
            $scope.ListProductPicture = data;
        });

        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.clearSearchTerm = function() {
            vm.searchCountry = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.CreateProductAttributeValue = function(o) {
            if (o.SpecialPrice == null) {
                o.SpecialPriceStartDateTimeUtc = null;
                o.SpecialPriceEndDateTimeUtc = null
            }
            o.AttributeValueTypeId = 0;
            $http.post($rootScope.RoutePath + "ProductAttributeValue/SaveProductAttributeValue", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.init();
                    $scope.restForm();
                } else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
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

        $scope.GetProductAttributeValues = function() {
            var params = {
                ProductAttributeMappingId: ProductAttributeobj.ProductAttributeMappingId
            }
            $http.get($rootScope.RoutePath + "ProductAttributeValue/GetProductAttributeValues", { params: params }).then(function(data) {
                // $scope.lstProductAttributeValue = data.data;
                $scope.lstProductAttributeValue = _.filter(data.data, function(item) {
                    item.Price = parseFloat(Math.round(item.Price * 100) / 100).toFixed(2);
                    item.OldPrice = parseFloat(Math.round(item.OldPrice * 100) / 100).toFixed(2);
                    if (item.SpecialPrice != null) {
                        item.SpecialPrice = parseFloat(Math.round(item.SpecialPrice * 100) / 100).toFixed(2);
                    }
                    item.ProductCost = parseFloat(Math.round(item.ProductCost * 100) / 100).toFixed(2);
                    return item;
                })
            });
        }

        $scope.FetchAttributeValue = function(o) {
            $scope.model.Id = o.Id;
            $scope.model.ProductAttributeMappingId = o.ProductAttributeMappingId;
            $scope.model.AttributeValueTypeId = o.AttributeValueTypeId;
            $scope.model.AssociatedProductId = o.AssociatedProductId;
            $scope.model.AssociateProductName = o.AssociateProductName;
            $scope.model.Name = o.Name;
            $scope.model.ColorSquaresRgb = o.ColorSquaresRgb;
            $scope.model.PriceAdjustment = o.PriceAdjustment;
            $scope.model.WeightAdjustment = o.WeightAdjustment;
            $scope.model.Cost = o.Cost;
            $scope.model.IsPreSelected = o.IsPreSelected;
            $scope.model.DisplayOrder = o.DisplayOrder;
            $scope.model.PictureId = o.PictureId;
            $scope.model.Quantity = o.Quantity;
            $scope.model.Price = o.Price;
            $scope.model.OldPrice = o.OldPrice;
            $scope.model.ProductCost = o.ProductCost;
            $scope.model.SpecialPrice = o.SpecialPrice;
            // $scope.model.SpecialPriceStartDateTimeUtc = o.SpecialPriceStartDateTimeUtc;
            // $scope.model.SpecialPriceEndDateTimeUtc = o.SpecialPriceEndDateTimeUtc;
            if (o.SpecialPriceStartDateTimeUtc != null) {
                $scope.model.SpecialPriceStartDateTimeUtc = new Date(o.SpecialPriceStartDateTimeUtc);
            } else {
                $scope.model.SpecialPriceStartDateTimeUtc = new Date();
            };

            if (o.SpecialPriceEndDateTimeUtc != null) {
                $scope.model.SpecialPriceEndDateTimeUtc = new Date(o.SpecialPriceEndDateTimeUtc);
            } else {
                $scope.model.SpecialPriceEndDateTimeUtc = new Date();
            };
        }

        $scope.DeleteProductAttributeValue = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idProductAttributeValue: id
                }
                $http.get($rootScope.RoutePath + "ProductAttributeValue/DeleteProductAttributeValue", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        ProductAttributeVM.GetAllProductProductAttributeValue();
                        $scope.init();
                    } else {
                        if (data.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
                            $rootScope.logout();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            });
        }

        $scope.restForm = function() {
            $scope.formPoductAttribute.$setUntouched();
            $scope.formPoductAttribute.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model.Name = '',
                $scope.model.PriceAdjustment = 0.00,
                $scope.model.WeightAdjustment = 0.00,
                $scope.model.Cost = 0.00,
                $scope.model.Quantity = 1,
                $scope.model.IsPreSelected = '',
                $scope.model.DisplayOrder = 0,
                $scope.model.PictureId = 0,
                $scope.model.Price = 0.0000,
                $scope.model.OldPrice = 0.0000,
                $scope.model.ProductCost = 0.0000,
                $scope.model.SpecialPrice = null,
                $scope.model.SpecialPriceStartDateTimeUtc = null,
                $scope.model.SpecialPriceEndDateTimeUtc = null,

                $scope.restForm();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
            ProductAttributeVM.GetAllProductProductAttributeValue();
        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('class', 'text-center'),
        ];

        $scope.init();


    }
})();