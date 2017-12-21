(function() {
  'use strict';

  angular
    .module('app.product')
    .controller('ImportProductsController', ImportProductsController);

  /** @ngInject */
  function ImportProductsController($http, $mdDialog, $mdToast, $scope, $rootScope, Tasks, event, Obj) {
    var vm = this;

    $scope.Import = function() {

      var formData = new FormData();
      angular.forEach($scope.Productfiles, function(obj) {
        formData.append('files[]', obj.lfFile);
      });

      console.log(formData)

      $http.post($rootScope.RoutePath + "product/ImportProducts", formData, {
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
          Obj.GetAllProductPanelmodal(true);
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
