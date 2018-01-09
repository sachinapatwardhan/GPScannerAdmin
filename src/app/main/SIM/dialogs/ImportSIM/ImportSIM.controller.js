(function() {
    'use strict';

    angular
        .module('app.SIM')
        .controller('ImportSIMController', ImportSIMController);

    /** @ngInject */
    function ImportSIMController($http, $mdDialog, $mdToast, $cookieStore, $scope, $rootScope, Tasks, event, Obj) {
        var vm = this;
        vm.UserRoles = $rootScope.UserRoles[0];
        $scope.idTelCo = null;
        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }
        $scope.GetAlltelco();
        $scope.idApp = parseInt(localStorage.getItem('appId'));
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
                formData.append('idTelCo', $scope.idTelCo);
                formData.append('idApp', $scope.idApp);
            });
            $http.post($rootScope.RoutePath + "sim/uploadExcelDevice", formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                //console.log(response);
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.closeModel();
                    Obj.GetAllSIMDetail();

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
            $scope.idTelCo = null;
            $scope.idApp = parseInt(localStorage.getItem('appId'));
            $scope.apiReset.removeAll();
            $mdDialog.hide();
        }

        $scope.Reset = function() {
            $scope.apiReset.removeAll();
            // $scope.idTelCo = null;
        }


    }
})();