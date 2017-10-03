(function() {
    'use strict';

    angular
        .module('app.Utility')
        .controller('UtilityController', UtilityController);

    /** @ngInject */
    function UtilityController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;

        $scope.init = function() {
            $scope.FlgAddedEditlocal = true;
            $scope.selected = [];
            $scope.Search = '';
        }

        $scope.showDefultValue = function() {
            $mdDialog.show({
                controller: 'DefaultValueCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/Utility/dialogs/DefaultValue/DefaultValue.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                // locals: {
                //     ModalMethod: vm,
                //     idVehicle: idVehicle,
                //     objVehicle: o,
                // }
            });
        }
        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            GetAllDynamicVehicles(true);
        }

        function GetAllDynamicVehicles(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#VehicleDetail').dataTable()._fnAjaxUpdate();
        }
        //Dynamic Pagging

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = '';

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('Name'),
                // DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('deviceid').renderWith(DeviceIdHtml),
                DTColumnBuilder.newColumn('DeviceType'),

                DTColumnBuilder.newColumn('IsOnline').notSortable().renderWith(StatusHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "vehicles/GetAllOnlineVehicle",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    if ($rootScope.UserRoles == "Sales Agent") {
                        d.UserId = $rootScope.UserId;
                    }
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
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
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

        function dateFormat(data, type, full, meta) {
            if (data != null && data != '') {
                return $rootScope.convertdateformat(data, 1);
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
            btns = '<md-checkbox ng-checked="exists(' + device + ', selected)" ng-click="toggle1(' + device + ', selected)"></md-checkbox>';
            // if ($rootScope.FlgModifiedAccess) {
            //     btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchVehicleById(' + data.id + ')">' +
            //         '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
            //         '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
            //         '</md-button>';
            // }
            // if ($rootScope.FlgDeletedAccess) {
            //     btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteVehicle(' + data.id + ',$event)">' +
            //         '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
            //         '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
            //         '</md-button>';
            // }
            // btns += '<md-button class="edit-button md-icon-button" ng-click="OpenViewModel($event,' + data.id + ')">' +
            //     '<md-icon md-font-icon="icon-cog" class="s18 brown-500-fg"></md-icon>' +
            //     '<md-tooltip md-visible="" md-direction="">View Detail</md-tooltip>' +
            //     '</md-button>';

            // btns += '<md-button class="edit-button md-icon-button" ng-click="ShowModal($event,\'' + device + '\',\'' + data.Name + '\',\'' + data.IsOnline + '\')" aria-label="">' +
            //     '<md-icon md-font-icon="icon-map-marker" class="s18 deep-purple-500-fg"></md-icon> <md-tooltip md-visible="" md-direction="">Location </md-tooltip>' +
            //     '</md-button>';
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
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.toggle1 = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };

        $scope.SendCommand = function() {
            console.log($scope.selected)
            $http.get($rootScope.RoutePath + "vehicles/getAllDefaultValue").then(function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].Type == 'MaxSpeed') {
                        $scope.MaxSpeed = data.data[i].Value
                    }
                    if (data.data[i].Type == 'SleepMode') {
                        $scope.SleepMode = data.data[i].Value
                    }
                    if (data.data[i].Type == 'GPRSInterval') {
                        $scope.GPRSInterval = data.data[i].Value
                    }
                    if (data.data[i].Type == 'GPRSStopInterval') {
                        $scope.GPRSStopInterval = data.data[i].Value
                    }
                    if (data.data[i].Type == 'Arm') {
                        $scope.Arm = data.data[i].Value
                    }
                    if (data.data[i].Type == 'OdoMeter') {
                        $scope.OdoMeter = data.data[i].Value
                    }
                    if (data.data[i].Type == 'HeartbeatInterval') {
                        $scope.HeartbeatInterval = data.data[i].Value
                    }

                }
                // $scope.selected.push()
                var params = {
                    objDevice: $scope.selected,
                    MaxSpeed: $scope.MaxSpeed,
                    SleepMode: $scope.SleepMode,
                    TimeInterval: $scope.GPRSInterval,
                    GPRSStopInterval: $scope.GPRSStopInterval,
                    Arm: $scope.Arm,
                    odometer: $scope.OdoMeter,
                    HeartbeatInterval: $scope.HeartbeatInterval,
                }
                $http.get($rootScope.RoutePath + "socketapi/SendCommandToDevice", { params: params }).then(function(data) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );


                })
            })


        }

        $scope.init();


    }

})();