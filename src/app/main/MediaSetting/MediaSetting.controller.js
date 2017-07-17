(function () {
    'use strict';

    angular
        .module('app.MediaSetting')
        .controller('MediaSettingController', MediaSettingController);

    /** @ngInject */
    function MediaSettingController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function () {
            $scope.model = {
                id: '',
                Height: 0,
                Width: 0
            };
            $scope.GetAllMediaSetting();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetAllMediaSetting = function () {
            $http.get($rootScope.RoutePath + "settings/GetAllMediaSize").then(function (data) {
                $scope.lstMediaSetting = data.data;
            });
        }

        $scope.CreateMediaSetting = function (o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            }
            else {
                o.ModifyDate = new Date();
            }
            o.CreatedBy = 'Admin';
            $http.post($rootScope.RoutePath + "settings/SaveMediaSize", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.init();
                }
                else {
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

        $scope.FetchMediaSetting = function (o) {
            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Height = o.Height;
            $scope.model.Width = o.Width;
            $scope.model.CreatedDate = o.CreatedDate;
        }

        $scope.DeleteMediaSetting = function (id) {
            var confirm = $mdDialog.confirm()
                  .title('Are you sure to Delete this Record ?')
                  .ok('Ok')
                  .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    idMediaSize: id
                };
                $http.get($rootScope.RoutePath + "settings/DeleteMediaSize", { params: params }).success(function (data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                            );
                        $scope.init();
                    }
                    else {
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
                    }
                });
            });
        };

        $scope.Reset = function () {
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
            //DTColumnDefBuilder.newColumnDef(4),
           // DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.resetForm = function () {
            $scope.formMdediaSetting.$setUntouched();
            $scope.formMdediaSetting.$setPristine();
        }


        $scope.ResetModel = function () {
            $scope.model = {
                id: '',
                Height: 0,
                Width: 0
            };
            $scope.resetForm();
        }

        $scope.init();
    }

})();
