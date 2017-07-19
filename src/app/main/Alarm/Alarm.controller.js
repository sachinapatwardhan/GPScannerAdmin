(function() {
  'use strict';

  angular
    .module('app.alarm')
    .controller('AlarmController', AlarmController);

  /** @ngInject */
  function AlarmController($http, $scope, $rootScope, $filter, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $element) {

    var vm = this;
    $scope.ResponseAlarm = [];
    $scope.init = function() {
      $scope.ModelSearch = {
        DeviceId: '',
        StartDate: '',
        EndDate: '',
        AlarmCode: '',
      }
      $scope.Search = "";
      $scope.GetAllGpsDevice();
      AlarmCode();

    }

    $scope.GetSerch = function(Search) {
      $scope.Search = Search;
      $scope.GetAllAlarm(true);
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
          console.log($scope.lstdevice)
        } else {
          $scope.lstdevice = [];
        }

      })
    }

    //Dynamic Pagging

    $scope.FilterStatus = 1;
    $scope.dtColumns = [
      DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable(),
      DTColumnBuilder.newColumn('AlarmCode').renderWith(CodeFun),
      DTColumnBuilder.newColumn('DeviceId'),
      DTColumnBuilder.newColumn('Latitude'),
      DTColumnBuilder.newColumn('Longtitude'),
      DTColumnBuilder.newColumn('GPSPositioning'),
      DTColumnBuilder.newColumn('Status'),
      DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
    ]

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        url: $rootScope.RoutePath + "gpsdata/GetAllAlarm",
        data: function(d) {
          if ($scope.Search != "") {
            d.search = $scope.Search;
          } else {
            d.search = "";
          }
          d.DeviceId = $scope.ModelSearch.DeviceId;
          d.StartDate = $scope.ModelSearch.StartDate;
          d.EndDate = $scope.ModelSearch.EndDate;
          d.AlarmCode = $scope.ModelSearch.AlarmCode;

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
      .withOption('createdRow', createdRow)
      .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
      .withOption('scrollY', 'auto');
    $scope.dtInstance = {};


    //Reload Datatable
    $scope.GetAllAlarm = function(IsUpdate) {
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


    function CodeFun(data, type, full, meta) {

      var code = '';

      if (data != '' && data != undefined && data != null) {
        var List = _.findWhere($scope.ResponseAlarm, { AlarmCode: data });
        if (List != null && List != undefined && List != '') {
          code = List.Alarm;
        }
      }

      return code;

    }


    $scope.SearchReset = function() {
      $scope.ModelSearch = {
        DeviceId: '',
        StartDate: '',
        EndDate: '',
        AlarmCode: '',
      }
      $scope.Search = "";
      $('#modelsearch').val("");
      $scope.GetAllAlarm(true);
    }


    //Dynamic Pagging End

    $scope.Export = function() {

      window.location.href = $rootScope.RoutePath + "gpsdata/ExportAlarm?DeviceId=" + $scope.ModelSearch.DeviceId + "&StartDate=" + $scope.ModelSearch.StartDate + "&EndDate=" + $scope.ModelSearch.EndDate + "&AlarmCode=" + $scope.ModelSearch.AlarmCode;

    }

    function AlarmCode() {
      $scope.ResponseAlarm = [];
      var obj = new Object();
      obj.AlarmCode = "01";
      obj.Alarm = "SOS alarm(IN1)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "02";
      obj.Alarm = "Line broken alarm(IN2)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "03";
      obj.Alarm = "Door open alarm(IN3)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "04";
      obj.Alarm = "Engine on alarm(IN4)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "05";
      obj.Alarm = "Original triggering alarm(IN5)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "10";
      obj.Alarm = "Law battery alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "11";
      obj.Alarm = "Over speed alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "12";
      obj.Alarm = "Movment alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "13";
      obj.Alarm = "Geo-fence alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "30";
      obj.Alarm = "Vibration alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "50";
      obj.Alarm = "External power cut alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "52";
      obj.Alarm = "Veer report";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "60";
      obj.Alarm = "Fatigue driving alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "71";
      obj.Alarm = "Crash alarm(Harsh brake)";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "71";
      obj.Alarm = "Acceleration alarm";
      $scope.ResponseAlarm.push(obj);
      var obj = new Object();
      obj.AlarmCode = "81";
      obj.Alarm = "Fuel loss alarm";
      $scope.ResponseAlarm.push(obj);

    }
    $scope.init();
  }

})();
