(function() {
  'use strict';

  angular
    .module('app.MobileWidget')
    .controller('MobileWidgetController', MobileWidgetController);


  /** @ngInject */
  function MobileWidgetController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout) {
    var vm = this;
    vm.SelectImage = SelectImage;
    // vm.Reset = Reset;
    $scope.init = function() {
      $scope.model = {
        id: '',
        Name: '',
        Title: '',
        Design: '',
        ImageUrl: '',
        URL: '',
        Position: null,
        CustomField: '',
        CustomValue: '',
        CreatedBy: 'Admin',
        CreatedDate: new Date(),
        ModifiedBy: 'Admin',
        ModifiedDate: new Date(),
        CmsType: "Mobile",
      }
      $scope.GetAllWidget();
      $scope.FlgImage = 0;
      $scope.flag = false;
    };

    $scope.gotoList = function() {
      $scope.model = {
        id: '',
        Name: '',
        Title: '',
        Design: '',
        ImageUrl: '',
        URL: '',
        Position: null,
        CustomField: '',
        CustomValue: '',
        CreatedBy: 'Admin',
        CreatedDate: new Date(),
        ModifiedBy: 'Admin',
        ModifiedDate: new Date(),
        CmsType: "Mobile",
      }
      $scope.GetAllWidget();
      $scope.Search = '';
      $scope.FlgImage = 0;
      $scope.flag = false;
    }

    $scope.GetAllWidget = function() {
      $http.get($rootScope.RoutePath + "widget/GetAllWidgetByType?CmsType=Mobile").then(function(response) {
        $scope.lstWidget = response.data;
      });
    }

    function SelectImage(o) {
      $scope.FlgImage = 1;
      $scope.model.ImageUrl = o.FileName;
      $scope.closeModal();
    }

    $scope.RemoveImage = function() {
      $scope.model.ImageUrl = '';
      $scope.FlgImage = 0;
    }

    $scope.saveWidget = function(o) {
      $http.post($rootScope.RoutePath + "widget/SaveWidget", o).then(function(response) {
        if (response.data.success == true) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(response.data.message)
            .position('top right')
            .hideDelay(3000)
          );
          $rootScope.FlgAddedEditlocal = false;
          if ($rootScope.FlgAddedAccess == true) {
            $rootScope.FlgAddedEditlocal = true
          }

          $scope.init();
        } else {
          if (response.data.data == 'TOKEN') {

            $rootScope.logout();
          } else {
            $mdToast.show(
              $mdToast.simple()
              .textContent(response.data.message)
              .position('top right')
              .hideDelay(3000)
            );
          }
        }
      });
    }

    $scope.EditWidget = function(o) {
      $rootScope.FlgAddedEditlocal = true;
      $scope.flag = true;
      $scope.tab = { selectedIndex: 1 };
      $scope.model.id = o.id;
      $scope.model.Name = o.Name;
      $scope.model.Title = o.Title;
      $scope.model.Design = o.Design;
      $scope.model.ImageUrl = o.ImageUrl;
      if ($scope.model.ImageUrl != null && $scope.model.ImageUrl != '' && $scope.model.ImageUrl != undefined) {
        $scope.FlgImage = 1;
      } else {
        $scope.FlgImage = 0;
      }
      $scope.model.URL = o.URL;
      $scope.model.Position = o.Position;
      $scope.model.CustomField = o.CustomField;
      $scope.model.CustomValue = o.CustomValue;
      $scope.model.CreatedBy = o.CreatedBy;
      $scope.model.CreatedDate = o.CreatedDate;
      $scope.model.ModifiedBy = o.ModifiedBy;
      $scope.model.ModifiedDate = o.ModifiedDate;
      $scope.model.CmsType = o.CmsType;
    }

    $scope.DeleteWidget = function(id) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure to delete this Widget?')
        .ok('Yes')
        .cancel('No');
      $mdDialog.show(confirm).then(function() {
        $http.get($rootScope.RoutePath + "widget/DeleteWidget?WidgetId=" + id).then(function(data) {
          if (data.data.success == true) {
            $mdToast.show(
              $mdToast.simple()
              .textContent(data.data.message)
              .position('top right')
              .hideDelay(3000)
            );
            $scope.GetAllWidget();
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
      });
    }

    $scope.ShowModal = function(ev, o) {
      $mdDialog.show({
        controller: 'ImageModelMobileWidgetController',
        controllerAs: 'vm',
        templateUrl: 'app/main/MobileWidget/dialogs/ImageModel/ImageModel.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          objMedia: o,
          Tasks: [],
          event: ev,
          MediaVM: vm
        }
      });
    }

    $scope.closeModal = function() {
      $mdDialog.hide();
    };


    $scope.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4).notSortable()
    ];

    $scope.dtInstance = {};
    $scope.dtOptions = {
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
      pagingType: 'full_numbers',
      lengthMenu: [25, 30, 50, 100],
      pageLength: 25,
      scrollY: 'auto',
      responsive: true
    };


    $scope.dtColumnDefsModal = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];

    $scope.ResetModel = function() {
      $scope.FlgImage = 0;
      $scope.model = {
        id: '',
        Name: '',
        //Heading:'',
        Title: '',
        Design: '',
        ImageUrl: '',
        URL: '',
        Position: null,
        CustomField: '',
        CustomValue: '',
        CreatedBy: 'Admin',
        CreatedDate: new Date(),
        ModifiedBy: 'Admin',
        ModifiedDate: new Date(),
        CmsType: "Mobile",
      }
      $scope.restForm();
      $scope.flag = false;
    }
    $scope.ResetData = function() {
      $scope.FlgImage = 0;
      $scope.model = {
        id: '',
        Name: '',
        //Heading:'',
        Title: '',
        Design: '',
        ImageUrl: '',
        URL: '',
        Position: null,
        CustomField: '',
        CustomValue: '',
        CreatedBy: 'Admin',
        CreatedDate: new Date(),
        ModifiedBy: 'Admin',
        ModifiedDate: new Date(),
        CmsType: "Mobile",
      }
      $scope.restForm();
    }


    $scope.Reset = function() {
      $rootScope.FlgAddedEditlocal = false;
      if ($rootScope.FlgAddedAccess == true) {
        $rootScope.FlgAddedEditlocal = true
      }
      $scope.init();
      $scope.flag = true;
    }
    $scope.restForm = function() {
      $scope.FormWidget.$setUntouched();
      $scope.FormWidget.$setPristine();
    }

    // function Reset() {
    //     $rootScope.FlgAddedEditlocal = false;
    //     if ($rootScope.FlgAddedAccess == true) {
    //         $rootScope.FlgAddedEditlocal = true;
    //     }
    //     $scope.resetForm();
    //     $scope.init();
    //     $scope.flag = true;
    // }

    $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
      $scope.init();
    })

  }
})();
