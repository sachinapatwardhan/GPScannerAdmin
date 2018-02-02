(function() {
    'use strict';

    angular
        .module('app.Vehicle')
        .controller('VehiclesController', VehiclesController);

    /** @ngInject */
    function VehiclesController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        vm.GetAllDynamicVehicles = GetAllDynamicVehicles;
        vm.Reset = Reset;
        var pendingSearch = angular.noop;
        $scope.flgValidation = true;
        $scope.init = function() {
            $scope.model = {
                id: 0,
                iduser: '',
                Name: '',
                deviceid: '',
                renewaldate: null,
                HandshakDatetime: null,
                MaxSpeed: 0,
                BatteryPercentage: 0,
                IsACC: 0,
                SleepMode: 0,
                IsOnline: 0,
                GPRSInterval: 10,
                GPRSStopInterval: 0,
                Arm: 0,
                OdoMeter: 0,
                HeartbeatInterval: 1,
                Relay: null,
                Siren: null,
                UserDefined: null,
                DoorLock: null,
                DoorUnlock: null,
                TimeZone: null,
                IsDelete: 0,
                idSalesAgent: null,
                DeviceType: '',
                IMEI: '',
                idType: null,
            };

            $scope.modelSearch = {
                EndDate: null,
                StartDate: null,
                idType: null,
            }
            $scope.selectedItem = null;
            $scope.objSelectedUser = [];
            // $scope.query = '';
            $scope.Search = '';
            $scope.flag = false;
            $rootScope.appId = localStorage.getItem('appId');
            $scope.getAllVehicleType();
        }

        $scope.gotoVehicleList = function() {
            $scope.model = {
                id: 0,
                iduser: '',
                Name: '',
                deviceid: '',
                renewaldate: null,
                HandshakDatetime: null,
                MaxSpeed: 0,
                BatteryPercentage: 0,
                IsACC: 0,
                SleepMode: 0,
                IsOnline: 0,
                GPRSInterval: 10,
                GPRSStopInterval: 0,
                Arm: 0,
                OdoMeter: 0,
                HeartbeatInterval: 1,
                Relay: null,
                Siren: null,
                UserDefined: null,
                DoorLock: null,
                DoorUnlock: null,
                TimeZone: null,
                IsDelete: 0,
                idSalesAgent: null,
                DeviceType: '',
                IMEI: '',
                idType: null,
            };
            $scope.modelSearch = {
                EndDate: null,
                StartDate: null,
                idType: null,
            }
            $scope.selectedItem = null;
            $scope.objSelectedUser = [];
            // $scope.query = '';
            $scope.Search = '';
            $scope.flag = false;
        }
        $scope.getAllVehicleType = function() {
            $http.get($rootScope.RoutePath + "vehicletype/GetAllActivevehicletype").then(function(data) {
                $scope.lstVehicleType = data.data
            })
        }
        $scope.clearSearchTerm = function() {
            vm.searchTermVehicleType = '';
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.GetUserByName = function(query) {
            var params = {
                    UserName: query,
                    appId: localStorage.getItem('appId'),
                }
                // $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
            $http.get($rootScope.RoutePath + "user/GetUserByName", { params: params }).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }

        $scope.GetUserById = function(id) {
            $http.get($rootScope.RoutePath + "user/GetUserById?idUser=" + id).then(function(data) {
                if (data.data.success == true) {
                    $scope.objUser = data.data.data;
                    $scope.selectedItem = $scope.objUser;
                }
            })
        }

        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function(q) {
            if (q != null && q != undefined) {
                $scope.model.iduser = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.iduser = '';
                $scope.flgErrorNotFound = 1;
            };
        }

        function Reset() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.selectedItem = null;

            $scope.resetForm();
            $scope.init();
            $scope.flag = true;
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            GetAllDynamicVehicles(true);
        }
        $scope.GetDeviceId = function(IMEI) {
            $scope.model.deviceid = parseInt($scope.model.IMEI.toString().slice(1));
        }

        function GetAllDynamicVehicles(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#VehicleDetail').dataTable()._fnAjaxUpdate();
        }

        $scope.CreateVehicleDetails = function(o) {
            $http.get($rootScope.RoutePath + "bike/SaveVehicle", { params: o }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.resetForm();
                    $scope.init();
                    GetAllDynamicVehicles(true);
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
                    };

                }
            });
        };

        //Dynamic Pagging

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = '';

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('deviceid').renderWith(DeviceIdHtml),
                DTColumnBuilder.newColumn('DeviceType'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('Displyrenewaldate').renderWith(ExpirydateFormat),
                DTColumnBuilder.newColumn('DisplyHandshakDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('IsOnline').notSortable().renderWith(StatusHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "vehicles/GetAllDynamicVehicle",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    if ($rootScope.UserRoles == "Sales Agent") {
                        d.UserId = $rootScope.UserId;
                    }

                    d.AdvanceSearch = $scope.modelSearch;
                    // if (d.AdvanceSearch.idType == 'All') {
                    //     // d.AdvanceSearch.idType = null;
                    // }
                    d.appId = $rootScope.appId;
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        $scope.lstVehicledata = json.data;
                        $scope.lstTotal = json.recordsTotal;
                        return json.data;
                    } else {
                        $scope.lstTotal = 0;
                        return [];

                    }
                },
            })

            .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [1, 'DESC'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};

        function DeviceIdHtml(data, type, full, meta) {
            if (data != null && data != '') {
                return data;
            } else {
                return "N/A";
            }
        }

        function ExpirydateFormat(data, type, full, meta) {
            console.log(data)
            if (data != null && data != '') {
                return moment(data).format('DD-MM-YYYY')
            } else {
                return "";
            }

        }

        function dateFormat(data, type, full, meta) {
            if (data != null && data != '') {
                return moment(data).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return "";
            }

        }

        function StatusHtml(data, type, full, meta) {
            var str = '';
            if (data == true) {
                str = '<span  style="font-size: 20px;color: green"> &#x2714;</span>';
            } else {
                str = '<span style="font-size: 20px;color: red">&#x2716;</span>';
            }
            return str;
        }

        function actionsHtml(data, type, full, meta) {
            var device = data.deviceid;
            var event = '$event';
            var btns = '<div layout="row">';
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchVehicleById(' + data.id + ')">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteVehicle(' + data.id + ',$event)">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '<md-button class="edit-button md-icon-button" ng-click="OpenViewModel($event,' + data.id + ')">' +
                '<md-icon md-font-icon="icon-cog" class="s18 brown-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">View Detail</md-tooltip>' +
                '</md-button>';

            btns += '<md-button class="edit-button md-icon-button" ng-click="ShowModal($event,\'' + device + '\',\'' + data.Name + '\',\'' + data.IsOnline + '\')" aria-label="">' +
                '<md-icon md-font-icon="icon-map-marker" class="s18 deep-purple-500-fg"></md-icon> <md-tooltip md-visible="" md-direction="">Location </md-tooltip>' +
                '</md-button>';
            // btns += '<md-button class="edit-button md-icon-button"  ng-click="ShowAlarmDetail($event,\'' + device + '\')" aria-label="">' +
            //     '<md-icon md-font-icon="icon-timer"  class="s18 blue-500-fg"></md-icon>' +
            //     '<md-tooltip md-visible="" md-direction="">Show Alarm</md-tooltip>' +
            //     '</md-button>';
            btns += '</div>';
            return btns;
        };

        function RemarkHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return data;
            } else {
                return 'N/A';
            }
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

        //Edit Location
        $scope.FetchVehicleById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstVehicledata, {
                id: id
            });
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.iduser = o.iduser;
            $scope.model.deviceid = o.deviceid;
            $scope.model.BatteryPercentage = o.BatteryPercentage;
            if (o.HandshakDatetime != null) {
                $scope.model.HandshakDatetime = new Date(o.DisplyHandshakDate);
            } else {
                $scope.model.HandshakDatetime = null;
            }

            if (o.IsOnline == 1) {
                $scope.model.IsOnline = true;
            } else {
                $scope.model.IsOnline = false;
            }
            // $scope.model.renewaldate = new Date(o.renewaldate);
            $scope.model.MaxSpeed = o.MaxSpeed;
            $scope.model.IsACC = o.IsACC;
            $scope.model.SleepMode = o.SleepMode;
            $scope.model.GPRSInterval = o.GPRSInterval;
            $scope.model.GPRSStopInterval = o.GPRSStopInterval;
            $scope.model.Arm = o.Arm;
            $scope.model.OdoMeter = o.OdoMeter;
            $scope.model.HeartbeatInterval = o.HeartbeatInterval;
            $scope.model.Relay = o.Relay;
            $scope.model.Siren = o.Siren;
            $scope.model.UserDefined = o.UserDefined;
            $scope.model.DoorLock = o.DoorLock;
            $scope.model.DoorUnlock = o.DoorUnlock;
            $scope.model.TimeZone = o.TimeZone;
            $scope.model.IsDelete = o.IsDelete;
            $scope.model.idSalesAgent = o.idSalesAgent;
            $scope.model.DeviceType = o.DeviceType;
            $scope.GetUserById(o.iduser);
            $scope.model.IMEI = o.IMEI;
            $scope.model.idType = o.idType;
            // setTimeout(function() {
            //     $scope.$apply(function() {
            $scope.selectedItem = null;
            //     });
            // }, 400);

            $scope.flag = true;
        }

        $scope.DeleteVehicle = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Vehicle ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id
                };
                $http.get($rootScope.RoutePath + "vehicles/DeleteVehicle", {
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
                        $scope.resetForm();
                        GetAllDynamicVehicles(true);
                    } else {
                        if (data.data.data == 'TOKEN') {
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

        $scope.chkTrackerId = function(IMEI) {
            $http.get($rootScope.RoutePath + "PetDevice/GetGPSDeviceById?IMEI=" + IMEI).success(function(data) {
                // console.log(data);
                if (data != null) {
                    $scope.model.idSalesAgent = data.idSalesAgent;
                    $scope.model.DeviceType = data.Type;
                    $scope.GetDeviceId(IMEI);
                } else {
                    $scope.model.deviceid = "";
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Invalid TrackerId")
                        .position('top right')
                        .hideDelay(3000)
                    );

                }
            })
        }

        $scope.ShowModal = function(ev, device, Name, IsOnline) {
            $mdDialog.show({
                controller: 'Location1Controller',
                controllerAs: 'vm',
                templateUrl: 'app/main/Vehicles/dialogs/Location/Location.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    deviceid: device,
                    Name: Name,
                    Tasks: [],
                    event: ev,
                    MediaVM: vm,
                    IsOnline: IsOnline,
                }
            });
        }

        $scope.OpenViewModel = function(e, idVehicle) {
            GetAllDynamicVehicles(true);
            var o = _.findWhere($scope.lstVehicledata, {
                id: idVehicle
            });
            $mdDialog.show({
                controller: 'ViewDetailCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/Vehicles/dialogs/ViewDetail/ViewDetail.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    ModalMethod: vm,
                    idVehicle: idVehicle,
                    objVehicle: o,
                }
            });
        }

        $scope.ShowAlarmDetail = function(ev, id) {
            $scope.obj = _.findWhere($scope.lstVehicledata, { deviceid: id });
            $mdDialog.show({
                controller: 'AlarmDetail1Controller',
                controllerAs: 'vm',
                templateUrl: 'app/main/Vehicles/dialogs/AlarmDetail/AlarmDetail.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objUser: $scope.obj,
                    Tasks: [],
                    event: ev,

                }
            })
        }

        $scope.closeModal = function() {
            $mdDialog.hide();
        };

        $scope.resetForm = function() {
            $scope.formVehicledetails.$setUntouched();
            $scope.formVehicledetails.$setPristine();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }
        $scope.ResetData = function() {
            $scope.model = {
                id: 0,
                iduser: '',
                Name: '',
                deviceid: '',
                renewaldate: null,
                HandshakDatetime: null,
                MaxSpeed: 0,
                BatteryPercentage: 0,
                IsACC: 0,
                SleepMode: 0,
                IsOnline: 0,
                GPRSInterval: 10,
                GPRSStopInterval: 0,
                Arm: 0,
                OdoMeter: 0,
                HeartbeatInterval: 1,
                Relay: null,
                Siren: null,
                UserDefined: null,
                DoorLock: null,
                DoorUnlock: null,
                TimeZone: null,
                IsDelete: 0,
                idSalesAgent: null,
                DeviceType: '',
                IMEI: '',
                idType: null,
            };
            $scope.modelSearch = {
                EndDate: null,
                StartDate: null,
                idType: null,
            }
            $scope.query = '';
            $scope.resetForm();
        }
        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                iduser: '',
                Name: '',
                deviceid: '',
                renewaldate: null,
                HandshakDatetime: null,
                MaxSpeed: 0,
                BatteryPercentage: 0,
                IsACC: 0,
                SleepMode: 0,
                IsOnline: 0,
                GPRSInterval: 10,
                GPRSStopInterval: 0,
                Arm: 0,
                OdoMeter: 0,
                HeartbeatInterval: 1,
                Relay: null,
                Siren: null,
                UserDefined: null,
                DoorLock: null,
                DoorUnlock: null,
                TimeZone: null,
                IsDelete: 0,
                idSalesAgent: null,
                DeviceType: '',
                IMEI: '',
                idType: null,
            };
            $scope.modelSearch = {
                EndDate: null,
                StartDate: null,
                idType: null,
            }
            $scope.selectedItem = null;
            // // $scope.query = '';
            $scope.flag = false;
            $scope.resetForm();
        }
        $scope.SearchReset = function() {
            $scope.modelSearch = {
                EndDate: null,
                StartDate: null,
                idType: null,
            }
            GetAllDynamicVehicles(true);
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
        $scope.init();
    }

})();