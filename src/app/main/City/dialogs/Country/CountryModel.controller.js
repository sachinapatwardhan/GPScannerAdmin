(function() {
    'use strict';

    angular
        .module('app.City')
        .controller('CountryModelController', CountryModelController);

    /** @ngInject */
    function CountryModelController($http, $mdDialog, $compile, $mdToast, $scope, $rootScope, $cookieStore, objCountry, Tasks, event, CountryVM, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                Code: null,
                Country: '',
                ShortName: '',
                Seq: null,
                CreatedBy: '',
                CreatedDate: null,
            };
            // GetAllCountry(true);
        }

        if (objCountry == 0) {
            $scope.tab = { selectedIndex: 1 };
        } else {}

        /*  function GetAllCountry() {
              $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (data) {
                  $scope.lstCountry = data.data;
              });
          }*/


        //Dynamic Pagging
        $scope.lstCountry = [];
        $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml),
                DTColumnBuilder.newColumn('Code'),
                DTColumnBuilder.newColumn('Country'),
                DTColumnBuilder.newColumn('ShortName'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]
            // ShowTrackNumberModal
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "country/GetAllCountryByPagging",
                data: function(d) {
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        $scope.lstCountry = json.data
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
        function GetAllCountry(IsUpdate) {
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

            btn = btn + '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-click="FetchCountryById(' + full.id + ')">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                '</md-button>' +
                '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-click="DeleteCountry(' + full.id + ')">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' +
                '</md-button>';

            return btn;
        };

        $scope.CreateCountry = function(o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            } else {
                o.ModifyDate = new Date();
            }
            $http.post($rootScope.RoutePath + "country/SaveCountry", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.tab = { selectedIndex: 0 };
                    GetAllCountry(true);
                    $scope.restForm();

                    CountryVM.GetAllCountry();
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

        $scope.FetchCountryById = function(id) {
            var o = _.findWhere($scope.lstCountry, { id: id });
            console.log(o)
            $scope.restForm();

            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Code = o.Code;
            $scope.model.Country = o.Country;
            $scope.model.ShortName = o.ShortName;
            $scope.model.CreatedDate = o.CreatedDate;
        }

        $scope.DeleteCountry = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idCountry: id,
                    CountryId: id
                };
                $http.get($rootScope.RoutePath + "country/DeleteCountry", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        GetAllCountry(true);
                        CountryVM.GetAllCountry();
                        $scope.restForm();
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
            $scope.init();
            $scope.tab = { selectedIndex: 0 };
            //$mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.restForm = function() {
            $scope.formCountry.$setUntouched();
            $scope.formCountry.$setPristine();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: '',
                Code: null,
                Country: '',
                ShortName: '',
                Seq: null,
                CreatedBy: '',
                CreatedDate: null,
            };
            $scope.restForm();
        }

        $scope.init();
    }
})();
