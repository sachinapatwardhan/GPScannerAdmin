(function() {
    'use strict';

    angular
        .module('app.MobileWidget')
        .controller('ImageModelMobileWidgetController', ImageModelMobileWidgetController);

    /** @ngInject */
    function ImageModelMobileWidgetController($http, $mdDialog, $scope, objMedia, Tasks, event, MediaVM,$rootScope) {
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
