(function() {
    'use strict';

    angular
        .module('app.LanguageResource')
        .controller('ImportLanguageResourcesController', ImportLanguageResourcesController);

    /** @ngInject */
    function ImportLanguageResourcesController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder, objLanguageResource) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                LanguageId: 0,
            };
            GetAllLanguage();
        }

        function GetAllLanguage() {
            $http.get($rootScope.RoutePath + "language/GetAllLanguage").then(function(data) {
                $scope.lstlanguage = data.data;
                if (data.data.length > 0) {
                    $scope.model.LanguageId = data.data[0].Id;
                }
            });
        }

        $scope.Import = function(LanguageId) {

            var formData = new FormData();
            angular.forEach($scope.Mediafiles1, function(obj) {
                formData.append('files[]', obj.lfFile);
                formData.append('LanguageId', LanguageId);
            });

            $http.post($rootScope.RoutePath + "languageresources/ImportExcel", formData, {
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
                    objLanguageResource.GetAllLanguageResourcesfromModal();
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
        $scope.init();
    }
})();
