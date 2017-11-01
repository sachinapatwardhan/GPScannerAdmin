(function() {
    'use strict';

    angular
        .module('app.Trackers')
        .controller('AppTypeCtrl', AppTypeCtrl);

    /** @ngInject */
    function AppTypeCtrl($http, $mdDialog, $scope, $rootScope, $mdToast, search) {
        var vm = this;
        vm.searchTermDeviceId = '';
        $scope.init = function() {
            $scope.idUser = $rootScope.UserId;
            $scope.AppName = '';
            $scope.GetAllAppType();
            $scope.Search = search;
        };
        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.GetAllAppType = function(idUser) {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppinfo = data.data;
            });
        }

        $scope.clearSearchTerm = function() {
            vm.searchTermDeviceId = '';
        };
        $scope.Reset = function() {
            $mdDialog.hide();
        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.ResetModel = function() {
            $scope.AppName = '';
        }
        $scope.Export = function(AppName) {
            console.log(AppName)
            var UserId = '';
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            if ($rootScope.UserRoles == 'Sales Agent') {
                UserId = $rootScope.UserId;
            }
            window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset + "&AppName=" + AppName;
            $mdDialog.hide();
        }
        $scope.init();
    }


})();