(function() {
    'use strict';

    angular
        .module('app.PetDevice')
        .controller('ImportPetDeviceController', ImportPetDeviceController);

    /** @ngInject */
    function ImportPetDeviceController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, Obj, lstCarrier, lstCountry) {
        var vm = this;

        console.log("call");
        $scope.init = function() {
            $scope.model = {
                Type: '',
                IsOldDevice: 0,
                CarrierId: null,
                CountryId: null,
                CreatedBy: $rootScope.UserName,
            };
        }
        $scope.lstCarrier = lstCarrier;
        $scope.lstCountry = lstCountry;

        $scope.Import = function(o) {
            // if (o.Type == "Z3" && o.CarrierId != null && o.CarrierId != "" && o.CarrierId != undefined) {
                // o.CountryId = _.findWhere($scope.lstCarrier, { id: parseInt(o.CarrierId) }).idCountry.toString();
            // }
            var formData = new FormData();
            angular.forEach($scope.Productfiles, function(obj) {
                formData.append('files[]', obj.lfFile);
                formData.append('Type', o.Type);
                formData.append('IsOldDevice', o.IsOldDevice);
                formData.append('CreatedBy', o.CreatedBy);
                formData.append('CountryId', o.CountryId);
                formData.append('CarrierId',o.CarrierId);
            });
            $http.post($rootScope.RoutePath + "PetDevice/uploadExcelDevice", formData, {
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
