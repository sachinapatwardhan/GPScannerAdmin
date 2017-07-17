(function() {
    'use strict';

    angular
        .module('app.Language')
        .controller('ImageModelLanguageController', ImageModelLanguageController);

    /** @ngInject */
    function ImageModelLanguageController($http, $mdDialog, $scope, objMedia, Tasks, event, MediaVM, $rootScope) {
        var vm = this;

        MediaVM.GetAllMedia = GetAllMedia();

        $scope.RoutePath = $rootScope.RoutePath;

        console.log($scope.RoutePath);

        function GetAllMedia() {
            $http.get($rootScope.RoutePath + "media/GetAllMedia").then(function(data) {
                $scope.lstMedia = data.data;
            });
        }

        $scope.SelectImage = function(o) {
            MediaVM.SelectImage(o);
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();
