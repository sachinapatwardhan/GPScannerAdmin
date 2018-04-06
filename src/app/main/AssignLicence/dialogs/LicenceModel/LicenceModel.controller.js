(function() {
    'use strict';

    angular
        .module('app.AssignLicence')
        .controller('LicenceModelController', LicenceModelController);

    /** @ngInject */
    function LicenceModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, Tasks, event) {
        var vm = this;
        vm.searchTermidAppName = '';
        vm.FormLicence = {};
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $scope.model = {
                AppName: '',
                Pass: '',
                Length: '',
            }
            $scope.GetAllInfoList();
        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.ClearSearch = function() {
            vm.searchTermidAppName = '';
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.ResetData = function(form) {
            vm.FormLicence.$setUntouched();
            vm.FormLicence.$setPristine();
            $scope.model = {
                AppName: '',
                Pass: '',
                Length: '',
            }
        }
        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.CreateLicenceNumbers = function() {
            var AppName = _.findWhere($scope.lstAppInfo, { id: $scope.model.AppName }).AppName;
            var params = {
                AppName: AppName,
                Pass: $scope.model.Pass,
                Length: $scope.model.Length,
            }
            $http.get($rootScope.RoutePath + "licence/CreateLicenceNumbers", { params: params }).then(function(data) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                if (data.data.success) {
                    $scope.ResetData();
                }
            })
        }
        $scope.init();
    }
})();