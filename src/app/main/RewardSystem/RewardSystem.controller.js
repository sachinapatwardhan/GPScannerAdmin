(function () {
    'use strict';

    angular
        .module('app.rewardsystem')
        .controller('RewardSystemController', RewardSystemController);

    /** @ngInject */
    function RewardSystemController($http, $scope, $rootScope, $state, $cookieStore, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;

        $scope.init = function () {
            $scope.model = {
                Id: '',
                Enabled: false,
                ExchangeRate: null,
                MinimumRewardPointstoUse: null,
                PointsForRegistration: null,
                PointsForPurchases_Amount: null,
                PointsForPurchases_Points: null,
                PointsForPurchases_Awarded: false,
                PointsForPurchases_Canceled: false,
                DisplayHowMuchWillbeEarned: false,
                PointsAccumulatedForAllStores: false,

            };
            $scope.GetAllRewardSystem();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllRewardSystem = function () {
            // Data
            $http.get($rootScope.RoutePath + "settings/GetRewardPointSetting").then(function (data) {
                $scope.model.Id = data.data.data.Id;
                $scope.model.Enabled = data.data.data.Enabled;
                $scope.model.ExchangeRate = data.data.data.ExchangeRate;
                $scope.model.MinimumRewardPointstoUse = data.data.data.MinimumRewardPointstoUse;
                $scope.model.PointsForRegistration = data.data.data.PointsForRegistration;
                $scope.model.PointsForPurchases_Amount = data.data.data.PointsForPurchases_Amount;
                $scope.model.PointsForPurchases_Points = data.data.data.PointsForPurchases_Points;
                $scope.model.PointsForPurchases_Awarded = data.data.data.PointsForPurchases_Awarded;
                $scope.model.PointsForPurchases_Canceled = data.data.data.PointsForPurchases_Canceled;
                $scope.model.DisplayHowMuchWillbeEarned = data.data.data.DisplayHowMuchWillbeEarned;
                $scope.model.PointsAccumulatedForAllStores = data.data.data.PointsAccumulatedForAllStores;
            });
        }

        $scope.SaveRewardPointSetting = function (o, form) {
            $http.post($rootScope.RoutePath + "settings/SaveRewardPointSetting", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
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
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        };

        $scope.ResetEdit = function () {
            $scope.FormRewardSystem.$setPristine();
            $scope.FormRewardSystem.$setUntouched();
            $scope.model = {
                Id: '',
                Enabled: false,
                ExchangeRate: null,
                MinimumRewardPointstoUse: null,
                PointsForRegistration: null,
                PointsForPurchases_Amount: null,
                PointsForPurchases_Points: null,
                PointsForPurchases_Awarded: false,
                PointsForPurchases_Canceled: false,
                DisplayHowMuchWillbeEarned: false,
                PointsAccumulatedForAllStores: false,

            };
        }

        $scope.Reset = function () {
            $scope.init();
        }

        $scope.init();
    }

})();


