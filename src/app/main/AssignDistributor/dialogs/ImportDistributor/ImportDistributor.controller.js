(function() {
    'use strict';

    angular
        .module('app.AssignDistributor')
        .controller('ImportDistributorController', ImportDistributorController);

    /** @ngInject */
    function ImportDistributorController($http, $mdDialog, $mdToast, $cookieStore, $scope, $rootScope, Tasks, event, Obj) {
        var vm = this;
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.AppName = localStorage.getItem('appName');
        vm.UserRoles = $rootScope.UserRoles[0];
        $scope.model = {
            idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
            AppName: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.AppName,
            idDistributor: '',

        }

        $scope.ChangeAppName = function() {
            $scope.model.AppName = _.findWhere($scope.lstAppInfo, { id: parseInt($scope.model.idApp) }).AppName;
            $scope.model.idDistributor = '';
            $scope.lstDistributor = [];
            $scope.GetAllDistributor();
        }
        $scope.GetAllDistributor = function() {
            var params = {
                idApp: $scope.model.idApp,
            }
            $http.get($rootScope.RoutePath + "assigndistributor/GetAllDistributor", { params: params }).then(function(data) {
                $scope.lstDistributor = data.data;
            });
        }
        $scope.GetAllDistributor();

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetAllInfoList();

        $scope.Import = function(o) {
            var formData = new FormData();
            angular.forEach($scope.Productfiles, function(obj1) {
                formData.append('files[]', obj1.lfFile);
                formData.append('idDistributor', $scope.model.idDistributor);
                formData.append('AppName', $scope.model.AppName);
            });
            $http.post($rootScope.RoutePath + "assigndistributor/uploadExcelDevice", formData, {
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
                    Obj.reloadtable();

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

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.closeModel = function() {
            $scope.model = {
                idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
                AppName: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.AppName,
                idDistributor: '',

            }

            $scope.apiReset.removeAll();
            $scope.GetAllDistributor();
            $mdDialog.hide();

        }

        $scope.Reset = function() {
            $scope.apiReset.removeAll();

        }


    }
})();