(function() {
    'use strict';

    angular
        .module('app.AssignDevice')
        .controller('ImportAssignDeviceController', ImportAssignDeviceController);

    /** @ngInject */
    function ImportAssignDeviceController(
        $scope, $rootScope, $http, $cookieStore,
        $mdDialog, $mdToast) {
        var vm = this;

        //////////

        $scope.init = function() {
            $scope.model = {
                createdBy: $rootScope.UserName,
                appName: '',
            };

            $rootScope.UserRoles = $cookieStore.get('UserRoles');
            if ($rootScope.UserRoles.indexOf('Super Admin') !== -1) {
                $scope.canShow = true;
            } else {
                $scope.canShow = false;
            }

            $scope.getAllApps();
        };

        $scope.getAllApps = function() {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppInfo")
                .then(function(res) {
                    $scope.appNames = res.data;
                });
        };

        $scope.assign = function() {
            // Not possible but check first
            if ($scope.excelFiles.length !== 1) {
                return;
            }

            var formData = new FormData();
            formData.append('file', $scope.excelFiles[0].lfFile);
            formData.append('createdBy', $scope.model.createdBy);

            if ($scope.canShow) {
                formData.append('appName', $scope.model.appName);
            } else {
                formData.append('appName', $rootScope.appName);
            }

            $http.post($rootScope.RoutePath + "admin/assignDeviceByExcelNew", formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .then(function(res) {
                    if (res.data.success) {
                        $scope.materialFileApi.removeAll();
                        $mdDialog.hide(true);
                    }

                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(res.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                })
                .catch(function(err) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Unable to assign device. Please try again later.')
                        .position('top right')
                        .hideDelay(3000)
                    );
                });
        };

        $scope.clearSearchAppName = function() {
            $scope.searchAppName = '';
        };

        $scope.onSearchChange = function(e) {
            e.stopPropagation();
        };

        $scope.closeModal = function() {
            $scope.materialFileApi.removeAll();
            $mdDialog.hide();
        };

        $scope.reset = function() {
            $scope.materialFileApi.removeAll()
        };

        $scope.init();
    }
})();