(function () {
  'use strict';

  angular
    .module('app.product')
    .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController($filter, $http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, $cookieStore, DTColumnBuilder, $compile, $element, $timeout) {

    var vm = this;
    vm.GetAllProductPanelmodal = GetAllProductPanelmodal;
    vm.UpdateProductPrice = UpdateProductPrice;
    vm.GetAllProductAttributeCombinationsFromModal = GetAllProductAttributeCombinationsFromModal;
    vm.isFormValid = isFormValid;
    $scope.init = function () {
      $scope.PageNo = 1;
      $scope.productFlg = 0;
      $scope.showvendor = 0;
      $scope.Search = '';
      $scope.flgShowProductAttributeCombination = 1;
      $scope.initSearchModel();
      $scope.initModel();
      $scope.initPictureModel();
      $scope.initCategoryModel();
      $scope.initProductSpecificationAttributesModel();
      $scope.initProductAttributeModel();
      $scope.initProductAttributeCombinationsModel();
      $scope.inittirepriceModel();
      $scope.initRelatedProductModel();
      $scope.initCrossSellProductModel();
    };

    $scope.initSearchModel = function () {
      //Product Model Search
      $scope.modelSearch = {
        Name: '',
        CategoryId: '',
        ManufacturerId: '',
        StoreId: '',
        VendorId: 0,
        WarehouseId: 0,
        ProductTypeId: '',
        Sku: '',
        Publish: '1',
      };
    };

    $scope.initModel = function () {
      //initialize product display

      //Product Model
      $scope.model = {
        Id: 0,
        ProductTypeId: '',
        ParentGroupedProductId: 0,
        VisibleIndividually: true,
        ProductTemplateId: 0,
        Name: '',
        ShortDescription: '',
        FullDescription: '',
        AdminComment: '',
        VendorId: 0,
        BrandId: 0,
        ShowOnHomePage: false,
        DisplayOrder: 0,
        AllowCustomerReviews: true,
        ProductTags: [],
        Sku: '',
        ManufacturerPartNumber: '',
        Gtin: '',
        Price: 0.0000,
        OldPrice: 0.0000,
        ProductCost: 0.0000,
        SpecialPrice: null,
        SpecialPriceStartDateTimeUtc: null,
        SpecialPriceEndDateTimeUtc: null,
        DisableBuyButton: false,
        DisableWishlistButton: false,
        AvailableForPreOrder: false,
        PreOrderAvailabilityStartDateTimeUtc: null,
        CallForPrice: false,
        CustomerEntersPrice: false,
        MinimumCustomerEnteredPrice: 0.0000,
        MaximumCustomerEnteredPrice: 1000.0000,
        RequireOtherProducts: false,
        RequiredProductIds: '',
        RequireProductNames: '',
        AutomaticallyAddRequiredProducts: false,
        IsGiftCard: false,
        GiftCardTypeId: 0,
        IsDownload: false,
        IsRecurring: false,
        RecurringCycleLength: 100,
        RecurringCyclePeriodId: 0,
        RecurringTotalCycles: 10,
        IsRental: false,
        RentalPriceLength: 1,
        RentalPricePeriodId: 0,
        IsShipEnabled: true,
        IsFreeShipping: false,
        ShipSeparately: false,
        AdditionalShippingCharge: 0.0000,
        Weight: 0.0000,
        Length: 0.0000,
        Width: 0.0000,
        Height: 0.0000,
        DeliveryDateId: 0,
        IsTaxExempt: false,
        TaxCategoryId: 0,
        IsTelecommunicationsOrBroadcastingOrElectronicServices: false,
        ManageInventoryMethodId: 0,
        UseMultipleWarehouses: false,
        WarehouseId: 0,
        StockQuantity: 10000,
        DisplayStockAvailability: false,
        DisplayStockQuantity: false,
        MinStockQuantity: 0,
        LowStockActivityId: 0,
        NotifyAdminForQuantityBelow: 1,
        BackorderModeId: 0,
        AllowBackInStockSubscriptions: false,
        OrderMinimumQuantity: 1,
        OrderMaximumQuantity: 10000,
        AllowedQuantities: '',
        AllowAddingOnlyExistingAttributeCombinations: false,
        AvailableStartDateTimeUtc: null,
        AvailableEndDateTimeUtc: null,
        Published: true,
        CreatedOnUtc: null,
        UpdatedOnUtc: null,
        MetaKeywords: '',
        MetaDescription: '',
        MetaTitle: '',
        HasDiscountsApplied: false,
        SubjectToAcl: false,
        LimitedToStores: false,
        SearchText: '',
        LstDiscount: '',
        ApprovedRatingSum: 0,
        NotApprovedRatingSum: 0,
        ApprovedTotalReviews: 0,
        NotApprovedTotalReviews: 0,
        tags: [],
        UserAgreementText: '',
        URLTitle: '',
        URL: '',
        Specification: '',
        FreeGift: ''

      };
      $scope.modelImport = {
        Type: 'Role',
        UserRoleId: '',
        UserRoleName: '',
      };

      //Update Product Price Model
      $scope.modelUpdate = {
        CategoryId: '',
        ProductPrice: 0,
        Percentage: '0',
        Amount: '0',
        AmountFlag: 1,

      };

      $scope.GetAllRoles();
      $scope.GetAllProductType();
      $scope.GetAllUsers();

      //flags
      $scope.TierFlg = 0;
      $scope.showvendor = 0;
      $scope.ProductAttributeFlg = 0;
      $scope.ProductAttributeCombinationsFlg = 0;
      $scope.ProductManufacturerFlg = 0;
      $scope.CategoryFlg = 0;
      $scope.ProductSpecificationAttributesFlg = 0;
      $scope.RelatedProductFlg = 0;
      $scope.AddProducttab = {
        selectedIndex: 0
      };

      $scope.SetDataEntryFlg = '';

    };

    //Initialize search text
    $scope.SearchText = '';

    //initialize Product Picture Model
    $scope.initPictureModel = function () {
      $scope.modelPicture = {
        Id: '',
        ProductId: 0,
        PictureId: 0,
        DisplayOrder: 0,
        FileName: '',
      };
    };

    //initialize Product Category Model
    $scope.initCategoryModel = function () {
      $scope.modelCategory = {
        Id: '',
        ProductId: 0,
        //CategoryId: 0,
        IsFeaturedProduct: false,
        DisplayOrder: 0,
      };
    };

    //initialize Product Manufacturer Model
    $scope.initManufacturerModel = function () {
      $scope.modelManufacturer = {
        Id: '',
        ProductId: 0,
        //ManufacturerId: 0,
        IsFeaturedProduct: false,
        DisplayOrder: 0,
      };

    };


    //initialize Product Specification Attributes Model
    $scope.initProductSpecificationAttributesModel = function () {
      $scope.modelProductSpecificationAttributes = {
        Id: 0,
        ProductId: 0,
        AttributeTypeId: 0,
        SpecificationAttributeOptionId: 0,
        CustomValue: '',
        AllowFiltering: false,
        ShowOnProductPage: true,
        DisplayOrder: 0,
      };

    };

    //initialize Product Attributes Model
    $scope.initProductAttributeModel = function () {
      $scope.modelProductAttribute = {
        Id: 0,
        ProductId: 0,
        ProductAttributeId: 0,
        TextPrompt: null,
        IsRequired: false,
        AttributeControlType: '',
        DisplayOrder: 0,
        ValidationMinLength: null,
        ValidationMaxLength: null,
        DefaultValue: null,
      };
      $scope.GetAllProductAttribute();
    };


    //initialize Product Attribute Combinations Model
    $scope.initProductAttributeCombinationsModel = function () {
      $scope.modelProductAttributeCombinations = {
        Id: '',
        ProductId: 0,
        AttributesXml: '',
        StockQuantity: 0,
        AllowOutOfStockOrders: false,
        Sku: '',
        ManufacturerPartNumber: '',
        Gtin: '',
        OverriddenPrice: 0.0000,
        NotifyAdminForQuantityBelow: 0,
        AttributeWithValue: '',
        AttributeString: '',
        AttributeValueString: '',
        Type: 'Role',
        UserRoleId: '',
        UserRoleName: '',
        ProductCombinationTierId: '',
      };


    };


    //initialize Tier Price Model
    $scope.inittirepriceModel = function () {
      $scope.modeltier = {
        Id: 0,
        ProductId: 0,
        StoreId: 0,
        StockQuantity: 0,
        CustomerRoleId: 0,
        Quantity: 0,
        Price: 0.00,
      };

    };

    //initialize Related Product Model
    $scope.initRelatedProductModel = function () {
      $scope.modelRelatedProduct = {
        Id: '',
        ProductId1: 0,
        ProductId2: 0,
        DisplayOrder: 1,
      };
    };

    //initialize CrossSell Product Model
    $scope.initCrossSellProductModel = function () {
      $scope.modelCrossSellProduct = {
        Id: '',
        ProductId1: 0,
        ProductId2: 0,
      };

    };


    $scope.ClearSearchProduct = function () {
      $scope.SearchText = '';
      $scope.SearchProductPanel(1, '');
    }

    //Select Product for required products
    $scope.SelectProduct = function (ProductId, ProductName) {
      if ($scope.model.RequiredProductIds == '') {
        $scope.model.RequiredProductIds = ProductId;
        $scope.model.RequireProductNames = ProductName;
      } else {
        $scope.model.RequiredProductIds = $scope.model.RequiredProductIds + "," + ProductId;
        $scope.model.RequireProductNames = $scope.model.RequireProductNames + "," + ProductName;
      }
    }


    $scope.GetAllProductType = function () {
      $scope.lstProductTypes = [];
      $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
        $scope.lstProductTypes = data.data;
        if ($scope.lstProductTypes.length > 0) {
          // $scope.model.ProductTypeId = parseInt($scope.lstProductTypes[0].id);
        }
      });
    }

    //Retrive User
    $scope.GetAllUsers = function () {
      $http.get($rootScope.RoutePath + "user/GetAllUser").then(function (data) {
        $scope.lstUsers = data.data;
      });
    }

    //Retrive User role
    $scope.GetAllRoles = function () {
      $http.get($rootScope.RoutePath + "role/GetAllRole").then(function (data) {
        $scope.lstRoles = data.data;

      });

    }

    //Retrive Product Attribute
    $scope.GetAllProductAttribute = function () {
      $http.get($rootScope.RoutePath + "productAttributeMapping/GetAllProductAttribute").then(function (data) {
        $scope.lstProductAttribute = data.data;
        if (data.data.length > 0) {
          $scope.modelProductAttribute.ProductAttributeId = data.data[0].Id;
        }
      });
    }

    //Go directly to product SKU
    $scope.GoSKU = function () {
      $scope.modelSearch.Name = '';
      $scope.modelSearch.CategoryId = '';
      $scope.modelSearch.ManufacturerId = '';
      $scope.modelSearch.StoreId = '';
      $scope.modelSearch.VendorId = 0;
      $scope.modelSearch.WarehouseId = 0;
      $scope.modelSearch.ProductTypeId = '';
      $scope.modelSearch.Publish = 'ALL';
      $scope.GetAllProductPaneld(true);
    }


    //Retrive Product
    $scope.FetchProductById = function (id) {
      $scope.AddProducttab = {
        selectedIndex: 0
      };

      var o = _.findWhere($scope.lstdata, {
        Id: id
      });
      if (o != null && o != undefined && o != '') {


        $scope.model.Id = o.Id;
        $scope.model.ProductTypeId = o.ProductTypeId;
        $scope.model.ParentGroupedProductId = o.ParentGroupedProductId;
        $scope.model.VisibleIndividually = o.VisibleIndividually;
        $scope.model.ProductTemplateId = o.ProductTemplateId;
        $scope.model.Name = o.Name;
        $scope.model.ShortDescription = o.ShortDescription;
        $scope.model.FullDescription = o.FullDescription;
        $scope.model.AdminComment = o.AdminComment;
        $scope.objVendor = o.VendorId;
        $scope.model.VendorId = o.VendorId;
        if ($scope.model.ProductTypeId == 1 || $scope.model.ProductTypeId == 2) {
          $scope.showvendor = 1;
        }
        $scope.model.ShowOnHomePage = o.ShowOnHomePage;
        $scope.model.DisplayOrder = o.DisplayOrder;
        $scope.model.AllowCustomerReviews = o.AllowCustomerReviews;
        $scope.model.Sku = o.Sku;
        $scope.model.ManufacturerPartNumber = o.ManufacturerPartNumber;
        $scope.model.Gtin = o.Gtin;
        $scope.model.Price = o.Price;
        $scope.model.OldPrice = o.OldPrice;
        $scope.model.ProductCost = o.ProductCost;
        $scope.model.SpecialPrice = o.SpecialPrice;
        if (o.SpecialPriceStartDateTimeUtc != null) {
          $scope.model.SpecialPriceStartDateTimeUtc = new Date(o.SpecialPriceStartDateTimeUtc);
        } else {
          $scope.model.SpecialPriceStartDateTimeUtc = null;
        };

        if (o.SpecialPriceEndDateTimeUtc != null) {
          $scope.model.SpecialPriceEndDateTimeUtc = new Date(o.SpecialPriceEndDateTimeUtc);
        } else {
          $scope.model.SpecialPriceEndDateTimeUtc = null;
        };
        $scope.model.DisableBuyButton = o.DisableBuyButton;
        $scope.model.DisableWishlistButton = o.DisableWishlistButton;
        $scope.model.AvailableForPreOrder = o.AvailableForPreOrder;
        $scope.model.PreOrderAvailabilityStartDateTimeUtc = o.PreOrderAvailabilityStartDateTimeUtc;
        $scope.model.CallForPrice = o.CallForPrice;
        $scope.model.CustomerEntersPrice = o.CustomerEntersPrice;
        $scope.model.MinimumCustomerEnteredPrice = o.MinimumCustomerEnteredPrice;
        $scope.model.MaximumCustomerEnteredPrice = o.MaximumCustomerEnteredPrice;
        $scope.model.RequireOtherProducts = o.RequireOtherProducts;
        $scope.model.RequiredProductIds = o.RequiredProductIds;
        $scope.model.RequireProductNames = o.RequireProductNames;
        $scope.model.AutomaticallyAddRequiredProducts = o.AutomaticallyAddRequiredProducts;
        $scope.model.IsGiftCard = o.IsGiftCard;
        $scope.model.GiftCardTypeId = o.GiftCardTypeId;
        $scope.model.IsDownload = o.IsDownload;
        $scope.model.IsRecurring = o.IsRecurring;
        $scope.model.RecurringCycleLength = o.RecurringCycleLength;
        $scope.model.RecurringCyclePeriodId = o.RecurringCyclePeriodId;
        $scope.model.RecurringTotalCycles = o.RecurringTotalCycles;
        $scope.model.IsRental = o.IsRental;
        $scope.model.RentalPriceLength = o.RentalPriceLength;
        $scope.model.RentalPricePeriodId = o.RentalPricePeriodId;
        $scope.model.IsShipEnabled = o.IsShipEnabled;
        $scope.model.IsFreeShipping = o.IsFreeShipping;
        $scope.model.ShipSeparately = o.ShipSeparately;
        $scope.model.AdditionalShippingCharge = o.AdditionalShippingCharge;
        $scope.model.Weight = o.Weight;
        $scope.model.Length = o.Length;
        $scope.model.Width = o.Width;
        $scope.model.Height = o.Height;
        $scope.model.DeliveryDateId = o.DeliveryDateId;
        $scope.model.IsTaxExempt = o.IsTaxExempt;
        $scope.model.TaxCategoryId = o.TaxCategoryId;
        $scope.model.IsTelecommunicationsOrBroadcastingOrElectronicServices = o.IsTelecommunicationsOrBroadcastingOrElectronicServices;
        $scope.model.ManageInventoryMethodId = o.ManageInventoryMethodId;
        $scope.model.UseMultipleWarehouses = o.UseMultipleWarehouses;
        $scope.model.WarehouseId = o.WarehouseId;
        $scope.model.StockQuantity = o.StockQuantity;
        $scope.model.DisplayStockAvailability = o.DisplayStockAvailability;
        $scope.model.DisplayStockQuantity = o.DisplayStockQuantity;
        $scope.model.MinStockQuantity = o.MinStockQuantity;
        $scope.model.LowStockActivityId = o.LowStockActivityId;
        $scope.model.NotifyAdminForQuantityBelow = o.NotifyAdminForQuantityBelow;
        $scope.model.BackorderModeId = o.BackorderModeId;
        $scope.model.AllowBackInStockSubscriptions = o.AllowBackInStockSubscriptions;
        $scope.model.OrderMinimumQuantity = o.OrderMinimumQuantity;
        $scope.model.OrderMaximumQuantity = o.OrderMaximumQuantity;
        $scope.model.AllowedQuantities = o.AllowedQuantities;
        $scope.model.AllowAddingOnlyExistingAttributeCombinations = o.AllowAddingOnlyExistingAttributeCombinations;

        if (o.AvailableStartDateTimeUtc != null) {
          $scope.model.AvailableStartDateTimeUtc = new Date(o.AvailableStartDateTimeUtc);
        } else {
          $scope.model.AvailableStartDateTimeUtc = null;
        };

        if (o.AvailableEndDateTimeUtc != null) {
          $scope.model.AvailableEndDateTimeUtc = new Date(o.AvailableEndDateTimeUtc);
        } else {
          $scope.model.AvailableEndDateTimeUtc = null;
        };

        $scope.model.Published = o.Published;

        if (o.CreatedOnUtc != null) {
          $scope.model.CreatedOnUtc = new Date(o.CreatedOnUtc);
        } else {
          $scope.model.CreatedOnUtc = null;
        };
        if (o.UpdatedOnUtc != null) {
          $scope.model.UpdatedOnUtc = new Date(o.UpdatedOnUtc);
        } else {
          $scope.model.UpdatedOnUtc = null;
        };
        // $scope.model.CreatedOnUtc = new Date(o.CreatedOnUtc);
        // $scope.model.UpdatedOnUtc = new Date(o.UpdatedOnUtc);
        $scope.model.BrandId = o.BrandId;
        $scope.model.MetaKeywords = o.MetaKeywords;
        $scope.model.MetaDescription = o.MetaDescription;
        $scope.model.MetaTitle = o.MetaTitle;
        $scope.model.HasDiscountsApplied = o.HasDiscountsApplied;
        $scope.model.SubjectToAcl = o.SubjectToAcl;
        $scope.model.LimitedToStores = o.LimitedToStores;
        $scope.model.ApprovedRatingSum = o.ApprovedRatingSum;
        $scope.model.NotApprovedRatingSum = o.NotApprovedRatingSum;
        $scope.model.ApprovedTotalReviews = o.ApprovedTotalReviews;
        $scope.model.NotApprovedTotalReviews = o.NotApprovedTotalReviews;
        $scope.model.UserAgreementText = o.UserAgreementText;
        $scope.model.URLTitle = o.URLTitle;
        $scope.model.URL = o.URL;
        $scope.model.Specification = o.Specification;
        $scope.model.FreeGift = o.FreeGift;

        var lstProductTags = o.producttags

        for (var i = 0; i < lstProductTags.length; i++) {
          lstProductTags[i].text = lstProductTags[i].Name;
          $scope.model.tags[i] = lstProductTags[i].Name;
        };

        $scope.productFlg = 1;
        $scope.productCopyFlg = 1;

        $scope.GetAllProductPicture();
        $scope.GetAllProductProductAttribute();
        $scope.GetAllProductAttributeCombinations();
      }
    }

    $scope.GoToPreview = function (id) {
      window.open($rootScope.FrontPath + "#/PreviewProduct/" + id);
    }
    $scope.resetMainForm = function () {
      $scope.formproduct.ProductName.$touched = false;
      $scope.formproduct.ProductTypeId.$touched = false;

      $scope.formproduct.$setPristine();
      // $scope.form.VendorName.$touched = false;
    }
    $scope.ErrorMainForm = function () {
      $scope.formproduct.ProductName.$touched = true;
      $scope.formproduct.ProductTypeId.$touched = true;
      //$scope.formproduct.VendorName.$touched = true;
    }

    function isFormValid(formName) {
      if ($scope[formName] && $scope[formName].$valid) {
        return $scope[formName].$valid;
      }

    }
    //create product panel

    $scope.CreateProductPanel = function (form, o, saveandcontinue) {

      if (form.$valid) {

        $scope.ACL = _.where($scope.lstRoles, {
          checked: true
        });
        $scope.Stores = _.where($scope.lstStores, {
          checked: true
        });
        $scope.Discount = _.where($scope.DiscountList, {
          checked: true
        });

        for (var i = 0; i < $scope.model.tags.length; ++i) {
          var objProductTags = {
            text: $scope.model.tags[i]
          };
          $scope.model.ProductTags.push(objProductTags);
        }

        o.ProductTags = $scope.model.ProductTags;
        o.ACL = $scope.ACL;
        o.Store = $scope.Stores;
        o.ApplyDiscount = $scope.Discount;
        if (o.VendorId != null && o.VendorId != '' && o.VendorId != undefined) {
          o.VendorId = o.VendorId;
        } else {
          o.VendorId = 0;
        }
        $http.post($rootScope.RoutePath + "product/CreateProductPanel", o).success(function (data) {
          if (data.success == true) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
            if (saveandcontinue) {
              $scope.model.Id = data.data;
              $scope.GetAllProductPicture();
              $scope.GetAllProductProductAttribute();
              $scope.GetAllProductAttributeCombinations();
            } else {
              $scope.init();
              $scope.GetAllProductPanel(true);
            }

          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
          }
        });
      } else {
        $scope.ErrorMainForm();
      }
    }

    //Delete Product
    $scope.DeleteProductPanel = function (id, ev) {

      var o = _.findWhere($scope.lstdata, {
        Id: id
      });
      if (o != undefined && o != null) {

        var confirm = $mdDialog.confirm()
          .title('Are you sure to delete this Product?')
          .textContent('')
          .ariaLabel('Delete Product')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function () {

          $http.post($rootScope.RoutePath + "product/DeleteProduct", o).success(function (data) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
            //$scope.initModel();
            // $scope.tempURL = window.location.href;
            // var res = $scope.tempURL.substr(0, $scope.tempURL.indexOf('?'));
            // window.location.href = res;
            //$scope.GetAllProductPicture();

            $scope.init();
            $scope.GetAllProductPanel(true);
          });
        }, function () { });
      };
    }

    $scope.AddProduct = function () {
      $scope.productFlg = 1;
      $scope.productCopyFlg = 0;
      // $('#tokenfield').tokenfield('setTokens', "")
      $scope.resetMainForm();
      setTimeout(function () {
        $scope.initModel();
      }, 500);

    }
    //Fetch Images from media


    //Get Product Picture
    $scope.GetAllProductPicture = function () {

      $http.get($rootScope.RoutePath + "productPictureMapping/GetAllProductPictureByProductId?idProductPicture=" + $scope.model.Id).success(function (data) {
        $scope.ListProductPicture = data;
      });
    }

    //Reset Picture Model
    $scope.ResetPictureModel = function () {
      $scope.flg = 2;
      $scope.apiMedia.removeAll();
      $scope.initPictureModel();
    }

    //Retrive Product Picture
    $scope.FetchProductPictureById = function (o) {
      $scope.flg = 0;
      $scope.modelPicture.Id = o.Id;
      $scope.modelPicture.ProductId = o.ProductId;
      $scope.modelPicture.PictureId = o.PictureId;
      $scope.modelPicture.FileName = o.tblmediamgmt.FileName;
      $scope.modelPicture.DisplayOrder = o.DisplayOrder;
      $scope.apiMedia.removeAll();
    }

    //Delete Product Picture
    $scope.DeleteProductPicture = function (o, ev) {

      var confirm = $mdDialog.confirm()
        .title('Are you sure to delete this record?')
        .textContent('')
        .ariaLabel('Delete record')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function () {

        $http.get($rootScope.RoutePath + "productPictureMapping/DeleteProductPicture?idProductPicture=" + o).success(function (data) {
          if (data.success) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)

            );
            $scope.flg = 2;

            $scope.initPictureModel();
            $scope.GetAllProductPicture();
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
          }



        });
      }, function () { });
    }

    //create product Picture Mapping
    $scope.CreateProductPicture = function (o) {


      if ($scope.Mediafiles.length > 0) {

        var formData = new FormData();
        angular.forEach($scope.Mediafiles, function (obj) {
          formData.append('files[]', obj.lfFile);
        });



        $http.post($rootScope.RoutePath + "media/upload", formData, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).then(function (data) {


          if (data.data.success == true) {
            o.Id = $scope.modelPicture.Id;
            // var params = {
            //     Product_Id: $scope.model.Id
            // }
            o.PictureId = data.data.data[0].id;
            o.ProductId = $scope.model.Id;

            $http.post($rootScope.RoutePath + "productPictureMapping/CreateProductPicture", o).then(function (data) {

              $mdToast.show(
                $mdToast.simple()
                  .textContent(data.data.message)
                  .position('top right')
                  .hideDelay(3000)
              );

              $scope.apiMedia.removeAll();
              $scope.flg = 2;
              $scope.initPictureModel();
              $scope.GetAllProductPicture();
            });
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.data.message)
                .position('top right')
                .hideDelay(3000)
            );
          };

        }, function (err) {

          $mdToast.show(
            $mdToast.simple()
              .textContent(err)
              .position('top right')
              .hideDelay(3000)
          );
          // do sometingh
        });

      } else if ((o.FileName != '' && o.FileName != null)) {
        o.Id = $scope.modelPicture.Id;
        o.ProductId = $scope.model.Id;

        $http.post($rootScope.RoutePath + "productPictureMapping/CreateProductPicture", o).then(function (data) {

          $mdToast.show(
            $mdToast.simple()
              .textContent(data.data.message)
              .position('top right')
              .hideDelay(3000)
          );

          $scope.apiMedia.removeAll();
          $scope.flg = 2;
          $scope.initPictureModel();
          $scope.GetAllProductPicture();
        });

      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent("Please select Picture For Product.")
            .position('top right')
            .hideDelay(3000)
        );
      }
    }

    //Product Category Mapping

    //Category
    $scope.AddProductCategory = function () {
      $scope.CategoryFlg = 1;
      //$scope.modelCategory.CategoryId = 0;
    }

    $scope.CancelProductCategory = function () {
      $scope.CategoryFlg = 0;
      $scope.initCategoryModel();
    }

    //Product Attribute
    $scope.AddProductAttribute = function () {
      $scope.ProductAttributeFlg = 1;
    }

    $scope.CancelProductAttribute = function () {
      $scope.ProductAttributeFlg = 0;
      $scope.initProductAttributeModel();
    }

    //Get Product Attribute
    $scope.GetAllProductProductAttribute = function () {
      $http.get($rootScope.RoutePath + "productAttributeMapping/GetAllProductAttributeMappingByProductId?idProduct=" + $scope.model.Id).success(function (data) {
        if (data.length > 0) {
          $scope.listProductAttribute = data;
        } else {
          $scope.listProductAttribute = null;
        }

      });
    }

    //Retrive Product Attribute
    $scope.FetchProductAttributeById = function (o) {
      $scope.modelProductAttribute.Id = o.Id;
      $scope.modelProductAttribute.ProductId = o.ProductId;
      $scope.modelProductAttribute.ProductAttributeId = o.ProductAttributeId;
      $scope.modelProductAttribute.IsRequired = o.IsRequired;
      $scope.modelProductAttribute.TextPrompt = o.TextPrompt;
      $scope.modelProductAttribute.AttributeControlType = o.AttributeControlType;
      $scope.modelProductAttribute.DisplayOrder = o.DisplayOrder;
      $scope.ProductAttributeFlg = 1;
    }

    //Delete Product Attribute
    $scope.DeleteProductAttribute = function (ev, o) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to Delete this Attribute?')
        .textContent('Attribute related to this Attribute Value will also delete.')
        .targetEvent(ev)
        .ok('Ok')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function () {
        $http.get($rootScope.RoutePath + "productAttributeMapping/DeleteProductAttributeMapping?idProductAttributeMapping=" + o).success(function (data) {
          if (data.success) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
            $scope.initProductAttributeModel();
            $scope.GetAllProductProductAttribute();
            $scope.GetAllProductAttributeCombinations()
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
          }

        });
      });
    }

    //create product Attribute Mapping
    $scope.CreateProductAttribute = function (o) {
      o.Id = $scope.modelProductAttribute.Id;
      o.ProductId = $scope.model.Id;
      o.ValidationMaxLength = null;
      o.ValidationMinLength = null
      $http.post($rootScope.RoutePath + "productAttributeMapping/CreateProductAttributeMapping", o).success(function (data) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(data.message)
            .position('top right')
            .hideDelay(3000)
        );
        $scope.ProductAttributeFlg = 0;
        $scope.initProductAttributeModel();
        $scope.GetAllProductProductAttribute();
      });
    }

    //Product Attribute Combination Mapping

    //Get Product Attribute Combination
    $scope.GetAllProductAttributeCombinations = function () {
      $http.get($rootScope.RoutePath + "productAttributeCombination/GetAllProductAttributeCombinations?idProduct=" + $scope.model.Id).success(function (data) {
        $scope.listProductAttributeCombinations = data;
        $scope.AttributeWithValue = data.AttributeWithValue;
      });
    }

    $scope.FetchProductAttributeCombinationsById = function (o, AttributeWithValue) {
      $scope.modelProductAttributeCombinations.Id = o.productattributecombination.Id;
      $scope.modelProductAttributeCombinations.ProductId = o.productattributecombination.ProductId;
      $scope.modelProductAttributeCombinations.AttributesXml = o.productattributecombination.AttributesXml;
      $scope.modelProductAttributeCombinations.StockQuantity = o.Quantity;
      $scope.modelProductAttributeCombinations.AllowOutOfStockOrders = o.AllowOutOfStockOrders;
      $scope.modelProductAttributeCombinations.Sku = o.Sku;
      $scope.modelProductAttributeCombinations.ManufacturerPartNumber = o.ManufacturerPartNumber;
      $scope.modelProductAttributeCombinations.Gtin = o.Gtin;
      $scope.modelProductAttributeCombinations.OverriddenPrice = o.Price;
      $scope.modelProductAttributeCombinations.NotifyAdminForQuantityBelow = o.productattributecombination.NotifyAdminForQuantityBelow;
      $scope.modelProductAttributeCombinations.Type = o.Type;
      if (o.Type == "Role") {
        $scope.modelProductAttributeCombinations.UserRoleId = o.tblrole.id;
        $scope.modelProductAttributeCombinations.UserRoleName = o.tblrole.RoleName;
      }
      if (o.Type == "User") {
        $scope.modelProductAttributeCombinations.UserRoleId = o.tbluserinformation.id;
        $scope.modelProductAttributeCombinations.UserRoleName = o.tbluserinformation.username;
      }
      $scope.modelProductAttributeCombinations.AttributeWithValue = AttributeWithValue;


      $scope.modelProductAttributeCombinations.ProductCombinationTierId = o.id
      $scope.ProductAttributeCombinationsFlg = 1;
    }

    $scope.DeleteProductAttributeCombinations = function (o, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to delete this record?')
        .textContent('')
        .ariaLabel('Delete record')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function () {
        // var params = {
        //     id: o.ProductCombinationTierId,
        //     ProductAttributeCombinationId: o.Id,
        // };
        o.id = o.id;
        o.ProductAttributeCombinationId = o.ProductAttributeCombinationId;
        $http.get($rootScope.RoutePath + "productAttributeCombination/DeleteProductAttributeCombination?ProductAttributeCombinationId=" + o.ProductAttributeCombinationId + "&id=" + o.id).success(function (data) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(data.message)
              .position('top right')
              .hideDelay(3000)
          );
          $scope.initProductAttributeCombinationsModel();
          $scope.GetAllProductAttributeCombinations();
        });
      }, function () { });
    }

    $scope.CancelProductAttributeCombinations = function () {
      $scope.ProductAttributeCombinationsFlg = 0;
      $scope.initProductAttributeCombinationsModel();
      // $scope.GetAllProductAttributeCombinations();

    }

    function GetAllProductAttributeCombinationsFromModal() {
      $scope.GetAllProductAttributeCombinations();
    }

    //Product attribute combination
    $scope.OpenProductAttributeCombination = function (ev, o) {

      $scope.modelProductAttributeWithValue = {};
      $scope.ProductAttributeCombinationsFlg = 0;
      $scope.initProductAttributeCombinationsModel();

      var obj = {
        lstRoles: $scope.lstRoles,
        lstUsers: $scope.lstUsers,
        listProductAttribute: $scope.listProductAttribute,
        productId: $scope.model.Id,
      }

      $mdDialog.show({
        controller: 'ProductAttributeCombinationController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/ProductAttributeCombination/ProductAttributeCombination.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          Lists: obj,
          model: $scope.modelProductAttributeCombinations,
          event: ev,
          ProductVM: vm,

        }
      });
    }

    //Export Product Attribute
    $scope.OpenExportProductAttributeCombination = function (ev) {

      $scope.modelProductAttributeWithValue = {};
      $scope.ProductAttributeCombinationsFlg = 0;
      $scope.initProductAttributeCombinationsModel();
      var obj = {
        lstRoles: $scope.lstRoles,
        lstUsers: $scope.lstUsers,
        listProductAttribute: $scope.listProductAttribute,
        productId: $scope.model.Id,
      }
      $mdDialog.show({
        controller: 'ExportProductAttributeCombinationController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/Export/ExportProductAttributeCombination.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          Lists: obj,
          model: $scope.modelProductAttributeCombinations,
          Tasks: [],
          event: ev,
        }
      })
    }


    $scope.closeModal = function () {
      $mdDialog.hide();
    };


    $scope.CreateProductAttributeCombinations = function (o, modelProductAttributeWithValue) {
      if (o.Id == null || o.Id == "") {
        var lst = $scope.listProductAttributeCombinationsName;
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


      obj.Product_Id = $scope.model.Id;
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

          $scope.initProductAttributeCombinationsModel();
          $scope.GetAllProductAttributeCombinations();

        } else {
          $scope.modelProductAttributeCombinations.StockQuantity = 0;
          $scope.modelProductAttributeCombinations.AllowOutOfStockOrders = false;
          $scope.modelProductAttributeCombinations.Sku = '';
          $scope.modelProductAttributeCombinations.ManufacturerPartNumber = '';
          $scope.modelProductAttributeCombinations.Gtin = '';
          $scope.modelProductAttributeCombinations.OverriddenPrice = 0.0000;
          $scope.modelProductAttributeCombinations.NotifyAdminForQuantityBelow = 0;

        }

        //$scope.GetAllProductAttributeCombinations();

      });

    }

    //Product attribute update combination  price
    $scope.OpenProductAttributeCombinationPrice = function (ev) {
      $scope.CancelProductAttributeCombinations();
      $mdDialog.show({
        controller: 'UpdateCombinationPriceController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/UpdateCombinationPrice/UpdateCombinationPrice.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          pid: $scope.model.Id,
          event: ev,
          ProductVM: vm,
        }
      });
    }

    //Product attribute copy combination  price
    $scope.OpenCopyProductCombinationPrice = function (ev) {
      $scope.CancelProductAttributeCombinations();

      var obj = {
        lstRoles: $scope.lstRoles,
        lstUsers: $scope.lstUsers
      }
      $mdDialog.show({
        controller: 'CopyCombinationPriceController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/CopyCombinationPrice/CopyCombinationPrice.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          List: obj,
          pid: $scope.model.Id,
          event: ev,
          ProductVM: vm,
        }
      });
    }


    //Product Tier Prices Mapping

    //Tier
    $scope.Addtier = function () {
      $scope.TierFlg = 1;
    }

    $scope.Canceltier = function () {
      $scope.TierFlg = 0;
      $scope.inittirepriceModel();
    }



    $scope.init();

    //Update ProductPrice
    $scope.OpenProductPrice = function (ev) {
      var obj = {
        lstCategory: $scope.lstCategory,
        lstManufacturer: $scope.lstManufacturer,
        lstVendor: $scope.lstVendor,
        lstStores: $scope.lstStores,
        lstWarehouse: $scope.lstWarehouse,
        modelSearch: $scope.modelSearch,
      }

      $mdDialog.show({
        controller: 'ProductPriceController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/ProductPrice/ProductPrice.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          Lists: obj,
          model: $scope.modelUpdate,
          event: ev,
          ProductVM: vm
        }
      });

    }

    //Update Product Price
    function UpdateProductPrice(o) {

      if (o.AmountFlag == 1) {
        o.Amount = o.ProductPrice;
        o.Percentage = 0;
      } else {
        o.Percentage = o.ProductPrice;
        o.Amount = 0;
      }
      var params = {
        Name: $scope.modelSearch.Name,
        CategoryId: $scope.modelSearch.CategoryId,
        ManufacturerId: $scope.modelSearch.ManufacturerId,
        StoreId: $scope.modelSearch.StoreId,
        VendorId: $scope.modelSearch.VendorId,
        WarehouseId: $scope.modelSearch.WarehouseId,
        ProductTypeId: $scope.modelSearch.ProductTypeId,
        Sku: $scope.modelSearch.Sku,
        Publish: $scope.modelSearch.Publish,
        Percentage: o.Percentage,
        Amount: o.Amount,
      }
      $http.get($rootScope.RoutePath + "product/UpdateProductPrice", {
        params: params
      }).success(function (data) {

        if (data.success == true) {

          $mdToast.show(
            $mdToast.simple()
              .textContent(data.message)
              .position('top right')
              .hideDelay(3000)
          );
          $scope.modelUpdate.CategoryId = '';
          $scope.modelUpdate.Percentage = '0';
          $scope.modelUpdate.Amount = '0';
          $scope.modelUpdate.ProductPrice = 0;
        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent(data.message)
              .position('top right')
              .hideDelay(3000)
          );
        }
        $mdDialog.hide();
        $scope.GetAllProductPanel();
      });
    }

    $scope.closeModel = function () {
      $mdDialog.hide();
    }

    //Publish/Unpublish
    $scope.PublishAllProduct = function (o, ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to ' + o + ' all Product?')
        .textContent('All Search Product Will be ' + o + '.')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');
      $mdDialog.show(confirm).then(function () {
        var UpdatePublish = false;
        if (o == 'Publish') {
          UpdatePublish = true;
        };
        var params = {
          Name: $scope.modelSearch.Name,
          CategoryId: $scope.modelSearch.CategoryId,
          ManufacturerId: $scope.modelSearch.ManufacturerId,
          StoreId: $scope.modelSearch.StoreId,
          VendorId: $scope.modelSearch.VendorId,
          WarehouseId: $scope.modelSearch.WarehouseId,
          ProductTypeId: $scope.modelSearch.ProductTypeId,
          Sku: $scope.modelSearch.Sku,
          Publish: $scope.modelSearch.Publish,
          UpdatePublish: UpdatePublish,

        }
        $http.get($rootScope.RoutePath + "product/UpdateProductPublish", {
          params: params
        }).success(function (data) {
          if (data.success == true) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );

          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
            );
          }
          $scope.GetAllProductPanel(true);
        });
      }, function () {

      });
    }

    //Import/Export
    $scope.DownloadExcelTemplate = function () {
      window.location = $rootScope.RoutePath + "product/DownloadExcelTemplate";
    }

    //Export Product
    $scope.ExportProducts = function () {
      window.location = $rootScope.RoutePath + "product/ExportProducts?SearchExport=All";
    }

    //Export Unpublish Product
    $scope.ExportUnPublishProducts = function () {
      window.location = $rootScope.RoutePath + "product/ExportProducts?SearchExport=UnPublish";
    }

    //Import
    $scope.ShowImportProductModal = function (ev) {
      $mdDialog.show({
        controller: 'ImportProductsController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/ImportProducts/ImportProductsModel.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          Tasks: [],
          event: ev,
          Obj: vm,
        }
      })

    }

    $scope.toggle = function () {
      //$scope.Reset()
      if (!$scope.flgforIcon) {
        $scope.flgforIcon = true;
      } else {
        $scope.flgforIcon = false;
      }

      $(function () {
        $(".showBtn").toggleClass("active");
        $(".ShowContentBox").slideToggle();
      });
    };

    $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
      //$scope.lstdata = [];
      vm.dtColumnDefs = [
        DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml).withOption('width', '4%').withOption('class', 'text-center'),
        DTColumnBuilder.newColumn('ProductTypeId').notSortable().renderWith(TypeHtml).withOption('class', 'text-center'),
        DTColumnBuilder.newColumn('Name').withOption('class', 'text-center'),
        DTColumnBuilder.newColumn('Sku').withOption('responsivePriority', 1).withOption('class', 'text-center'),
        DTColumnBuilder.newColumn('Price').renderWith(DecimalHtml).withOption('class', 'text-center'),
        // DTColumnBuilder.newColumn('OldPrice').renderWith(DecimalHtml).withOption('class', 'text-right'),

        DTColumnBuilder.newColumn(null).notSortable().renderWith(publishHtml).withOption('class', 'text-center'),
        DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
      ];

      // ShowTrackNumberModal
      vm.dtOptions1 = DTOptionsBuilder.newOptions().withOption('ajax', {
        url: $rootScope.RoutePath + "product/GetAllProduct",

        data: function (d) {
          d.search.value = $scope.Search;
          d.Name = $scope.modelSearch.Name;
          d.CategoryId = $scope.modelSearch.CategoryId;
          d.ManufacturerId = $scope.modelSearch.ManufacturerId;
          d.StoreId = $scope.modelSearch.StoreId;
          d.VendorId = $scope.modelSearch.VendorId;
          d.WarehouseId = $scope.modelSearch.WarehouseId;
          d.ProductTypeId = $scope.modelSearch.ProductTypeId;
          d.Sku = $scope.modelSearch.Sku;
          d.Published = $scope.modelSearch.Publish;

          return d;
        },
        type: "get",
        dataSrc: function (json) {

          $scope.lstdata = json.data;
          $scope.TotalProducts = json.recordsTotal;
          return json.data;
        },
      })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('simple') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(25) // Page size
        .withOption('aaSorting', [2, 'asc'])
        .withOption('responsive', true)
        .withOption('autoWidth', true)
        .withOption('createdRow', createdRow)
        .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
        .withOption('scrollY', 'auto');
    });

    $scope.dtInstance = {};

    $scope.reloadData = function () { }

    function callback(json) { }

    $scope.GetSerch = function (Search) {
      $scope.Search = Search;
      GetAllProductPanelmodal(true);
      $scope.GetAllProductPanel(true);
    }
    $scope.GetAllProductPanel = function (IsUpdate) {
      var resetPaging = false;
      if (IsUpdate == true) {
        resetPaging = true;
      };
      $scope.dtInstance.reloadData(callback, resetPaging);
      $('#Producttable').dataTable()._fnPageChange(0);
      $('#Producttable').dataTable()._fnAjaxUpdate();

    }

    function GetAllProductPanelmodal(IsUpdate) {
      var resetPaging = false;
      if (IsUpdate == true) {
        resetPaging = true;
      };
      $scope.dtInstance.reloadData(callback, resetPaging);
      $('#Producttable').dataTable()._fnAjaxUpdate(0);
      console.log('Heloooooo')
    }

    function ImageHtml(data, type, full, meta) {
      var img = '';
      if (full.product_picture_mappings.length > 0) {
        img = '<img ng-src="' + $rootScope.RoutePath + 'MediaUploads/' + full.product_picture_mappings[0].tblmediamgmt.FileName + '" err-src="assets/images/prod-no-img-new.png" height="50px" width="50px">';

      } else if (full.product_picture_mappings.length == 0) {
        img = '<img ng-src="assets/images/prod-no-img-new.png" height="50px" width="50px">';
      }
      return img;
    }

    function publishHtml(data, type, full, meta) {
      var publish = '';
      if (full.Published == true) {
        publish = '<span  style="font-size: 20px;color: green"> &#x2714;</span>';
      } else {
        publish = '<span style="font-size: 20px;color: red">&#x2716;</span>';
      }
      return publish;
    }

    function SellingProductHtml(data, type, full, meta) {
      var Product = '';
      if (full.IsHotSelling == true) {
        Product = '<md-button  style="font-size: 20px;color: green" ng-click="UpdateSellingProductById(' + full.Id + ',0)"> &#x2714;<md-tooltip md-visible="" md-direction="">Disable</md-tooltip></md-button>';
      } else {
        Product = '<md-button style="font-size: 20px;color: red" ng-click="UpdateSellingProductById(' + full.Id + ',1)">&#x2716;<md-tooltip md-visible="" md-direction="">Enable</md-tooltip></md-button>';
      }
      return Product;
    }


    function TypeHtml(data, type, full, meta) {
      var Type = '';
      if (data > 0) {
        Type = '<span> ' + full.tblappinfo.AppName + '</span>';
      }
      return Type;
    }

    function createdRow(row, data, dataIndex) {
      $compile(angular.element(row).contents())($scope);
    }

    function NumberHtml(data, type, full, meta) {
      return (meta.row + 1);
    }

    function actionsHtml(data, type, full, meta) {
      var btn = '<div layout="row" layout-align="center center">';
      // if ($rootScope.FlgModifiedAccess) {

      //     btn += '<md-button class="edit-button md-icon-button"  ng-click="GoToPreview(' + full.Id + ')">' +
      //         '<md-icon md-font-icon="icon-clipboard-text"  class="s18  green-500-fg"></md-icon>' +
      //         '<md-tooltip md-visible="" md-direction="">Review Product</md-tooltip>' +
      //         '</md-button>';
      // }
      if ($rootScope.FlgModifiedAccess) {
        btn += '<md-button class="edit-button md-icon-button"  ng-click="FetchProductById(' + full.Id + ')">' +
          '<md-icon md-font-icon="icon-pencil"  class="s18  green-500-fg"></md-icon>' +
          '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
          '</md-button>';
      }
      if ($rootScope.FlgModifiedAccess) {
        btn += '<md-button class="edit-button md-icon-button" ng-click="DeleteProductPanel(' + full.Id + ')">' +
          '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
          '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
          '</md-button>';

      }
      btn += '</div>';
      return btn;
    }

    function DecimalHtml(data, type, full, meta) {
      if (data != null && data != undefined && data != '') {
        var numberFilter = $filter('number');
        var filteredInput = numberFilter(data, 2);
        return $rootScope.CurrencyCode + " " + filteredInput.toString();
        // return parseFloat(Math.round(data * 100) / 100).toFixed(2);
      } else {
        return $rootScope.CurrencyCode + " 0.00";
      }
    }



    vm.dt3ColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];

    vm.dt4ColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1).notSortable(),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3).notSortable(),
    ];

    // vm.dt5ColumnDefs = [
    //     DTColumnDefBuilder.newColumnDef(0),
    //     DTColumnDefBuilder.newColumnDef(1).notSortable(),
    //     DTColumnDefBuilder.newColumnDef(2),
    //     DTColumnDefBuilder.newColumnDef(3),
    //     DTColumnDefBuilder.newColumnDef(4).notSortable()
    // ];

    vm.dt7ColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4),
      DTColumnDefBuilder.newColumnDef(5),
      DTColumnDefBuilder.newColumnDef(6).notSortable()
    ];

    vm.dt8ColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      // DTColumnDefBuilder.newColumnDef(3),
      // DTColumnDefBuilder.newColumnDef(4),
      // DTColumnDefBuilder.newColumnDef(5),
      // DTColumnDefBuilder.newColumnDef(6),
      DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];


    $scope.dtInstance = {};
    $scope.dtOptionsRePro = {
      dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs: [{
        // Target the id column
        targets: 0,
        filterable: false,
        sortable: false,
        width: '10%'
      }, {
        // Target the name column
        targets: 1,
        filterable: true,
        sortable: false,
        width: '20%'
      }, {
        // Target the title column
        targets: 2,
        filterable: true,
        sortable: true,
        width: '20%'
      }, {
        // Target the image column
        targets: 3,
        filterable: false,
        sortable: true,
        width: '20%'
      }, {
        // Target the actions column
        targets: 4,
        responsivePriority: 1,
        filterable: false,
        sortable: false,
        width: '10%'
      }],

      pagingType: 'simple',
      lengthMenu: [10, 20, 30, 50, 100],
      pageLength: 20,
      scrollY: 'auto',
      responsive: true
    };

    $scope.dtOptionsProdAtt = {
      dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs: [{
        // Target the id column
        targets: 0,
        filterable: false,
        sortable: false,
        width: '10%'
      }, {
        // Target the name column
        targets: 1,
        filterable: true,
        sortable: true,
        width: '10%'
      }, {
        // Target the image column
        targets: 2,
        filterable: false,
        sortable: true,
        width: '10%'
      }, {
        // Target the image column
        targets: 3,
        filterable: false,
        sortable: true,
        width: '10%'
      }, {
        // Target the image column
        targets: 4,
        filterable: false,
        sortable: true,
        width: '10%'
      }, {
        // Target the image column
        targets: 5,
        filterable: false,
        sortable: true,
        width: '10%'
      }, {
        // Target the actions column
        targets: 6,
        responsivePriority: 1,
        filterable: false,
        sortable: false,
        width: '10%'
      }],

      pagingType: 'simple',
      lengthMenu: [10, 20, 30, 50, 100],
      pageLength: 20,
      scrollY: 'auto',
      responsive: true
    };

    $scope.dtOptionsPic = {
      dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs: [{
        // Target the id column
        targets: 0,
        filterable: false,
        sortable: false,
        width: '10%'
      }, {
        // Target the name column
        targets: 1,
        filterable: true,
        sortable: false,
        width: '20%'
      }, {
        // Target the title column
        targets: 2,
        filterable: true,
        sortable: true,
        width: '20%'
      }, {
        // Target the actions column
        targets: 3,
        responsivePriority: 1,
        filterable: false,
        sortable: false,
        width: '10%'
      }],

      pagingType: 'simple',
      lengthMenu: [10, 20, 30, 50, 100],
      pageLength: 20,
      scrollY: 'auto',
      responsive: true
    };

    // $scope.ProductDeatil = function(Id) {
    //     // $window.location.href = '/productdetail/' + Id;
    //     $state.go('app.productdetail', { 'Id': Id });
    // }

    // vm.helloText = SampleData.data.helloText;

    // Methods

    //////////


    //----------Product Attribute--------------

    vm.GetAllProductProductAttributeValue = GetAllProductProductAttributeValue;

    //Get ProductAttributeValue for CountLength
    function GetAllProductProductAttributeValue() {
      $http.get($rootScope.RoutePath + "productAttributeMapping/GetAllProductAttributeMappingByProductId?idProduct=" + $scope.model.Id).success(function (data) {
        if (data.length > 0) {
          $scope.listProductAttribute = data;
        } else {
          $scope.listProductAttribute = null;
        }


      });
    }

    $scope.ViewEditValue = function (ev, o) {
      var params = {
        ProductAttributeMappingId: o.Id,
        ProductId: o.ProductId,
        Name: o.productattribute.Name
        //lstProductAttributeValue: o.productattributevalues
      };

      $mdDialog.show({
        controller: 'ProductAttributeValueModelController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/ProductAttributeValue/ProductAttributeValueModel.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          ProductAttributeobj: params,
          Tasks: [],
          event: ev,
          ProductAttributeVM: vm
        }
      })
    }

    $scope.OpenModel = function (ev) {

      // var obj = {
      //     lstRoles: $scope.lstRoles,
      // }
      // $mdDialog.show({
      //     controller: 'ImportModelController',
      //     controllerAs: 'vm',
      //     templateUrl: 'app/main/Product/dialogs/ImportModel/ImportModel.html',
      //     parent: angular.element($document.body),
      //     targetEvent: ev,
      //     clickOutsideToClose: true,
      //     locals: {
      //         List: obj,
      //         ProdAttrCombi_ProductId: $scope.model.Id,
      //         event: ev,

      //         ProductVM: vm
      //     }
      // });

      var obj = {
        lstRoles: $scope.lstRoles,
      }
      $mdDialog.show({
        controller: 'ImportModelController',
        controllerAs: 'vm',
        templateUrl: 'app/main/Product/dialogs/ImportModel/ImportModel.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          Lists: obj,
          ProdAttrCombi_ProductId: $scope.model.Id,
          event: ev,
          model: $scope.modelImport,
          ProductVM: vm
        }
      })
    }
    // $scope.GetAllProductPanel = function(IsUpdate) {
    //     var resetPaging = false;
    //     if (IsUpdate == true) {
    //         resetPaging = true;
    //     };
    //     $scope.dtInstance.reloadData(callback, resetPaging);
    //     $('#Producttable').dataTable()._fnAjaxUpdate();
    // }
    // $scope.GetAllProductPanel = function(IsUpdate) {
    //     var resetPaging = false;
    //     if (IsUpdate == true) {
    //         resetPaging = true;
    //     };

    //     $scope.dtInstance.reloadData(callback, resetPaging);
    //     $('#Producttable').dataTable()._fnAjaxUpdate();
    // }
    $scope.ResetSearch = function () {
      $scope.modelSearch = {
        Name: '',
        CategoryId: '',
        ManufacturerId: '',
        StoreId: '',
        VendorId: 0,
        WarehouseId: 0,
        ProductTypeId: '',
        Sku: '',
        Publish: '1',
      };
      GetAllProductPanelmodal(true);
      $scope.GetAllProductPanel(true);
    }
    $scope.Vendor = function () {

      if ($scope.model.ProductTypeId == 1 || $scope.model.ProductTypeId == 2) {
        $scope.showvendor = 1;
      } else {
        $scope.showvendor = 0;

      }

    }
    $scope.AllProduct = function () {
      $scope.PageNo = 1;
      $scope.productFlg = 0;
      $scope.showvendor = 0;
      $scope.Search = '';
      // $scope.productCopyFlg = 0;
      $scope.flgShowProductAttributeCombination = 1;
      $scope.initSearchModel();
      $scope.initModel();
      $scope.initPictureModel();
      $scope.initCategoryModel();
      //$scope.initManufacturerModel();
      $scope.initProductSpecificationAttributesModel();
      $scope.initProductAttributeModel();
      $scope.initProductAttributeCombinationsModel();
      $scope.inittirepriceModel();
      $scope.initRelatedProductModel();
      $scope.initCrossSellProductModel();
    }

    $scope.AllProduct = function () {
      $scope.PageNo = 1;
      $scope.productFlg = 0;
      $scope.showvendor = 0;
      $scope.Search = '';
      // $scope.productCopyFlg = 0;
      $scope.flgShowProductAttributeCombination = 1;
      $scope.initSearchModel();
      $scope.initModel();
      $scope.initPictureModel();
      $scope.initCategoryModel();
      //$scope.initManufacturerModel();
      $scope.initProductSpecificationAttributesModel();
      $scope.initProductAttributeModel();
      $scope.initProductAttributeCombinationsModel();
      $scope.inittirepriceModel();
      $scope.initRelatedProductModel();
      $scope.initCrossSellProductModel();
    }

  }

})();
