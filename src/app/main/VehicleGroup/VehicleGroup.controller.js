(function () {
    'use strict';

    angular
        .module('app.VehicleGroup')
        .controller('VehiclesGroupController', VehiclesGroupController)
        .directive('mdOption', function () {
            return {
                link: function (scope, elem) {
                    scope.$on('$destroy', function () {
                        elem.detach();
                    });
                }
            };
        });

    /** @ngInject */
    function VehiclesGroupController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $rootScope.AppName = localStorage.getItem('appName');
        $scope.modelApp = {
            AppName: $rootScope.AppName
        }
        $scope.init = function () {
            $scope.InitModel();
            $scope.selectedItem = null;
            $scope.Search = '';
            $scope.flag = false;
            $scope.lstVehicleGroup = [];
            $scope.lstVehicle = [];
            $rootScope.appId = localStorage.getItem('appId');
            $scope.clearSearchTerm();
        }

        var pendingSearch = angular.noop;
        $scope.clearSearchTerm = function () {
            vm.searchTermVehicleGroup = '';
            vm.searchTermVehicle = '';
        };
        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
        }

        $scope.GetUserByName = function (query) {
            var params = {
                UserName: query,
                appId: localStorage.getItem('appId'),
            }
            return $http.get($rootScope.RoutePath + "user/GetUserByName", { params: params }).then(function (data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });
            // return pendingSearch;
        }

        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function (q) {
            if (q != null && q != undefined && q != '') {
                $scope.model.IdUser = q.id;
                if ($scope.model.id == 0) {
                    $scope.model.IdGroup = '';
                    $scope.model.idVehicle = '';
                }
                $scope.GetAllGroupUserWise($scope.model.IdUser);
                $scope.GetAllVehicleUserWise($scope.model.IdUser);
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.IdUser = '';
                $scope.model.IdGroup = '';
                $scope.model.idVehicle = '';
                $scope.lstVehicleGroup = [];
                $scope.lstVehicle = [];
                $scope.flgErrorNotFound = 1;
            };
        }


        $scope.GetAllGroupUserWise = function (iduser) {
            var params = {
                IdUser: iduser
            }
            $http.get($rootScope.RoutePath + "vehiclegroup/GetAllGroupUserWise", { params: params }).success(function (resData) {
                $scope.lstVehicleGroup = resData;
            })
        }

        $scope.GetAllVehicleUserWise = function (iduser) {
            var params = {
                IdUser: iduser
            }
            $http.get($rootScope.RoutePath + "vehiclegroup/GetAllVehicleUserWise", { params: params }).success(function (resData) {
                $scope.lstVehicle = resData;
            })
        }

        $scope.GetSerch = function (Search) {
            $scope.Search = Search;
            GetAllDynamicVehicles(true);
        }

        function GetAllDynamicVehicles(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            vm.dtInstance1.reloadData(callback, resetPaging);
            $('#VehicleGroup').dataTable()._fnAjaxUpdate();
        }

        $scope.CreateVehicleGroup = function (o) {
            $http.post($rootScope.RoutePath + "vehiclegroup/SaveVehicleGroup", o).then(function (data) {
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

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('tblvehiclegroup.GroupName'),
                DTColumnBuilder.newColumn('tblvehiclegroup.tbluserinformation.username'),
                DTColumnBuilder.newColumn('tblvehiclegroup.tbluserinformation.tblappinfo.AppName'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "vehiclegroup/GetvehicleGroupWise",
                data: function (d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    d.AdvanceSearch = $scope.modelSearch;
                    d.appId = $rootScope.appId;
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    if (json.success != false) {
                        $scope.lstVehicleGroupdata = json.data;
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
                .withOption('aaSorting', [1, 'Desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        vm.dtInstance1 = {};

        function actionsHtml(data, type, full, meta) {
            var device = data.deviceid;
            var event = '$event';
            var btns = '<div layout="row" layout-align="center">';
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchVehicleGroupById(' + data.id + ')">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteVehicleGroup(' + data.id + ',$event)">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';
            return btns;
        };


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

        $scope.FetchVehicleGroupById = function (id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstVehicleGroupdata, {
                id: id
            });
            $scope.model.IdGroup = o.tblvehiclegroup.Id.toString();
            $scope.model.idVehicle = o.id.toString();
            $scope.selectedItem = null;
            $scope.VehicleName = o.Name;
            $scope.GetUserById(o.tblvehiclegroup.IdUser);
            $scope.model.id = o.id;
            $scope.model.idUser = o.tblvehiclegroup.IdUser;
            $scope.flag = true;
        }
        $scope.GetUserById = function (id) {
            $http.get($rootScope.RoutePath + "user/GetUserById?idUser=" + id).then(function (data) {
                if (data.data.success == true) {
                    $scope.objUser = data.data.data;
                    $scope.selectedItem = $scope.objUser;
                }
            })
        }

        $scope.DeleteVehicleGroup = function (id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Vehicle Group ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    id: id
                };
                $http.get($rootScope.RoutePath + "vehiclegroup/DeleteVehicleGroup", {
                    params: params
                }).success(function (data) {
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



        $scope.resetForm = function () {
            $scope.FormVehicleGroup.$setUntouched();
            $scope.FormVehicleGroup.$setPristine();
        }

        $scope.ResetTab = function () {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }

        $scope.Reset = function () {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.InitModel();
            $scope.flag = true;

        }

        $scope.cancel = function () {
            $scope.ResetData();
            $scope.flag = false;
        }

        $scope.ResetData = function () {
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.clearSearchTerm();
            $scope.InitModel();
        }

        $scope.InitModel = function () {
            $scope.model = {
                IdGroup: '',
                IdUser: '',
                idVehicle: '',
                id: 0,
            };
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
        $scope.init();
    }

})();