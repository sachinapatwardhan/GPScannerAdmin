(function() {
    'use strict';

    angular
        .module('app.MobileLanguageResource')
        .controller('ImportMobileLanguageResourceController', ImportMobileLanguageResourceController);

    /** @ngInject */
    function ImportMobileLanguageResourceController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, Obj) {
        var vm = this;

        $scope.Import = function() {
            console.log("call");
            var formData = new FormData();
            angular.forEach($scope.Productfiles, function(obj) {
                console.log(obj.lfFile);
                formData.append('files[]', obj.lfFile);
            });

            $http.post($rootScope.RoutePath + "languageResources/ImportMobileLanguageResource", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                console.log(response);
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();
                    Obj.GetAllLanguageResources(true);
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
