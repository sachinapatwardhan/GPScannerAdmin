(function() {
  'use strict';

  angular
    .module('app.SIM')
    .controller('ImportSIMController', ImportSIMController);

  /** @ngInject */
  function ImportSIMController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, Obj) {
    var vm = this;


    $scope.Import = function(o) {
      var formData = new FormData();
      angular.forEach($scope.Productfiles, function(obj) {
        formData.append('files[]', obj.lfFile);
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
          Obj.getAllSIMInfo();

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


  }
})();
