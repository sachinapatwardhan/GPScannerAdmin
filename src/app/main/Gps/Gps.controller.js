(function() {
  'use strict';

  angular
    .module('app.gps')
    .controller('GpsController', GpsController);

  /** @ngInject */
  function GpsController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

    var vm = this;

    $scope.init = function() {
      $scope.ModelSearch = {
        DeviceId: '',
        StartDate: '',
        EndDate: '',
      }
      $scope.GetAllGpsDevice();

    }


    
    $scope.toggle = function() {
      if (!$scope.flgforIcon) {
        $scope.flgforIcon = true;
      } else {
        $scope.flgforIcon = false;
      }

      $(function() {
        $(".showBtn").toggleClass("active");
        $(".ShowContentBox").slideToggle();
      });
    };

    //GetDevice

    $scope.GetAllGpsDevice = function() {
      $http.get($rootScope.RoutePath + "gpsdata/GetAllGpsDevice").then(function(resdata) {
        if (resdata.data.length > 0) {
          $scope.lstdevice = resdata.data;
        } else {
          $scope.lstdevice = [];
        }

      })
    }

    //Dynamic Pagging

    $scope.FilterStatus = 1;
    $scope.dtColumns = [
      DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
      DTColumnBuilder.newColumn('DeviceId'),
      DTColumnBuilder.newColumn('Datetime').renderWith(Datefun),
      DTColumnBuilder.newColumn('Latitude'),
      DTColumnBuilder.newColumn('Longtitude'),
      DTColumnBuilder.newColumn('GPSPositioning'),
      DTColumnBuilder.newColumn('Speed'),
      DTColumnBuilder.newColumn('Direction'),
      DTColumnBuilder.newColumn('Status'),
      DTColumnBuilder.newColumn('IsRelayToStopTheCar').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsSirenSound').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsLockTheDoor').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsUnlockTheDoor').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsSOS').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsDoor').renderWith(IsFlg),
      DTColumnBuilder.newColumn('IsEngine').renderWith(IsFlg),
      DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
    ]

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        url: $rootScope.RoutePath + "gpsdata/GetAllGpsData",
        data: function(d) {
          console.log(d)
          d.DeviceId = $scope.ModelSearch.DeviceId;
          d.StartDate = $scope.ModelSearch.StartDate;
          d.EndDate = $scope.ModelSearch.EndDate;
          return d;
        },
        type: "get",
        dataSrc: function(json) {
          if (json.success != false) {
            $scope.lstdata = json.data;
            return json.data;
          } else {
            return [];
          }
        },
      })
      .withOption('processing', true) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10) // Page size
      .withOption('aaSorting', [0, 'desc'])
      .withOption('responsive', true)
      .withOption('createdRow', createdRow);

    $scope.dtInstance = {};


    //Reload Datatable
    $scope.GetAllGpsData = function(IsUpdate) {
      var resetPaging = false;
      if (IsUpdate == true) {
        resetPaging = true;
      };
      $scope.dtInstance.reloadData(callback, resetPaging);
    }

    $scope.reloadData = function() {}

    function callback(json) {}

    //compile Datatable And Apply Class
    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }


    function NumberHtml(data, type, full, meta) {
      return (meta.row + 1);
    }

    function Datefun(data, type, full, meta) {
      if (data != '' && data != null && data != undefined) {
        return $filter('date')(data, "dd-MM-yyyy");
      } else {
        return '';
      }
    }

    function IsFlg(data, type, full, meta) {
      var Flg;
      if (data == true) {
        Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
      } else {
        Flg = '<i class="icon-cancel red-500-fg"></i>';
      }
      return Flg;

    }

    $scope.SearchReset = function() {
      $scope.ModelSearch = {
        DeviceId: '',
        StartDate: '',
        EndDate: '',
      }
      $scope.GetAllGpsData(true);
    }

    //Dynamic Pagging End

    $scope.init();
  }

})();
