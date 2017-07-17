(function () {
    'use strict';

    angular
        .module('app.stickyfooter')
        .controller('StickyFooterController', StickyFooterController);

    /** @ngInject */
    function StickyFooterController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.SelectImage = SelectImage;
        $scope.init = function () {
            $scope.model = {
                id: '',
                Name: '',
                URL: '',
                ImageUrl: '',


            };
            $scope.GetAllStickyFooter();
            $scope.tab = { selectedIndex: 0 };
            $scope.FlgImage = 0;
        }

        function SelectImage(o) {
            $scope.FlgImage = 1;
            $scope.model.ImageUrl = o.FileName;
            $scope.closeModal();
        }

        $scope.RemoveImage = function () {
            $scope.model.ImageUrl = '';
            $scope.FlgImage = 0;
        }

        $scope.GetAllStickyFooter = function () {
            // Data
            $http.get($rootScope.RoutePath + "stickyfooter/GetAllStickyFooter").then(function (data) {
                $scope.lstStickyFooter = data.data;
            });
        }

        $scope.DeleteStickyFooter = function (id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Sticky Footer?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                $http.get($rootScope.RoutePath + "stickyfooter/DeleteStickyFooter?idStickyFooter=" + id).then(function (data) {

                    if (data.data.success) {
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
            }, function () {
            });

        }

        $scope.FetchStickyFooterById = function (o) {

            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.URL = o.URL;
            $scope.model.ImageUrl = o.ImageUrl;
            if ($scope.model.ImageUrl != null && $scope.model.ImageUrl != '' && $scope.model.ImageUrl != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }
        }

        $scope.CreateStickyFooter = function (o, form) {
            $http.post($rootScope.RoutePath + "stickyfooter/SaveStickyFooter", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
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
        };

        $scope.ShowModal = function (ev, o) {
            $mdDialog.show({
                controller: 'ImageModelStickyFooterController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Brand/dialogs/ImageModel/ImageModel.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objMedia: o,
                    Tasks: [],
                    event: ev,
                    MediaVM: vm
                }
            });
        }

        $scope.closeModal = function () {
            $mdDialog.hide();
        };


        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),

        ];

        $scope.dtColumnDefsModal = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        $scope.ResetEdit = function () {
            $scope.FormStickyFooter.$setPristine();
            $scope.FormStickyFooter.$setUntouched();
            $scope.model = {
                id: '',
                Name: '',
                URL: '',
                ImageUrl: '',
            };
            $scope.FlgImage = 0;
        }

        $scope.Reset = function () {
            $scope.init();
        }

        $scope.init();
    }

})();


