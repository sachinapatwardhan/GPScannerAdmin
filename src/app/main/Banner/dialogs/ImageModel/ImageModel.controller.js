(function() {
    'use strict';

    angular
        .module('app.Banner')
        .controller('BannerImageModelController', BannerImageModelController);

    /** @ngInject */
    function BannerImageModelController($http, $mdDialog, $scope, objMedia, Tasks, event, MediaVM, $rootScope) {
        var vm = this;

        MediaVM.GetAllMedia = GetAllMedia();

        $scope.task = Tasks;
        $scope.RoutePath = $rootScope.RoutePath;

        function GetAllMedia() {
            $http.get($rootScope.RoutePath + "media/GetAllMedia").then(function(data) {
                $scope.lstMedia = data.data;
            });
        }

        $scope.SelectImage = function(o) {
            MediaVM.SelectImage(o);
        }

        $scope.SelectObjImage = function(o) {
            MediaVM.SelectObjImage(o);
        }


        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();
