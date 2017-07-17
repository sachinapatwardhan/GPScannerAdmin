(function() {
    'use strict';

    angular
        .module('app.Setting')
        .controller('SettingController', SettingController);

    /** @ngInject */
    function SettingController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                // StoreId: 0,
                // PriceInTax: false,
                // SelectTaxDisplayType: false,
                // TaxDisplyType: 'Excluding Tax',
                // DisplayTaxSuffix: false,
                // DisplayAllApplyTaxRate: false,
                // HideZeroTax: false,
                // TaxExculsionFromSubTotal: false,
                // TaxBasedOn: 'Billing',
                // Country: '',
                // State: '',
                // ZipCode: '',
                // PaymentMethodAdditFeeTaxAble: false,
                // PaymentMethodAdditFeeIncludeTax: false,
                // PaymentMethodAdditFeeTaxClass: '',
                // GSTEnable: false,
                // GSTInPrice: false,
                // GSTPercentage: '',
                AndroidAppVersion: '',
                IosAppVersion: '',
                OwnerAndroidAppVersion: '',
                OwnerIosAppVersion: '',
                OwnerDeviceStatusPushNotification: '',
                OwnerVibrationPushNotification: '',
                OwnerMaxSpeedPushNotification: '',
                NotificationEmailTo: '',
            };
            // $scope.GetCountry();
            // $scope.GetAllTaxCategory();
            $scope.GetAllSetting();

            // $scope.GetAllTaxSetting();
        }

        // $scope.GetCountry = function() {
        //     $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(response) {
        //         $scope.lstcountry = response.data;
        //     });
        // }

        // $scope.GetAllStateByCountryId = function(id) {
        //     $scope.model.State = '';
        //     $scope.lststate = [];
        //     $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId?CountryId=" + id).then(function(response) {
        //         if (response.data.success == true) {
        //             $scope.lststate = response.data.data;
        //         } else {
        //             $scope.lststate = [];
        //         }
        //     });
        // }

        // $scope.GetAllTaxCategory = function() {
        //     $http.get($rootScope.RoutePath + "taxcategory/GetAllTaxCategory").then(function(response) {
        //         $scope.lstTaxCategory = response.data;
        //     });
        // }

        // $scope.GetAllTaxSetting = function() {
        //     $http.get($rootScope.RoutePath + "settings/GetAllTaxSetting").then(function(response) {
        //         // $scope.lstTaxSettings = response.data;
        //         // PriceInTax
        //         var objPriceInTax = _.findWhere(response.data, { Name: "PriceInTax" });
        //         if (objPriceInTax != null && objPriceInTax != undefined && objPriceInTax != '') {
        //             if (objPriceInTax.Value == 1) {
        //                 $scope.model.PriceInTax = true;
        //             } else {
        //                 $scope.model.PriceInTax = false;
        //             }
        //         }

        //         // SelectTaxDisplayType
        //         var objSelectTaxDisplayType = _.findWhere(response.data, { Name: "SelectTaxDisplayType" });
        //         if (objSelectTaxDisplayType != null && objSelectTaxDisplayType != undefined && objSelectTaxDisplayType != '') {
        //             if (objSelectTaxDisplayType.Value == 1) {
        //                 $scope.model.SelectTaxDisplayType = true;
        //             } else {
        //                 $scope.model.SelectTaxDisplayType = false;
        //             }
        //         }

        //         // TaxDisplyType
        //         var objTaxDisplyType = _.findWhere(response.data, { Name: "TaxDisplyType" });
        //         if (objTaxDisplyType != null && objTaxDisplyType != undefined && objTaxDisplyType != '') {
        //             $scope.model.TaxDisplyType = objTaxDisplyType.Value;
        //         }

        //         //objDisplayTaxSuffix
        //         var objDisplayTaxSuffix = _.findWhere(response.data, { Name: "DisplayTaxSuffix" });
        //         if (objDisplayTaxSuffix != null && objDisplayTaxSuffix != undefined && objDisplayTaxSuffix != '') {
        //             if (objDisplayTaxSuffix.Value == 1) {
        //                 $scope.model.DisplayTaxSuffix = true;
        //             } else {
        //                 $scope.model.DisplayTaxSuffix = false;
        //             }
        //         }

        //         //DisplayAllApplyTaxRate
        //         var objDisplayAllApplyTaxRate = _.findWhere(response.data, { Name: "DisplayAllApplyTaxRate" });
        //         if (objDisplayAllApplyTaxRate != null && objDisplayAllApplyTaxRate != undefined && objDisplayAllApplyTaxRate != '') {
        //             if (objDisplayAllApplyTaxRate.Value == 1) {
        //                 $scope.model.DisplayAllApplyTaxRate = true;
        //             } else {
        //                 $scope.model.DisplayAllApplyTaxRate = false;
        //             }
        //         }

        //         //HideZeroTax
        //         var objHideZeroTax = _.findWhere(response.data, { Name: "HideZeroTax" });
        //         if (objHideZeroTax != null && objHideZeroTax != undefined && objHideZeroTax != '') {
        //             if (objHideZeroTax.Value == 1) {
        //                 $scope.model.HideZeroTax = true;
        //             } else {
        //                 $scope.model.HideZeroTax = false;
        //             }
        //         }

        //         //TaxExculsionFromSubTotal
        //         var objTaxExculsionFromSubTotal = _.findWhere(response.data, { Name: "TaxExculsionFromSubTotal" });
        //         if (objTaxExculsionFromSubTotal != null && objTaxExculsionFromSubTotal != undefined && objTaxExculsionFromSubTotal != '') {
        //             if (objTaxExculsionFromSubTotal.Value == 1) {
        //                 $scope.model.TaxExculsionFromSubTotal = true;
        //             } else {
        //                 $scope.model.TaxExculsionFromSubTotal = false;
        //             }
        //         }

        //         //TaxBasedOn
        //         var objTaxBasedOn = _.findWhere(response.data, { Name: "TaxBasedOn" });
        //         if (objTaxBasedOn != null && objTaxBasedOn != undefined && objTaxBasedOn != '') {
        //             $scope.model.TaxBasedOn = objTaxBasedOn.Value;
        //         }

        //         //Country
        //         var objCountry = _.findWhere(response.data, { Name: "Country" });
        //         if (objCountry != null && objCountry != undefined && objCountry != '') {
        //             $scope.model.Country = objCountry.Value;
        //             if ($scope.model.Country != null && $scope.model.Country != undefined && $scope.model.Country != '') {
        //                 $scope.GetAllStateByCountryId($scope.model.Country);
        //             }
        //         }

        //         //State
        //         var objState = _.findWhere(response.data, { Name: "State" });
        //         if (objState != null && objState != undefined && objState != '') {
        //             $scope.model.State = objState.Value;
        //         }

        //         //ZipCode
        //         var objZipCode = _.findWhere(response.data, { Name: "ZipCode" });
        //         if (objZipCode != null && objZipCode != undefined && objZipCode != '') {
        //             $scope.model.ZipCode = objZipCode.Value;
        //         }

        //         //PaymentMethodAdditFeeTaxAble
        //         var objPaymentMethodAdditFeeTaxAble = _.findWhere(response.data, { Name: "PaymentMethodAdditFeeTaxAble" });
        //         if (objPaymentMethodAdditFeeTaxAble != null && objPaymentMethodAdditFeeTaxAble != undefined && objPaymentMethodAdditFeeTaxAble != '') {
        //             if (objPaymentMethodAdditFeeTaxAble.Value == 1) {
        //                 $scope.model.PaymentMethodAdditFeeTaxAble = true;
        //             } else {
        //                 $scope.model.PaymentMethodAdditFeeTaxAble = false;
        //             }
        //         }

        //         //PaymentMethodAdditFeeIncludeTax
        //         var objPaymentMethodAdditFeeIncludeTax = _.findWhere(response.data, { Name: "PaymentMethodAdditFeeIncludeTax" });
        //         if (objPaymentMethodAdditFeeIncludeTax != null && objPaymentMethodAdditFeeIncludeTax != undefined && objPaymentMethodAdditFeeIncludeTax != '') {
        //             if (objPaymentMethodAdditFeeIncludeTax.Value == 1) {
        //                 $scope.model.PaymentMethodAdditFeeIncludeTax = true;
        //             } else {
        //                 $scope.model.PaymentMethodAdditFeeIncludeTax = false;
        //             }
        //         }

        //         //objPaymentMethodAdditFeeTaxClass
        //         var objPaymentMethodAdditFeeTaxClass = _.findWhere(response.data, { Name: "PaymentMethodAdditFeeTaxClass" });
        //         if (objPaymentMethodAdditFeeTaxClass != null && objPaymentMethodAdditFeeTaxClass != undefined && objPaymentMethodAdditFeeTaxClass != '') {
        //             $scope.model.PaymentMethodAdditFeeTaxClass = objPaymentMethodAdditFeeTaxClass.Value;
        //         }

        //         //GSTEnable
        //         var objGSTEnable = _.findWhere(response.data, { Name: "GSTEnable" });
        //         if (objGSTEnable != null && objGSTEnable != undefined && objGSTEnable != '') {
        //             if (objGSTEnable.Value == 1) {
        //                 $scope.model.GSTEnable = true;
        //             } else {
        //                 $scope.model.GSTEnable = false;
        //             }
        //         }
        //         //GSTInPrice
        //         var objGSTInPrice = _.findWhere(response.data, { Name: "GSTInPrice" });
        //         if (objGSTInPrice != null && objGSTInPrice != undefined && objGSTInPrice != '') {
        //             if (objGSTInPrice.Value == 1) {
        //                 $scope.model.GSTInPrice = true;
        //             } else {
        //                 $scope.model.GSTInPrice = false;
        //             }
        //         }

        //         //objGSTPercentage
        //         var objGSTPercentage = _.findWhere(response.data, { Name: "GSTPercentage" });
        //         if (objGSTPercentage != null && objGSTPercentage != undefined && objGSTPercentage != '') {
        //             $scope.model.GSTPercentage = objGSTPercentage.Value;
        //         }
        //     });
        // }

        $scope.GetAllSetting = function() {
            $http.get($rootScope.RoutePath + "settings/GetAllTaxSetting").then(function(response) {
                // $scope.lstSettings = response.data;
                var objAndroidAppVersion = _.findWhere(response.data, { Name: "AndroidAppVersion" });
                if (objAndroidAppVersion != null && objAndroidAppVersion != undefined && objAndroidAppVersion != '') {
                    $scope.model.AndroidAppVersion = objAndroidAppVersion.Value;
                }
                var objIosAppVersion = _.findWhere(response.data, { Name: "IosAppVersion" });
                if (objIosAppVersion != null && objIosAppVersion != undefined && objIosAppVersion != '') {
                    $scope.model.IosAppVersion = objIosAppVersion.Value;
                }
                var objOwnerAndroidAppVersion = _.findWhere(response.data, { Name: "AndroidAppVersionOwner" });
                if (objOwnerAndroidAppVersion != null && objOwnerAndroidAppVersion != undefined && objOwnerAndroidAppVersion != '') {
                    $scope.model.OwnerAndroidAppVersion = objOwnerAndroidAppVersion.Value;
                }
                var objOwnerIosAppVersion = _.findWhere(response.data, { Name: "IosAppVersionOwner" });
                if (objOwnerIosAppVersion != null && objOwnerIosAppVersion != undefined && objOwnerIosAppVersion != '') {
                    $scope.model.OwnerIosAppVersion = objOwnerIosAppVersion.Value;
                }
                var objOwnerDeviceStatusPushNotification = _.findWhere(response.data, { Name: "OwnerDeviceStatusPushNotification" });
                if (objOwnerDeviceStatusPushNotification != null && objOwnerDeviceStatusPushNotification != undefined && objOwnerDeviceStatusPushNotification != '') {
                    $scope.model.OwnerDeviceStatusPushNotification = objOwnerDeviceStatusPushNotification.Value;
                }
                var objOwnerVibrationPushNotification = _.findWhere(response.data, { Name: "OwnerVibrationPushNotification" });
                if (objOwnerVibrationPushNotification != null && objOwnerVibrationPushNotification != undefined && objOwnerVibrationPushNotification != '') {
                    $scope.model.OwnerVibrationPushNotification = objOwnerVibrationPushNotification.Value;
                }
                var objOwnerMaxSpeedPushNotification = _.findWhere(response.data, { Name: "OwnerMaxSpeedPushNotification" });
                if (objOwnerMaxSpeedPushNotification != null && objOwnerMaxSpeedPushNotification != undefined && objOwnerMaxSpeedPushNotification != '') {
                    $scope.model.OwnerMaxSpeedPushNotification = objOwnerMaxSpeedPushNotification.Value;
                }

                var NotificationEmailTo = _.findWhere(response.data, { Name: "NotificationEmailTo" });
                if (NotificationEmailTo != null && NotificationEmailTo != undefined && NotificationEmailTo != '') {
                    $scope.model.NotificationEmailTo = NotificationEmailTo.Value;
                }
            });
        }

        $scope.SaveSetting = function(o) {
            $scope.lstSetting = [];

            for (var name in o) {
                var obj = new Object();
                obj["Name"] = name;
                obj["Value"] = o[name];
                $scope.lstSetting.push(obj);
            }
            $http.post($rootScope.RoutePath + "settings/SaveTaxSetting", $scope.lstSetting).then(function(response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.init();
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        $scope.Reset = function() {
            $scope.init();
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }
})();