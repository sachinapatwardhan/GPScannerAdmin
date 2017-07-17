(function() {
    'use strict';

    angular
         .module('app.stickyfooter')
        .controller('ImageModelStickyFooterController', ImageModelStickyFooterController);

    /** @ngInject */
    function ImageModelStickyFooterController($http,$rootScope, $mdDialog, $scope, objMedia, Tasks, event, MediaVM) {
        var vm = this;

        MediaVM.GetAllMedia = GetAllMedia();

        $scope.RoutePath = $rootScope.RoutePath;

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
