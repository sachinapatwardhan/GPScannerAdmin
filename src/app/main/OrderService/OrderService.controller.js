(function () {
  'use strict';

  angular
    .module('app.orderservice')
    .controller('OrderServiceController', OrderServiceController);

  /** @ngInject */
  function OrderServiceController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
    var vm = this;

    vm.GetAllOrderServiceFromModal = GetAllOrderServiceFromModal;
    $scope.GetAllProductType = function () {
      $scope.lstProductTypes = [];
      $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
        $scope.lstProductTypes = data.data;
      });
    }
    $scope.GetAllProductType();

    $scope.init = function () {
      $scope.modelSearch = {
        StartDate: '',
        EndDate: '',
        Status: 0,
        Type: 0,
      }

      $scope.GetOrderServiceStatus();
    }

    $scope.onSearchChange = function ($event) {
      $event.stopPropagation();
    }

    $scope.toggle = function () {
      if (!$scope.flgforIcon) {
        $scope.flgforIcon = true;
      } else {
        $scope.flgforIcon = false;
      }

      $(function () {
        $(".showBtn").toggleClass("active");
        $(".ShowContentBox").slideToggle();
      });
    };

    $scope.dtColumns = [
      DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('').notSortable().renderWith(TypeHtml).withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('PurchaseOrderNumber').withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('Email').renderWith(EmailHtml).withOption('class', 'text-center'),
      // DTColumnBuilder.newColumn('UserName').renderWith(UserNameHtml).withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('CreatedOnUtc').renderWith(DateFormateHtml).withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('ExpiryDate').renderWith(DateFormateHtml).withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('OrderTotal').withOption('class', 'text-center'),
      DTColumnBuilder.newColumn('OrderNotes').withOption('class', 'text-center'),
      DTColumnBuilder.newColumn(null).notSortable().renderWith(StatusHtml).withOption('class', 'text-center'),
      DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
    ]

    $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {


      $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        url: $rootScope.RoutePath + "orderservice/GetAllOrderService",
        data: function (d) {
          if ($scope.Search == '') {
            d.search = '';
          } else {
            d.search = $scope.Search;
          }
          if ($scope.modelSearch.StartDate != '') {
            d.StartDate = $scope.modelSearch.StartDate.toUTCString();
          } else {
            d.StartDate = '';
          }
          if ($scope.modelSearch.EndDate != '') {
            d.EndDate = $scope.modelSearch.EndDate.toUTCString();
          } else {
            d.EndDate = '';
          }
          d.Status = $scope.modelSearch.Status;
          d.Type = $scope.modelSearch.Type;
          return d;
        },
        type: "get",
        dataSrc: function (json) {
          if (json.success != false) {
            for (var i = 0; i < json.data.length; i++) {
              var objTypes = _.findWhere($scope.lstProductTypes, {
                id: parseInt(json.data[i].SubscriptionTransactionId)
              });
              if (objTypes != undefined) {
                json.data[i]["OType"] = objTypes.AppName;
              }
            }
            $scope.lstdata = json.data;

            return json.data;
          } else {
            $scope.lstdata = [];
            return [];
          }
        },
      })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers')
        .withDisplayLength(25)
        .withOption('aaSorting', [4, 'desc'])
        .withOption('responsive', true)
        .withOption('createdRow', createdRow)
        .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
        .withOption('scrollY', 'auto');

    });
    $scope.dtInstance = {};



    //Reload Datatable
    $scope.GetAllOrderService = function (IsUpdate) {
      var resetPaging = false;
      if (IsUpdate == true) {
        resetPaging = true;
      };
      $scope.dtInstance.reloadData(callback, resetPaging);
      $('#OrderServicetable').dataTable()._fnPageChange(0);
      $('#OrderServicetable').dataTable()._fnAjaxUpdate();

    }

    function GetAllOrderServiceFromModal() {
      $scope.GetAllOrderService(true);
    }

    $scope.reloadData = function () { }

    function callback(json) { }

    //compile Datatable And Apply Class
    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }


    function NumberHtml(data, type, full, meta) {
      return (meta.row + 1);
    }



    function EmailHtml(data, type, full, meta) {
      var email = '';
      if (full.tbluserinformation != null && full.tbluserinformation != undefined && full.tbluserinformation != '') {
        email = full.tbluserinformation.email;
      }
      return email;
    }

    function UserNameHtml(data, type, full, meta) {
      var username = '';
      if (full.tbluserinformation != null && full.tbluserinformation != undefined && full.tbluserinformation != '') {
        username = full.tbluserinformation.username;
      }
      return username;
    }

    function TypeHtml(data, type, full, meta) {
      var OType = '';
      if (full.OType != null && full.OType != undefined && full.OType != '') {
        OType = full.OType;
      }
      return OType;
    }

    function DateFormateHtml(data, type, full, meta) {
      if (data != null && data != undefined && data != '') {
        return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm A");
      } else {
        return 'N/A';
      }
    }


    function DeviceHtml(data, type, full, meta) {
      var device = '';
      if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
        device = full.tblorderservicestatus.OrderStatus;
      }
      return device;
    }

    function StatusHtml(data, type, full, meta) {
      var status = '';
      if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
        var statusname = full.tblorderservicestatus.OrderStatus;
        if (statusname == "Approved") {
          status = '<b><span style="color:green;">Approved</span></b>';
        } else if (statusname == "Pending") {
          status = '<span>Pending</span>';
        }
      }
      return status;
    }


    function actionsHtml(data, type, full, meta) {

      var btns = '<div layout="row">'

      if ($rootScope.FlgModifiedAccess) {
        btns += '<md-button class="edit-button md-icon-button"  ng-click="OpenUpdateDeviceModal($event,' + data.id + ')" aria-label="">' +
          '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
          '<md-tooltip md-visible="" md-direction="">Edit Device</md-tooltip>' +
          '</md-button>';
      }

      if ($rootScope.FlgModifiedAccess) {
        if (full.tblorderservicestatus != null && full.tblorderservicestatus != undefined && full.tblorderservicestatus != '') {
          var statusname = full.tblorderservicestatus.OrderStatus;
          if (statusname == "Approved") {
            btns += '<md-button class="edit-button md-icon-button"  ng-click="RenewOrderService(' + data.id + ')" aria-label="">' +
              '<md-icon md-font-icon="icon-account-network"  class="s18 blue-500-fg"></md-icon>' +
              '<md-tooltip md-visible="" md-direction="">Renew Order Service</md-tooltip>' +
              '</md-button>';
          }
        }
      }

      if ($rootScope.FlgModifiedAccess && full.tblorderservicestatus.OrderStatus == "Pending") {
        btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangeStatus(' + data.id + ')" aria-label="">' +
          '<md-icon md-font-icon="icon-checkbox-marked-circle"  class="s18 green-500-fg"></md-icon>' +
          '<md-tooltip md-visible="" md-direction="">Approve Order</md-tooltip>' +
          '</md-button>';
      }
      btns += '</div>'
      return btns;
    };

    $scope.GetSerch = function (Search) {
      $scope.Search = Search;
      $scope.GetAllOrderService(true);
    }


    $scope.GetOrderServiceStatus = function () {
      $scope.LstAllStatus = [];
      $http.get($rootScope.RoutePath + "orderservice/GetOrderServiceStatus").then(function (resStatus) {
        $scope.LstAllStatus = resStatus.data;
      });
    }


    $scope.OpenUpdateDeviceModal = function (ev, id) {
      var objData = _.findWhere($scope.lstdata, {
        id: id
      });
      $mdDialog.show({
        controller: 'UpdateDeviceModalController',
        controllerAs: 'vm',
        templateUrl: 'app/main/OrderService/dialogs/UpdateDeviceModal/UpdateDeviceModal.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          obj: objData,
          Tasks: [],
          event: ev,
          MainVM: vm
        }
      })
    }


    $scope.RenewOrderService = function (id) {
      var objData = _.findWhere($scope.lstdata, {
        id: id
      });
      var params = {
        id: objData.id,
      }
      $http.get($rootScope.RoutePath + "orderservice/RenewOrderService", {
        params: params
      }).then(function (resRenew) {
        if (resRenew.data.success == true) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(resRenew.data.message)
              .position('top right')
              .hideDelay(3000)
          );
          $scope.GetAllOrderService(true);
          $mdDialog.hide();
        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent(resRenew.data.message)
              .position('top right')
              .hideDelay(3000)
          );
        }
      });
    }


    $scope.ChangeStatus = function (id) {
      var params = {
        id: id,
      }
      $http.get($rootScope.RoutePath + "orderservice/ChangeStatus", {
        params: params
      }).then(function (data) {
        if (data.data.success == true) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(data.data.message)
              .position('top right')
              .hideDelay(3000)
          );
          $scope.GetAllOrderService(true);
        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent(data.data.message)
              .position('top right')
              .hideDelay(3000)
          );
        }
      });
    }

    $scope.SearchReset = function () {
      $scope.modelSearch = {
        StartDate: '',
        EndDate: '',
        Status: 0,
        Type: 0
      }
      $scope.Search = "";
      $('#modelsearch').val("");
      $scope.GetAllOrderService(true);
    }

    $scope.CreateOrder = function () {
      var obj = {
        UserId: 1,
        DeviceId: "5418549849648",
        UserName: "XXX",
        Country: "Malaysia",
        ProductTypeId: 1,
      }
      $http.post($rootScope.RoutePath + "orderservice/CreateOrderService", obj).then(function (resRenew) {
        console.log(resRenew)
      });
    }
    // $scope.CreateOrder();

    $scope.init();
  }

})();
