(function() {
    'use strict';

    angular
        .module('app.Widget')
        .controller('WidgetController', WidgetController);

    // function DialogController($http, $scope, $mdToast, $document, $mdDialog, $stateParams) {}

    /** @ngInject */
    function WidgetController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, $timeout) {
        var vm = this;
        vm.SelectImage = SelectImage;

        $scope.init = function() {
            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }

            $scope.tab = { selectedIndex: 0 };
            $scope.model = {
                id: '',
                Name: '',
                // Heading: '',
                Title: '',
                Design: '',
                ImageUrl: '',
                URL: '',
                Position: null,
                CustomField: '',
                CustomValue: '',
                CreatedBy: 'Admin',
                CreatedDate: new Date(),
                ModifiedBy: 'Admin',
                ModifiedDate: new Date(),
                CmsType: "Web",
            }
            $scope.GetAllWidget();
            $scope.FlgImage = 0;
        };

        $scope.GetAllWidget = function() {
            $http.get($rootScope.RoutePath + "widget/GetAllWidgetByType?CmsType=Web").then(function(response) {
                $scope.lstWidget = response.data;
            });
        }

        function SelectImage(o) {
            $scope.FlgImage = 1;
            $scope.model.ImageUrl = o.FileName;
            $scope.closeModal();
        }

        $scope.RemoveImage = function() {
            $scope.model.ImageUrl = '';
            $scope.FlgImage = 0;
        }

        $scope.saveWidget = function(o) {
            $http.post($rootScope.RoutePath + "widget/SaveWidget", o).then(function(response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );

                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }
                    $scope.init();
                } else {
                    if (response.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
                        $rootScope.logout();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }
            });
        }

        $scope.EditWidget = function(o) {

            $rootScope.FlgAddedEditlocal = true;

            $scope.tab = { selectedIndex: 1 };
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            //$scope.model.Heading = o.Heading;
            $scope.model.Title = o.Title;
            $scope.model.Design = o.Design;
            $scope.model.ImageUrl = o.ImageUrl;
            if ($scope.model.ImageUrl != null && $scope.model.ImageUrl != '' && $scope.model.ImageUrl != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }
            $scope.model.URL = o.URL;
            $scope.model.Position = o.Position;
            $scope.model.CustomField = o.CustomField;
            $scope.model.CustomValue = o.CustomValue;
            $scope.model.CreatedBy = o.CreatedBy;
            $scope.model.CreatedDate = o.CreatedDate;
            $scope.model.ModifiedBy = o.ModifiedBy;
            $scope.model.ModifiedDate = o.ModifiedDate;
            $scope.model.CmsType = o.CmsType;
        }

        $scope.DeleteWidget = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Widget?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "widget/DeleteWidget?WidgetId=" + id).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllWidget();
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
            });
        }

        $scope.ShowModal = function(ev, o) {
            $mdDialog.show({
                controller: 'ImageModelWidgetController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Widget/dialogs/ImageModel/ImageModel.html',
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

        $scope.closeModal = function() {
            $mdDialog.hide();
        };


        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];


        $scope.dtColumnDefsModal = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];


        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }

        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.FlgImage = 0;
                $scope.model = {
                    id: '',
                    Name: '',
                    //Heading:'',
                    Title: '',
                    Design: '',
                    ImageUrl: '',
                    URL: '',
                    Position: null,
                    CustomField: '',
                    CustomValue: '',
                    CreatedBy: 'Admin',
                    CreatedDate: new Date(),
                    ModifiedBy: 'Admin',
                    ModifiedDate: new Date(),
                    CmsType: "Web",
                }

                $scope.FormWidget.$setPristine();
                $scope.FormWidget.$setUntouched();
            }
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.init();
        }

        // setTimeout(function() {

        // }, 1000);
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }
})();
