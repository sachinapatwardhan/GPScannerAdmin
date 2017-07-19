(function() {
    'use strict';

    angular
        .module('app.City')
        .controller('CityController', CityController)
        /** @ngInject */
    function CityController($http, $scope, $rootScope, $compile, $state, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var vm = this;

        vm.GetAllCountry = GetAllCountry;
        vm.GetAllStateByCountry = GetAllStateByCountry;
        vm.isFormValid = isFormValid;
        vm.searchTermCountry = '';
        vm.searchTermState = '';

        $scope.init = function() {
            $scope.model = {
                id: '',
                Name: '',
                idState: 0,
                idCountry: '',
                Seq: null,
                ShortName: '',
                CreatedBy: '',
                CreatedDate: null,
            };
            $scope.idcountry = '';

            // $scope.GetAllCity();
            GetAllCountry();
            $scope.Search = '';
            $scope.flag = false;
        }

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }
        $scope.clearSearchTerm = function() {
            vm.searchTermCountry = '';
            vm.searchTermState = '';
            // $scope.searchTermCity = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        // $scope.GetAllCity = function() {
        //     $http.get($rootScope.RoutePath + "city/GetAllCity").then(function(data) {
        //         $scope.lst = data.data;
        //     });
        // }

        function GetAllCountry() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        function GetAllStateByCountry(idCountry) {
            $scope.lstState = '';
            var params = {
                CountryId: idCountry
            };
            $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(data) {
                $scope.lstState = data.data;

            });
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.lst = [];
            $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml).withOption('width', '4%'),
                    DTColumnBuilder.newColumn('tblcountrystatemgmt.tblcountrymgmt.Country').withOption('width', '10%'),
                    DTColumnBuilder.newColumn('tblcountrystatemgmt.Name').withOption('width', '10%'),
                    DTColumnBuilder.newColumn('Name').withOption('width', '10%'),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('width', '10%')
                ]
                // ShowTrackNumberModal
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "city/GetAllCityByPagging",
                    data: function(d) {
                        d.search.value = $scope.Search;

                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lst = json.data
                            $scope.recordsTotal = json.recordsTotal;
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
                .withOption('aaSorting', [2, 'asc'])
                .withOption('responsive', true)
                // .withOption('autoWidth', false)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });

        $scope.dtInstance = {};

        //Reload Datatable
        function GetAllCity(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#citytable').dataTable()._fnAjaxUpdate();
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
            if ($rootScope.FlgModifiedAccess) {
                btn += '<md-button class="edit-button md-icon-button"  ng-click="FetchListId(' + full.id + ')">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btn += '<md-button class="edit-button md-icon-button" ng-click="DeleteList(' + full.id + ')">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btn += '</div>';
            return btn;
        };

        $scope.GetSerch = function(Search) {
                $scope.Search = Search;
                GetAllCity(true);
            }
            //Create Country-State-City

        $scope.CreateList = function(o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            } else {
                o.ModifyDate = new Date();
            }
            o.CreatedBy = 'Admin';
            $http.post($rootScope.RoutePath + "city/SaveCity", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    GetAllCity(true);
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }
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

        //Get Country-State-City by Id

        $scope.FetchListId = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.restForm();

            var o = _.findWhere($scope.lst, { id: id });
            //$scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.idState = o.idState;
            $scope.model.idCountry = o.tblcountrystatemgmt.tblcountrymgmt.id;

            //Get State by Country Id
            GetAllStateByCountry($scope.model.idCountry);
            $scope.model.Name = o.Name;
            $scope.model.Seq = o.Seq;
            $scope.model.ShortName = o.ShortName;
            $scope.model.CreatedDate = o.CreatedDate;
            $scope.flag = true;

        }

        //Delete Country-State-City

        $scope.DeleteList = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    CityId: id
                };
                $http.get($rootScope.RoutePath + "city/DeleteCity", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        GetAllCity(true);
                        $scope.init();
                    } else if (data.success == false) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
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
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.init();
        }


        //vm.dtOptions = DTOptionsBuilder.newOptions()
        //    .withPaginationType('full_numbers')
        //    .withDisplayLength(10)
        //    .withOption('responsive', true)
        //    .withOption('autoWidth', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //    .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            // DTColumnDefBuilder.newColumnDef(5)
        ];


        $scope.restForm = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.form.$setUntouched();
                $scope.form.$setPristine();
            }
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: '',
                Name: '',
                idState: 0,
                idCountry: $scope.idcountry,
                CreatedBy: '',
                CreatedDate: null,
            };
            $scope.restForm();
            GetAllStateByCountry($scope.model.idCountry);
            $scope.flag = true;
        }

        //Add Country

        $scope.AddCountry = function(ev) {
            $mdDialog.show({
                controller: 'CountryModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/City/dialogs/Country/CountryModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objCountry: 0,
                    Tasks: [],
                    event: ev,
                    CountryVM: vm
                }
            })
        }

        $scope.FetchCountryById = function(ev) {
            $mdDialog.show({
                controller: 'CountryModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/City/dialogs/Country/CountryModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objCountry: 1,
                    Tasks: [],
                    event: ev,
                    CountryVM: vm
                }
            })
        }

        $scope.DeleteCountry = function(ev) {
            $scope.FetchCountryById(ev);
        }


        //Add State

        $scope.AddState = function(ev) {
            $mdDialog.show({
                controller: 'StateModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/City/dialogs/State/StateModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objState: 0,
                    Tasks: [],
                    event: ev,
                    StateVM: vm
                }
            })
        }

        $scope.FetchStateById = function(ev) {
            $mdDialog.show({
                controller: 'StateModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/City/dialogs/State/StateModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objState: 1,
                    Tasks: [],
                    event: ev,
                    StateVM: vm
                }
            })
        }

        $scope.DeleteState = function(ev) {
            $scope.FetchStateById(ev);
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }
        $scope.gotoOrderList = function() {
            $scope.init();
        }
        $scope.init();
    }

})();