(function() {
    'use strict';

    angular
        .module('app.AssignAgentRetailer')
        .controller('ImportAgentRetailerController', ImportAgentRetailerController);

    /** @ngInject */
    function ImportAgentRetailerController($http, $mdDialog, $mdToast, $cookieStore, $scope, $rootScope, Tasks, event, Obj) {
        var vm = this;
        vm.UserRoles = $rootScope.UserRoles[0];
        $scope.idTelCo = null;
        $scope.model = {
            idApp: parseInt(localStorage.getItem('appId')),
            agentId: '',
            retailerId: ''
        }
        $scope.GetAllAgent = function() {
            $scope.model.agentId = "";
            var params = {
                idApp: $scope.model.idApp,
            }
            $http.get($rootScope.RoutePath + "assignagentretailer/GetAllAgent", { params: params }).then(function(data) {
                $scope.lstAgent = data.data;
            });
        }
        $scope.GetAllAgent();
        $scope.GetAllRetailer = function(agentId) {
            $scope.model.retailerId = "";
            $http.get($rootScope.RoutePath + "assignretailer/GetAllAssignRetailer").then(function(data) {
                $scope.lstAssignRetailer = data.data;
                $scope.lstAllRetailer = _.filter($scope.lstAssignRetailer, { agentId: agentId })
            });
        }

        // $scope.model.idApp = parseInt(localStorage.getItem('appId'));
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
                formData.append('agentId', $scope.model.agentId);
                formData.append('retailerId', $scope.model.retailerId);
            });
            $http.post($rootScope.RoutePath + "assignagentretailer/uploadExcelDevice", formData, {
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
                idApp: parseInt(localStorage.getItem('appId')),
                agentId: '',
                retailerId: ''
            }
            $scope.apiReset.removeAll();
            $scope.GetAllAgent();
            $mdDialog.hide();

        }

        $scope.Reset = function() {
            $scope.apiReset.removeAll();
            // $scope.idTelCo = null;
        }


    }
})();