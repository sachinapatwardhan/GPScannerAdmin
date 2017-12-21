(function() {
  'use strict';

  angular
    .module('app.attribute')
    .controller('AttributeController', AttributeController);

  /** @ngInject */
  function AttributeController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;

    $scope.init = function() {
      $scope.model = {
        Id: '',
        Name: '',
        Description: '',
      };
      $scope.modelSearch = {
        Search: '',
      }
      $scope.GetAllProductAttribute();
      $scope.tab = {
        selectedIndex: 0
      };
      $scope.flag = false;
    }

    vm.dtInstance = {};
    vm.dtOptions = {
      dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs: [],
      initComplete: function() {
        var api = this.api(),
          searchBox = angular.element('body').find('#modelsearch');

        // Bind an external input as a table wide search box
        if (searchBox.length > 0) {
          searchBox.on('keyup', function(event) {
            api.search(event.target.value).draw();
          });
        }
      },
      pagingType: 'simple',
      lengthMenu: [10, 20, 30, 50, 100],
      pageLength: 20,
      scrollY: 'auto',
      responsive: true
    };


    $scope.GetAllProductAttribute = function() {
      $http.get($rootScope.RoutePath + "ProductAttribute/GetAllProductAttribute").then(function(data) {
        $scope.lstProductAttribute = data.data;
      });
    }

    $scope.CreateProductAttribute = function(o) {
      $http.post($rootScope.RoutePath + "ProductAttribute/SaveProductAttribute", o).then(function(data) {
        if (data.data.success == true) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(data.data.message)
            .position('top right')
            .hideDelay(3000)
          );
          $rootScope.FlgAddedEditlocal = false;
          if ($rootScope.FlgAddedAccess == true) {
            $rootScope.FlgAddedEditlocal = true;
          }
          $scope.ResetModel()
          // $scope.init();
        } else {
          if (data.data.data == 'TOKEN') {
            $rootScope.logout();
          } else {
            $mdToast.show(
              $mdToast.simple()
              .textContent(data.data.message)
              .position('top right')
              .hideDelay(3000)
            );
          }
        }
      });

    }

    $scope.FetchProductAttributeById = function(o) {
      $rootScope.FlgAddedEditlocal = true;
      $scope.flag = true;

      $scope.tab.selectedIndex = 1;
      $scope.model.Id = o.Id;
      $scope.model.Name = o.Name;
      $scope.model.Description = o.Description;
    }

    $scope.DeleteProductAttribute = function(id) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to Delete this Record ?')
        .ok('Ok')
        .cancel('Cancel')
      $mdDialog.show(confirm).then(function() {
        var params = {
          idProductAttribute: id
        };
        $http.get($rootScope.RoutePath + "ProductAttribute/DeleteProductAttribute", {
          params: params
        }).success(function(data) {
          if (data.success == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent(data.message)
              .position('top right')
              .hideDelay(3000)
            );
            $scope.init();
          } else {
            if (data.data.data == 'TOKEN') {
              //$cookieStore.remove('UserName');
              //$cookieStore.remove('token');
              //window.location.href = '/app/login';
              $rootScope.logout();
            } else {
              $mdToast.show(
                $mdToast.simple()
                .textContent(data.message)
                .position('top right')
                .hideDelay(3000)
              );
            }
          }
        });
      });
    };

    $scope.GetSerch = function(Search) {
      vm.dtInstance.DataTable.search(Search);
      vm.dtInstance.DataTable.search(Search).draw();
    };

    $scope.AddNew = function() {
      $scope.flag = true;
    }

    $scope.Reset = function() {
      $rootScope.FlgAddedEditlocal = false;
      if ($rootScope.FlgAddedAccess == true) {
        $rootScope.FlgAddedEditlocal = true;
      }
      $scope.resetForm();
      $scope.init();
    }

    $scope.resetForm = function() {
      $scope.formProductAttribute.$setUntouched();
      $scope.formProductAttribute.$setPristine();
    }
    $scope.ResetTab = function() {
      if ($rootScope.FlgAddedAccess != true) {
        $scope.FlgAddedEditlocal = false;
      }
    }
    $scope.ResetModel = function() {
      if ($rootScope.FlgAddedAccess == true) {

        $scope.model = {
          Id: '',
          Name: '',
        };
        $scope.modelSearch = {
          Search: '',
        }
        $scope.GetAllProductAttribute()
        $scope.resetForm();
        $scope.flag = false;
      }
    }

    $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

      vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3)
      ];

      $scope.init();
    })

  }

})();
