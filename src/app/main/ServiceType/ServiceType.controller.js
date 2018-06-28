(function() {
    'use strict';

    angular
        .module('app.ServiceType', [])
        .controller('ServiceTypeController', ServiceTypeController);

    /** @ngInject */
    function ServiceTypeController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.Reset = Reset;
        $scope.init = function() {

            $scope.model = {
                id: 0,
                Type: '',
                Month: '',
            };

            $scope.flag = false;
            $scope.FlgImage = 0;
            $scope.GetAllSevice();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.clearSearchTerm = function() {
            vm.searchLanguageCulture = '';
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        $scope.gotoList = function() {
            $scope.model = {
                id: 0,
                Type: '',
                Month: '',
            };
            $scope.GetAllSevice();
            $scope.Search = '';
            $scope.flag = false;
        }

        $scope.GetAllSevice = function() {
            $http.get($rootScope.RoutePath + "serviceenhancement/GetAllServiceEnhacementType").then(function(data) {
                $scope.lstServiceType = data.data;
            });
        }

        $scope.CreateService = function(o) {
            console.log(o)
            $http.post($rootScope.RoutePath + "serviceenhancement/SaveServiceType", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }
                    $scope.GetAllSevice();
                    $scope.ResetModel();
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
        }

        $scope.FetchLanguageById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model = o;
            $scope.flag = true;
        }

        $scope.DeleteSevice = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Service Type ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id
                };
                console.log(params)
                $http.get($rootScope.RoutePath + "serviceenhancement/DeleteSevcieType", { params: params }).success(function(data) {
                    console.log(data)
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                    } else {

                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );

                    }
                });
            });
        };

        function Reset() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable().withOption('class', 'text-center'),

        ];

        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
            columnDefs: [],
            initComplete: function() {
                var api = this.api(),
                    searchBox = angular.element('body').find('#modelsearch');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function(event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType: 'full_numbers',
            lengthMenu: [25, 30, 50, 100],
            pageLength: 25,
            scrollY: 'auto',
            responsive: true,
            // autoWidth: false,
        };

        $scope.restForm = function() {
            $scope.formServiceType.$setUntouched();
            $scope.formServiceType.$setPristine();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }
        $scope.ResetModel = function() {
            $scope.FlgImage = 0;
            $scope.model = {
                id: 0,
                Type: '',
                Month: '',
            };
            $scope.restForm();
            $scope.flag = false;
        }
        $scope.ResetData = function() {
            $scope.FlgImage = 0;
            $scope.model = {
                id: 0,
                Type: '',
                Month: '',
            };
            $scope.restForm();
        }


        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
        $scope.openModel = function(id) {
            $mdDialog.show({
                controller: 'CountryModelCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/ServiceType/dialogs/CountryModel/CountryModel.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    id: id,
                }
            });
        }

    }

})();