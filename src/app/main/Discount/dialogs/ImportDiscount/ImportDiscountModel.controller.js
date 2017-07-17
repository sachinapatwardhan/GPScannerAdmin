(function() {
    'use strict';

    angular
        .module('app.discount')
        .controller('ImportDiscountController', ImportDiscountController);

    /** @ngInject */
    function ImportDiscountController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder, objdiscountdata) {
        var vm = this;


        $scope.Import = function(LanguageId) {

            var formData = new FormData();
            angular.forEach($scope.Mediafiles1, function(obj) {
                formData.append('files[]', obj.lfFile);
            });

            $http.post($rootScope.RoutePath + "discount/ImportDiscount", formData, {
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
                    objdiscountdata.GetAllDiscountFromModal();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(5000)
                    );
                }
            });
        }

        $scope.closeModel = function() {
            $scope.apiReset.removeAll();
            $mdDialog.hide();
        }

        $scope.Reset = function() {
            $scope.apiReset.removeAll()
        }
    }
})();
