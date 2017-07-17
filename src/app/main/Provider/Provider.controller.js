(function () {
    'use strict';

    angular
        .module('app.Provider')
        .controller('ProviderController', ProviderController);

    // function DialogController($http, $scope, $mdToast, $document, $mdDialog, $stateParams) {}

    /** @ngInject */
    function ProviderController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $timeout, $mdMedia, $rootScope) {
        var vm = this;

        $scope.init = function () {
            $scope.tab = { selectedIndex: 0 };

            $scope.FlgSystemNameCountry = false;
            $scope.FlgSystemNameFixed = false;

            $scope.GetTaxSettingByName();
        };

        $scope.GetTaxSettingByName = function () {
            $http.get($rootScope.RoutePath + "settings/GetTaxSettingByName?TaxSettingName=TaxProviderSystemName").then(function (response) {
                if (response.data.success == true) {

                    var Value = response.data.data.Value;

                    if (Value == "CountryStateZip") {

                        $scope.FlgSystemNameCountry = true;
                        $scope.FlgSystemNameFixed = false;

                    } else if (Value == "FixedRate") {

                        $scope.FlgSystemNameCountry = false;
                        $scope.FlgSystemNameFixed = true;
                    }
                } else {
                    $scope.FlgSystemNameCountry = false;
                    $scope.FlgSystemNameFixed = false;
                }
            });
        }

        $scope.SaveProviderSystemName = function (systemName) {
            $scope.lstSetting = [];
            var obj = new Object();
            obj["Name"] = "TaxProviderSystemName";
            obj["Value"] = systemName;
            $scope.lstSetting.push(obj);
            $http.post($rootScope.RoutePath + "settings/SaveTaxSetting", $scope.lstSetting).then(function (response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $timeout(function () {
                        $scope.init();
                    }, 500);
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

        $scope.EditFlg = 0;
        $scope.SetEditFlg = function (Id) {
            $scope.EditFlg = Id;
        }

        $scope.CancelUpdate = function () {
            $scope.EditFlg = 0;
            $scope.GetAllTaxCategory();
        }

        // TaxCategoryFixedRate.3
        $scope.GetAllTaxCategory = function () {
            $scope.tab = { selectedIndex: 1 };
            $scope.EditFlg = 0;

            $http.get($rootScope.RoutePath + "taxrate/GetDataFromSetting").then(function (response) {
                if (response.data.success == true) {
                    $scope.LstTaxCategory = response.data.data;
                } else {
                    $scope.LstTaxCategory = [];
                }
            });

        }

        $scope.SaveTaxCategoryFixedRate = function (Cid, Rate) {
            $scope.lstSetting = [];
            if (Rate == null || Rate == '' || Rate == undefined) {
                Rate = 0;
            }
            var obj = new Object();
            obj["Name"] = "TaxCategoryFixedRate." + Cid;
            obj["Value"] = Rate;
            $scope.lstSetting.push(obj);
            $http.post($rootScope.RoutePath + "settings/SaveTaxSetting", $scope.lstSetting).then(function (response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.EditFlg = 0;
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



        $scope.ShowModal = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ProviderModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Provider/dialogs/ProviderModel/ProviderModel.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    objMedia: "",
                    Tasks: [],
                    event: ev,
                    MediaVM: vm
                }
            });
        }

        $scope.closeModal = function () {
            $mdDialog.hide();
        };

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];


        $scope.Reset = function () {
            $scope.init();
        }

        $scope.init();
    }
})();
