(function() {
    'use strict';

    angular
        .module('app.Setting')
        .controller('SettingController', SettingController);

    /** @ngInject */
    function SettingController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {

        $scope.int = function() {
            $scope.model = {
                id: 0,
                Name: '',
                AndroidVersion: '',
                IOSVersion: '',
                AndroidURL: '',
                IOSURL: '',
                UpdateAppText: '',
            }
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            $scope.nameflag = false;
            $scope.getAllAppName();
            $scope.getAllAppVersion();
        }
        $scope.getAllAppName = function() {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppName").then(function(data) {
                $scope.lstAppName = data.data.data;
            })
        }
        $scope.getAllAppVersion = function() {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppVersion").then(function(data) {
                $scope.lstAppVersion = data.data;
            })
        }
        $scope.GetAppVersionByName = function(Name) {
            var params = {
                Name: Name
            }
            $http.get($rootScope.RoutePath + "appsetting/GetAppVersionByName", { params: params }).then(function(data) {
                if (data.data != null) {
                    $scope.model = data.data;
                }
            })
        }

        $scope.SaveAppVersion = function(o) {
            $http.post($rootScope.RoutePath + "appsetting/SaveAppVesionInfo", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    $scope.nameflag = true;
                    $scope.getAllAppName();
                    $scope.getAllAppVersion();
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
        $scope.editAppVersionById = function(o) {
            $scope.flag = true;
            $scope.nameflag = true;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.AndroidVersion = o.AndroidVersion;
            $scope.model.IOSVersion = o.IOSVersion;
            $scope.model.AndroidURL = o.AndroidURL;
            $scope.model.IOSURL = o.IOSURL;
            $scope.model.UpdateAppText = o.UpdateAppText;
        }

        $scope.DeleteAppVersion = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this App Version Info ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "appsetting/DeleteAppVersion", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.getAllAppName();
                        $scope.getAllAppVersion();
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
            $scope.formAppSetting.$setUntouched();
            $scope.formAppSetting.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                AndroidVersion: '',
                IOSVersion: '',
                AndroidURL: '',
                IOSURL: '',
                UpdateAppText: '',
            }
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.nameflag = false;
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                AndroidVersion: '',
                IOSVersion: '',
                AndroidURL: '',
                IOSURL: '',
                UpdateAppText: '',
            }
            $scope.flag = false;
            $scope.nameflag = false;
            $scope.resetForm();
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7).notSortable()
        ];

        $scope.dtInstance = {};
        $scope.dtOptions = {

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
            responsive: true
        };
        $scope.int();

    }
})();