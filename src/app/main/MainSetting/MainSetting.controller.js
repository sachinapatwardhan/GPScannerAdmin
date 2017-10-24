(function() {
    'use strict';

    angular
        .module('app.MainSetting')
        .controller('MainSettingController', MainSettingController);

    /** @ngInject */
    function MainSettingController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $scope.init = function() {
            $scope.model = {
                id: 0,
                Name: '',
                Value: '',
                StoreId: 0,
            }
            $scope.Search = '';
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            GetAllSetting();
        }


        function GetAllSetting() {
            $http.get($rootScope.RoutePath + "mainsetting/GetAllSetting").then(function(data) {
                $scope.lstSetting = data.data;
            })
        }

        $scope.SaveSetting = function(o) {

            $http.post($rootScope.RoutePath + "mainsetting/SaveSetting", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    $scope.ResetModel();
                    GetAllSetting();
                    // $scope.getAllSIMInfo();
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
        $scope.editSettingById = function(o) {
            $scope.model.id = 1;
            $scope.model.Name = o.Name;
            $scope.model.Value = o.Value;
            $scope.model.StoreId = o.StoreId;
            $scope.flag = true;
        }

        $scope.DeleteSetting = function(Name) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Setting ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Name: Name
                };
                $http.get($rootScope.RoutePath + "mainsetting/DeleteSettingeById", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        GetAllSetting();
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
        }

        $scope.resetForm = function() {
            $scope.formSetting.$setUntouched();
            $scope.formSetting.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                Name: '',
                Value: '',
                StoreId: 0,
            }
            $scope.Search = '';
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                Name: '',
                Value: '',
                StoreId: 0,
            }
            $scope.Search = '';
            $scope.flag = false;
            $scope.resetForm();
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        $scope.dtInstance = {};
        $scope.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
            // dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
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
            responsive: true
        };

        $scope.init();
        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };

    }

})();