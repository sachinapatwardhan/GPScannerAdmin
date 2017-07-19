(function() {
    'use strict';

    angular
        .module('app.UserPermission')
        .controller('UserPermissionController', UserPermissionController);

    /** @ngInject */
    function UserPermissionController($http, $scope, $mdDialog, $document, $cookieStore, $mdToast, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                RoleName: '',
            };

            $scope.modelPermission = {
                View: false,
                Add: false,
                Update: false,
                Delete: false
            };

            $scope.GetAllRoles();
            $scope.GetAllModule();
        }

        $scope.GetAllRoles = function() {
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function(response) {
                $scope.lstRoles = response.data;
            });
        }

        $scope.GetAllModule = function() {
            $http.get($rootScope.RoutePath + "module/GetAllModule").then(function(response) {
                $scope.lstModules = response.data;
                for (var i = 0; i < $scope.lstModules.length; i++) {
                    $scope.lstModules[i]["Added"] = null;
                    $scope.lstModules[i]["Deleted"] = null;
                    $scope.lstModules[i]["RoleName"] = null;
                    $scope.lstModules[i]["Show"] = null;
                    $scope.lstModules[i]["Modified"] = null;
                    $scope.lstModules[i]["idModule"] = $scope.lstModules[i].id;
                    $scope.lstModules[i].id = 0;
                }
            });
        }

        $scope.GetAllPermissionByRole = function() {
            $http.get($rootScope.RoutePath + "userPermission/GetAllPermissionByRole?RoleName=" + $scope.model.RoleName).then(function(response) {
                $scope.lstUserPermission = response.data;
                if ($scope.lstUserPermission.length > 0) {
                    $scope.ClearDataItems();
                    $scope.GetDataItems();
                } else {
                    $scope.GetAllModule();
                }
                $scope.modelPermission = {
                    View: false,
                    Add: false,
                    Update: false,
                    Delete: false
                };
            });
        }

        $scope.GetDataItems = function() {
            for (var i = 0; i < $scope.lstUserPermission.length; i++) {
                for (var j = 0; j < $scope.lstModules.length; j++) {
                    if ($scope.lstUserPermission[i].idModule == $scope.lstModules[j].idModule && $scope.model.RoleName == $scope.lstUserPermission[i].RoleName) {
                        // $scope.lstModules[j].Added = $scope.lstUserPermission[i].Added;
                        //$scope.lstModules[j].Modified = $scope.lstUserPermission[i].Modified;
                        //$scope.lstModules[j].Deleted = $scope.lstUserPermission[i].Deleted;
                        //$scope.lstModules[j].Show = $scope.lstUserPermission[i].Show;
                        if ($scope.lstUserPermission[i].Added == 1) {
                            $scope.lstModules[j].Added = true;
                        } else {
                            $scope.lstModules[j].Added = false;
                        }
                        if ($scope.lstUserPermission[i].Modified == 1) {
                            $scope.lstModules[j].Modified = true;
                        } else {
                            $scope.lstModules[j].Modified = false;
                        }
                        if ($scope.lstUserPermission[i].Deleted == 1) {
                            $scope.lstModules[j].Deleted = true;
                        } else {
                            $scope.lstModules[j].Deleted = false;
                        }
                        if ($scope.lstUserPermission[i].Show == 1) {
                            $scope.lstModules[j].Show = true;
                        } else {
                            $scope.lstModules[j].Show = false;
                        }

                    }
                }
            }
        }

        $scope.ClearDataItems = function() {
            for (var i = 0; i < $scope.lstUserPermission.length; i++) {
                for (var j = 0; j < $scope.lstModules.length; j++) {
                    $scope.lstModules[j].Added = false;
                    $scope.lstModules[j].Modified = false;
                    $scope.lstModules[j].Deleted = false;
                    $scope.lstModules[j].Show = false;
                }
            }
        }
        $scope.ChangePermission = function(o) {
            if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {
                o.RoleName = $scope.model.RoleName;
                $http.post($rootScope.RoutePath + "userPermission/ChangePermission", o).then(function(response) {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    }
                });
            } else {
                var confirm = $mdDialog.confirm()
                    .title('You must select user role.')
                    .ok('ok')
                $mdDialog.show(confirm).then(function() {

                }, function() {

                });
            }
        }

        // $scope.ChangePermissionAllView = function() {
        //     if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {
        //         for (var i = 0; i < $scope.lstModules.length; i++) {
        //             $scope.lstModules[i].Show = $scope.modelPermission.View;
        //             $scope.lstModules[i].RoleName = $scope.model.RoleName;
        //             $http.post($rootScope.RoutePath + "userPermission/ChangePermission", $scope.lstModules[i]).then(function(response) {
        //                 if (response.data.data == 'TOKEN') {
        //                     $cookieStore.remove('UserName');
        //                     $cookieStore.remove('token');
        //                     window.location.href = '/app/login';
        //                 }
        //             });
        //         }
        //     } else {
        //         var confirm = $mdDialog.confirm()
        //             .title('You must select user role.')
        //             .ok('ok')
        //         $mdDialog.show(confirm).then(function() {
        //             $scope.modelPermission.View = false;
        //         }, function() {

        //         });
        //     }
        // }

        $scope.ChangePermissionAllView = function() {
            if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {

                var obj = new Object();
                obj.Show = $scope.modelPermission.View;
                obj.Data = $scope.lstModules;
                obj.RoleName = $scope.model.RoleName;
                obj.Type = "View"

                for (var i = 0; i < $scope.lstModules.length; i++) {
                    $scope.lstModules[i].Show = $scope.modelPermission.View;
                }
                $http.post($rootScope.RoutePath + "userPermission/ChangeAllPermissions", obj).then(function(response) {
                    if (response.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                });

            } else {
                var confirm = $mdDialog.confirm()
                    .title('You must select user role.')
                    .ok('ok')
                $mdDialog.show(confirm).then(function() {
                    $scope.modelPermission.View = false;
                }, function() {

                });
            }
        }
        $scope.ChangePermissionAllAdd = function() {
            if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {

                for (var i = 0; i < $scope.lstModules.length; i++) {
                    $scope.lstModules[i].Added = $scope.modelPermission.Add;
                }

                var obj = new Object();
                obj.Show = $scope.modelPermission.Add;
                obj.Data = $scope.lstModules;
                obj.RoleName = $scope.model.RoleName;
                obj.Type = "Add"
                $http.post($rootScope.RoutePath + "userPermission/ChangeAllPermissions", obj).then(function(response) {
                    if (response.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                });

            } else {
                var confirm = $mdDialog.confirm()
                    .title('You must select user role.')
                    .ok('ok')
                $mdDialog.show(confirm).then(function() {
                    $scope.modelPermission.Add = false;
                }, function() {

                });
            }
        }

        $scope.ChangePermissionAllUpdate = function() {
            if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {

                for (var i = 0; i < $scope.lstModules.length; i++) {
                    $scope.lstModules[i].Modified = $scope.modelPermission.Update;
                }

                var obj = new Object();
                obj.Show = $scope.modelPermission.Update;
                obj.Data = $scope.lstModules;
                obj.RoleName = $scope.model.RoleName;
                obj.Type = "Update"
                $http.post($rootScope.RoutePath + "userPermission/ChangeAllPermissions", obj).then(function(response) {
                    if (response.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                });

            } else {
                var confirm = $mdDialog.confirm()
                    .title('You must select user role.')
                    .ok('ok')
                $mdDialog.show(confirm).then(function() {
                    $scope.modelPermission.Update = false;
                }, function() {

                });
            }
        }

        $scope.ChangePermissionAllDelete = function() {
            if ($scope.model.RoleName != null && $scope.model.RoleName != '' && $scope.model.RoleName != undefined) {

                for (var i = 0; i < $scope.lstModules.length; i++) {
                    $scope.lstModules[i].Deleted = $scope.modelPermission.Delete;
                }

                var obj = new Object();
                obj.Show = $scope.modelPermission.Delete;
                obj.Data = $scope.lstModules;
                obj.RoleName = $scope.model.RoleName;
                obj.Type = "Delete"
                $http.post($rootScope.RoutePath + "userPermission/ChangeAllPermissions", obj).then(function(response) {
                    if (response.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                });

            } else {
                var confirm = $mdDialog.confirm()
                    .title('You must select user role.')
                    .ok('ok')
                $mdDialog.show(confirm).then(function() {
                    $scope.modelPermission.Delete = false;
                }, function() {

                });
            }
        }
        $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(25) // Page size
            .withOption('aaSorting', [0, 'asc'])
            .withOption('responsive', true)
            .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
            .withOption('scrollY', 'auto');

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
        ];
        $scope.dtInstance = {};

        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);

            $scope.dtInstance.DataTable.search(Search).draw();
        };
        $scope.Reset = function() {
            $scope.init();
        }

        $scope.init();
    }
})();