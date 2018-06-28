(function() {
    'use strict';

    angular
        .module('app.apiaccess')
        .controller('ApiAccessController', ApiAccessController);

    /** @ngInject */
    function ApiAccessController($http, $scope, $rootScope, $mdDialog, $mdToast, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $compile) {

        var vm = this;

        $scope.init = function() {
            $scope.initapiaccess();
            $scope.flag = false;
        }

        $scope.initapiaccess = function() {
            $scope.model = {
                id: 0,
                Name: '',
                Phone: '',
                Email: '',
                AppName: '',
                IsActive: true,
            }
            $scope.GetAllInfoList();
        }

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreatedDate').renderWith(numberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnBuilder.newColumn('Name'),
            DTColumnBuilder.newColumn('Phone'),
            DTColumnBuilder.newColumn('Email'),
            DTColumnBuilder.newColumn('AppName'),
            DTColumnBuilder.newColumn('Token'),
            DTColumnBuilder.newColumn('Key'),
            DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
            DTColumnBuilder.newColumn('IsActive').renderWith(IsActiveHtml),
            DTColumnBuilder.newColumn(null).renderWith(actionHtml).notSortable().withOption('width', '10%').notSortable().withOption('class', 'text-center'),
        ]


        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(req, res) {
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "apiaccess/GetAllAccessClient",
                    data: function(d) {
                        d.search = $scope.Search;
                        return d
                    },
                    type: 'get',
                    dataSrc: (function(json) {
                        if (json.success != false) {
                            $scope.$apply(function() {
                                $scope.getApiAccess = json.data;
                            })
                            return json.data;
                        } else {
                            return [];
                        }
                    })
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withDisplayLength(25)
                .withOption('aaSorting', [1, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto')
        })
        $scope.dtInstance = {};
        //Reload Datatable
        $scope.GetAllApiAccess = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };

            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#apiaccess').dataTable()._fnPageChange(0);
            $('#apiaccess').dataTable()._fnAjaxUpdate();

        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function numberHtml(type, data, full, meta) {
            return (meta.row + 1)
        }


        function dateFormat(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }

        function IsActiveHtml(data, type, full, meta) {
            var result = '';
            if (full.IsActive == 1) {
                result = '<md-button  style="font-size: 20px;color: green"  ng-click="UpdateStatus(' + full.id + ')"> &#x2714;<md-tooltip md-visible="" md-direction="">DeActive</md-tooltip></md-button>';
            }
            if (full.IsActive == 0) {
                result = '<md-button style="font-size: 20px;color: red"  ng-click="UpdateStatus(' + full.id + ')">&#x2716;<md-tooltip md-visible="" md-direction="">Active</md-tooltip></md-button>';
            }
            return result;
        }

        function actionHtml(data, type, full, meta) {
            var btns = '<div layout="row" layout-align="center">';

            if ($rootScope.FlgModifiedAccess) {

                btns += '<md-button class="edit-button md-icon-button"  ng-click="AddDevice(' + full.id + ',$event)" aria-label="Add device">' +
                    '<md-icon md-font-icon="icon-plus-circle"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Give Access</md-tooltip>' +
                    '</md-button>';
            }

            if ($rootScope.FlgModifiedAccess) {

                btns += '<md-button class="edit-button md-icon-button"  ng-click="EditApiAccess(' + full.id + ')" aria-label="Edit apiaccess">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DelApiAccess(' + full.id + ')" aria-label="Del apiaccess">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';
            return btns;
        }

        $scope.AddDevice = function(id, ev) {
            var obj = _.findWhere($scope.getApiAccess, { id: parseInt(id) })
            if (obj) {
                $mdDialog.show({
                    controller: 'devicemodelController',
                    controllerAs: vm,
                    templateUrl: 'app/main/ApiAccess/dialogs/adddevice/adddevice.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clcikOutsideToClose: true,
                    locals: {
                        event: ev,
                        VM: vm,
                        AppName: obj.AppName,
                        apiaccessid: id,
                    }
                })
            }

        }

        $scope.AddnewAPIAccess = function() {
            $scope.flag = true;
            $scope.initapiaccess();
            $scope.FormAccessCLient.$setPristine();
            $scope.FormAccessCLient.$setUntouched();
        }

        $scope.EditApiAccess = function(id) {
            $scope.initapiaccess();
            var o = _.findWhere($scope.getApiAccess, {
                id: id
            });
            $scope.flag = true;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.Phone = o.Phone;
            $scope.model.Email = o.Email;
            $scope.model.AppName = o.AppName;
            $scope.model.IsActive = o.IsActive == 1 ? true : false;

        }

        $scope.CreateApiAccess = function(o) {
            o.AppName = _.findWhere($scope.lstAppInfo, { id: o.AppName }).AppName
            console.log(o)
            $http.post($rootScope.RoutePath + "apiaccess/SaveAccessClient", o).then(function(data) {
                if (data.data.success == true) {
                    $scope.flag = false;
                    $scope.initapiaccess();
                    $scope.GetAllApiAccess(true);

                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            })
        }

        $scope.UpdateStatus = function(id) {
            var message = '';
            var IsActive = 0;
            var o = _.findWhere($scope.getApiAccess, {
                id: id
            });
            if (o.IsActive == 1) {
                message = 'Are you sure to Deactivate this API Access'

            } else {
                message = 'Are you sure to Activate this API Access'
                IsActive = 1;

            }
            var confirm = $mdDialog.confirm()
                .title(message)
                .textContent('')
                .ariaLabel('Lucky day')
                // .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id,
                    IsActive: IsActive
                }
                $http.get($rootScope.RoutePath + "apiaccess/UpdateIsActiveStatus", { params: params }).then(function(data) {
                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        // $scope.ResetModel();
                        $scope.GetAllApiAccess(true);
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

        $scope.DelApiAccess = function(id) {
            var confirm = $mdDialog.confirm()
                .title("Are you sure to delete this data ?")
                .ok("Yes")
                .cancel("No");
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id
                }
                $http.get($rootScope.RoutePath + "apiaccess/DelAccessClient", { params: params })
                    .success(function(data) {
                        if (data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.GetAllApiAccess();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    })
            })
        }

        $scope.ResetData = function() {
            $scope.initapiaccess();
            $scope.FormAccessCLient.$setPristine();
            $scope.FormAccessCLient.$setUntouched();
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllApiAccess();
        }

        $scope.Reset = function() {
            $scope.flag = false;
            $scope.init();
        }

        $scope.GoToLIst = function() {
            $scope.flag = false;
            $scope.init();
        }

        $scope.clearSearchTerm = function() {
            $scope.searchTermidAppName = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        $scope.init();
    }

})();