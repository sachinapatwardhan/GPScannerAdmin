(function() {
    'use strict';

    angular
        .module('app.SharedVehicle')
        .controller('SharedVehicleController', SharedVehicleController);

    /** @ngInject */
    function SharedVehicleController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.AppName = localStorage.getItem('appName');
        $scope.idApp = parseInt(localStorage.getItem('appId'));
        $scope.init = function() {
            $scope.model = {
                DeviceId: '',
                idSharedUser: '',
                email: '',
                idVehicle: '',
                IsActive: 1,
                IsSharedUserNotification: 1,
                IsNotification: 1,
                idApp: $scope.idApp,
            }
            $scope.modelDisplay = { Shareemail: '' };
            $scope.flag = false;
            $rootScope.FlgAddedEditlocal = true;

            $scope.GetAllInfoList();
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
                $scope.GetAllSharedVehicle();
                $scope.GetUserByName();
            })
        }
        $scope.GetAllSharedVehicle = function() {
            var params = {
                appId: $scope.idApp,
            }
            $http.get($rootScope.RoutePath + "sharedevice/GetAllSharedVehicle", { params: params }).success(function(data) {
                $scope.lstDevice = data;
            })
        }

        $scope.ChangeAppName = function() {
            $scope.idApp = $scope.model.idApp;
            $scope.model = {
                DeviceId: '',
                idSharedUser: '',
                email: '',
                idVehicle: '',
                IsActive: 1,
                IsSharedUserNotification: 1,
                IsNotification: 1,
                idApp: $scope.idApp,
            }
            $scope.modelDisplay = { Shareemail: '' };

            $scope.GetAllSharedVehicle();
            $scope.GetUserByName();
        }

        $scope.AddUserEmail = function(DeviceId) {
            var obj = _.filter($scope.lstDevice, { deviceId: (DeviceId).toString() });
            $scope.model.idSharedUser = obj[0].id;
            $scope.modelDisplay.Shareemail = obj[0].email;
            $scope.model.idVehicle = obj[0].idVehicle;
        }

        $scope.GetUserByName = function() {
            var params = {
                appId: $scope.idApp,
            }
            $http.get($rootScope.RoutePath + "user/GetAllUser", { params: params }).then(function(data) {
                $scope.lstUser = data.data;
            });

        }
        if ($rootScope.UserRoles == 'Super Admin') {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('sharedUser'),
                DTColumnBuilder.newColumn('email'),
                DTColumnBuilder.newColumn('AppName'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]
        } else {
            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('sharedUser'),
                DTColumnBuilder.newColumn('email'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]
        }
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "sharedevice/GetAllSharedUser",
                data: function(d) {
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.appId = localStorage.getItem('appId')
                    }
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
            .withDisplayLength(25) // Page size
            .withOption('aaSorting', [5, 'desc'])
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
            .withOption('scrollY', 'auto');
        vm.dtInstance = {};
        vm.dtInstance1 = {};

        //Reload Datatable
        $scope.GetAllShareDevice = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            }


            if ($rootScope.UserRoles == 'Super Admin') {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#sharevehicle').dataTable()._fnAjaxUpdate();
            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#sharevehicle1').dataTable()._fnAjaxUpdate();
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

        function Datefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                // return $filter('date')(data, "dd-MM-yyyy");
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        function Datetimefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                var newdate = data * 1000;
                return moment(moment.utc(newdate).toDate()).format("DD/MM/YYYY hh:mm A");
            } else {
                return '';
            }
        }

        function actionsHtml(data, type, full, meta) {
            var event = '$event';
            var btns = '<div layout="row">';
            // if ($rootScope.FlgDeletedAccess) {
            btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteShareVehicle(' + data.id + ')">' +
                '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                '</md-button>';
            // }

            btns += '</div>';
            return btns;
        };

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllShareDevice(true);
        }
        $scope.SearchReset = function() {

            $scope.GetAllShareDevice(true);
        }

        $scope.shareVehicle = function() {
            $http.post($rootScope.RoutePath + 'sharedevice/SaveSharedUserNew', $scope.model).success(function(data) {
                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetModel();
                    $scope.GetAllShareDevice(true);
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
            })
        }

        $scope.DeleteShareVehicle = function(id) {
            var o = _.filter($scope.lstdata, { id: id })
            o = o[0]
            var confirm = $mdDialog.confirm()
                .title('Are you sure to stop sharing device?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: o.id,
                    UserId: o.idUser,
                    idSharedUser: o.idSharedUser,
                    DeviceId: o.DeviceId
                };
                $http.get($rootScope.RoutePath + "sharedevice/RemoveSharedUser", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllShareDevice(true);
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
        $scope.resetForm = function() {
            $scope.FormshareVehicle.$setUntouched();
            $scope.FormshareVehicle.$setPristine();
        }
        $scope.Reset = function() {
            // $rootScope.FlgAddedEditlocal = false;
            // if ($rootScope.FlgAddedAccess == true) {
            //     $rootScope.FlgAddedEditlocal = true;
            // }
            $scope.model = {
                DeviceId: '',
                idSharedUser: '',
                email: '',
                idVehicle: '',
                IsActive: 1,
                IsSharedUserNotification: 1,
                IsNotification: 1,
                idApp: $scope.idApp,
            }
            $scope.modelDisplay = { Shareemail: '' };
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.flag = true;
        }
        $scope.ResetModel = function() {
            $scope.Reset();
            $scope.flag = false;
        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.init();
    }

})();