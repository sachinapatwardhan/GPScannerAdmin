(function() {
    'use strict';

    angular
        .module('app.Vehicle')
        .controller('ImportDataController', ImportDataController);

    /** @ngInject */
    function ImportDataController($http, $cookieStore, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, Obj, lstCountry) {
        var vm = this;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.AppName = localStorage.getItem('appName');
        $scope.init = function() {
            $scope.model = {
                Type: 'MT05',
                IsOldDevice: 0,
                CountryId: null,
                CreatedBy: $rootScope.UserName,
                AppName: $rootScope.AppName,
            };


            if ($rootScope.UserRoles == "Super Admin") {
                $scope.flag = true;
            } else {
                $scope.flag = false;
            }

            if ($rootScope.AppName == 'Tracking') {
                $scope.model.Type = 'MT05';
            }
            $scope.GetAllAppName();
        }
        $scope.lstCountry = lstCountry;
        $scope.GetAllAppName = function() {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppInfo").then(function(data) {
                $scope.lstAppName = data.data;
            })
        }
        $scope.Import = function(o) {
            var formData = new FormData();
            angular.forEach($scope.Productfiles, function(obj) {
                formData.append('files[]', obj.lfFile);
                formData.append('CreatedBy', o.CreatedBy);
                formData.append('AppName', o.AppName);
            });
            $http.post($rootScope.RoutePath + "import/ImportData", formData, {
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
                    Obj.GetPetDevice();

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

        $scope.clearSearchTerm = function() {
            vm.searchTermCountry = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.closeModel = function() {
            $scope.apiReset.removeAll();
            $mdDialog.hide();
        }

        $scope.Reset = function() {
            $scope.apiReset.removeAll()
        }

        $scope.init();

    }
})();