(function() {
    'use strict';

    angular
        .module('app.TransferDevice')
        .controller('TransferDeviceController', TransferDeviceController);

    /** @ngInject */
    function TransferDeviceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        $scope.init = function() {
            $scope.GetAllDevice();
        }
        $rootScope.reload = function() {
            $scope.GetAllDevice();
            GetAllDynamicVehicles(true);
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
                DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('Name'),
                // DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('deviceid').renderWith(DeviceIdHtml),
                DTColumnBuilder.newColumn('DeviceType'),

                DTColumnBuilder.newColumn('IsOnline').notSortable().renderWith(StatusHtml).withOption('class', 'text-center'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
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
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
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
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="showDevice(' + full.id + ',' + full.deviceid.toString() + ',' + full.iduser + ')">' +
                    '<md-icon md-font-icon="icon-rotate-3d"  class="s18 blue-500- fg "></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Transfer Device</md-tooltip>' +
                    '</md-button>';
            }
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

        $scope.showDevice = function(id, device, userId) {
            var o = _.findWhere($scope.lstVehicledata, { id: id })
            ShowLoader();
            setTimeout(function() {
                $mdDialog.show({
                    controller: 'DeviceDetailCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/TransferDevice/dialogs/DeviceDetail/DeviceDetail.html',
                    parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    locals: {
                        id: id,
                        userId: userId,
                        lstDevice: $scope.lstDevice,
                        olddeviceid: o.deviceid,
                    }
                });
                HideLoader();
            }, 100);

        }
        $scope.GetAllDevice = function(idUser) {

            $http.get($rootScope.RoutePath + "vehicles/GetAllNotAssignDevice").then(function(data) {
                $scope.lstDevice = data.data.data;

            });
        }

        function ShowLoader() {
            document.getElementById('processing1').style.display = "block";
            document.body.scrollTop = "0px";
        }

        function HideLoader() {
            document.getElementById('processing1').style.display = "none";
        }

        $scope.init();
    }

})();