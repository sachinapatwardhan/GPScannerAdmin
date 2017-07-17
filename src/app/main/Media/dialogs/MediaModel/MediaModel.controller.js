(function() {
    'use strict';

    angular
        .module('app.media')
        .controller('MediaModelController', MediaModelController);

    /** @ngInject */
    function MediaModelController($mdDialog, $rootScope, $scope, $http, $mdToast, objMedia, Tasks, event, MediaVM, $cookieStore) {
        var vm = this;

        $scope.model = {
            id: objMedia.id,
            Name: objMedia.Name,
            Description: objMedia.Description,
            FileName: objMedia.FileName,
            Author: objMedia.Author,
            Caption: objMedia.Caption,
            AltText: objMedia.AltText
        }


        $scope.SaveMedia = function(o) {

            $http.post($rootScope.RoutePath + "media/UpdateMedia", o).then(function(data) {
                if (data.data.success == false) {
                    if (data.data.data == 'TOKEN') {

                        $rootScope.logout();
                    }
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                MediaVM.GetAllMedia();
                $mdDialog.hide();
            });

        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();