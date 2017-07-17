(function() {
    'use strict';

    angular
        .module('app.City')
        .controller('StateModelController', StateModelController);

    /** @ngInject */
    function StateModelController($http, $mdDialog, $compile,  $mdToast, $scope, $rootScope, $cookieStore, objState, Tasks, event, StateVM, DTOptionsBuilder, DTColumnDefBuilder,DTColumnBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                Name: '',
                idCountry: 0,
                ShortName: '',
                CreatedBy: '',
                CreatedDate: null,
            };
            // GetCountryState(true);
            GetAllCountry();
        }


        if (objState == 0) {
            $scope.tab = { selectedIndex: 1 };
        } else {}


        // function GetCountryState() {
        //     $http.get($rootScope.RoutePath + "state/GetAllState").then(function (data) {
        //         $scope.lstCountryState = data.data;
        //     });
        // }

        function GetAllCountry() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        //Dynamic Pagging
        $scope.lstCountryState = [];
        $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml),
                DTColumnBuilder.newColumn('tblcountrymgmt.Country'),
                DTColumnBuilder.newColumn('Name'),
                DTColumnBuilder.newColumn('ShortName'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]
            // ShowTrackNumberModal
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "state/GetAllStateByPagging",
                data: function(d) {
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        $scope.lstCountryState = json.data
                        return json.data;
                    } else {
                        return [];
                    }
                },
            })
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('responsive', true)
            .withOption('aaSorting', [2, 'asc'])
            .withOption('autoWidth', false)
            .withOption('createdRow', createdRow);

        $scope.dtInstance = {};

        //Reload Datatable
        function GetCountryState(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
        }

        $scope.reloadData = function() {}

        function callback(json) {}

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function actionsHtml(data, type, full, meta) {
            var btn = '';

            btn = btn + '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-click="FetchStateById(' + full.id + ')">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                '</md-button>' +
                '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-click="DeleteState(' + full.id + ',' + full.idCountry + ')">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' +
                '</md-button>';
            return btn;
        };



        //Get State by Id

        $scope.FetchStateById = function(id) {
            var o = _.findWhere($scope.lstCountryState, { id: id });
            $scope.restStateModel();
            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.ShortName = o.ShortName;
            $scope.model.idCountry = o.idCountry;
            $scope.model.CreatedDate = o.CreatedDate;
        }

        //Create State

        $scope.CreateState = function(o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            } else {
                o.ModifyDate = new Date();
            }
            o.CreatedBy = 'Admin';
            $http.post($rootScope.RoutePath + "state/SaveState", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.tab = { selectedIndex: 0 };
                    GetCountryState(true)
                    StateVM.GetAllStateByCountry(o.idCountry);
                    $scope.init();

                } else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
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
        }

        //Delete State

        $scope.DeleteState = function(id, idCountry) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    StateId: id
                };
                $http.get($rootScope.RoutePath + "state/DeleteState", { params: params }).success(function(data) {
                    console.log(data);
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.tab = { selectedIndex: 0 };

                        GetCountryState(true)
                        StateVM.GetAllStateByCountry(idCountry);
                        $scope.init();
                    } else {
                        if (data.data) {
                            if (data.data.data == 'TOKEN') {
                                //$cookieStore.remove('UserName');
                                //$cookieStore.remove('token');
                                //window.location.href = '/app/login';
                                $rootScope.logout();
                            } else {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(data.message)
                                    .position('top right')
                                    .hideDelay(3000)
                                );
                            }
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

        $scope.Reset = function() {
            $scope.tab = { selectedIndex: 0 };
            //$mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.restStateModel = function() {
            $scope.formState.$setUntouched();
            $scope.formState.$setPristine();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: '',
                Name: '',
                idCountry: 0,
                ShortName: '',
                CreatedBy: '',
                CreatedDate: null,
            };
            $scope.restStateModel();
        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            //DTColumnDefBuilder.newColumnDef(4),
            // DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.init();

    }
})();
