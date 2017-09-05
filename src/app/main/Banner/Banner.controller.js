(function() {
    'use strict';

    angular
        .module('app.Banner')
        .controller('BannerController', BannerController);

    /** @ngInject */
    function BannerController($http, $scope, $mdDialog, $document, $mdToast, $cookieStore, DTOptionsBuilder, DTColumnDefBuilder, $rootScope) {
        var vm = this;
        vm.SelectImage = SelectImage;
        vm.SelectObjImage = SelectObjImage;
        $scope.dtInstance = {};
        $scope.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [],
            initComplete: function() {
                var api = this.api(),
                    searchBox = angular.element('body').find('#Temp');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function(event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            scrollY: 'auto',
            responsive: true
        };

        $scope.init = function() {
            $scope.tab = { selectedIndex: 0 };

            $scope.model = {
                id: '',
                Name: '',
            }

            $scope.modelbanner = {
                id: '',
                BannerId: 0,
                ImageUrl: '',
                alt: '',
                UrlLink: '',
                Description: '',
            }
            $scope.searchBanner = '';
            $scope.GetAllBanner();
            $scope.FlgImage = 0;
            $scope.flag = false;
            $scope.modelSearch = {
                Search: '',
            }
        };

        $scope.clearSearchTerm = function() {
            $scope.searchBanner = '';
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.Add = function() {
            $scope.flag = true;
        }
        $scope.GotoHome = function() {
            $scope.init();
            $scope.flag = false;
        }


        $scope.AddDate = function(o) {

            var params = {
                Time: Date.parse(o.date),
                DateTime: o.date,
            }
            $http.get($rootScope.RoutePath + "petTracking/saveDate", { params: params }).then(function(response) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(response.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
            });

        }

        $scope.GetAllBanner = function() {
            $http.get($rootScope.RoutePath + "banner/GetAllBanner").then(function(response) {
                $scope.lstBanner = response.data;
            });
        }

        $scope.CreateBanner = function(o) {

            $http.post($rootScope.RoutePath + "banner/SaveBanner", o).then(function(response) {
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
                    $scope.ResetEdit();
                } else {
                    if (response.data.data == 'TOKEN') {
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

        $scope.EditBanner = function(o) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.tab = {
                selectedIndex: 0
            };
            $scope.flag = true;
            $scope.FlgImage = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.modelbanner.BannerId = o.id;
            $scope.GetBannerMgmtById(o.id);
        }

        $scope.DeleteBanner = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Banner?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "banner/DeleteBanner?idBanner=" + id).then(function(response) {
                    if (response.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllBanner();
                    } else {
                        if (response.data.data == 'TOKEN') {
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
            }, function() {

            });
        }

        $scope.GetBannerMgmtById = function(id) {
            $http.get($rootScope.RoutePath + "banner/GetBannerMgmtById?idBanner=" + id).then(function(response) {
                $scope.lstBannerMgmt = response.data.data;
            });
        }

        //Image Upload
        $scope.setFiles = function(element) {
            $scope.FlgError = false;
            $scope.modelbanner.ImageUrl = "";
        };
        //End of Image Upload

        $scope.FlgError = false;
        $scope.CreateBannerMgmt = function(o) {

            if ($scope.Mediafiles.length > 0) {

                var formData = new FormData();
                angular.forEach($scope.Mediafiles, function(obj) {
                    formData.append('files[]', obj.lfFile);
                });

                // console.log($scope.Mediafiles);
                //return;
                $http.post($rootScope.RoutePath + "media/upload", formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function(data) {
                    // console.log(data);
                    if (data.data.success == true) {
                        $scope.apiMedia.removeAll();
                        // console.log(data.data.data[0].FileName);
                        o.ImageUrl = data.data.data[0].FileName;
                        $scope.SaveBannerMgmt(o);
                    }
                })
            } else {
                $scope.SaveBannerMgmt(o);
            }
        }

        $scope.SaveBannerMgmt = function(o) {
            if (o.ImageUrl == null || o.ImageUrl == '' || o.ImageUrl == undefined) {
                $scope.FlgError = true;
                return;
            } else {
                $scope.FlgError = false;
            }

            $http.post($rootScope.RoutePath + "banner/SaveBannerMgmt", o).then(function(response) {
                if (response.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetModelBanner();
                } else {
                    if (response.data.data == 'TOKEN') {
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


        $scope.DeleteBannerMgmt = function(id, idbanner) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Banner Image?')
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "banner/DeleteBannerMgmt?idBanner=" + id).then(function(response) {
                    if (response.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(response.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetBannerMgmtById(idbanner);
                    } else {
                        if (response.data.data == 'TOKEN') {
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
            }, function() {

            });
        }

        function SelectObjImage(o) {
            $scope.FlgImage = 1;
            $scope.obj.ImageUrl = o.FileName;
            $scope.closeModal();
        }

        function SelectImage(o) {
            $scope.FlgImage = 1;
            $scope.modelbanner.ImageUrl = o.FileName;
            $scope.closeModal();
        }

        $scope.RemoveImage = function() {
            $scope.modelbanner.ImageUrl = '';
            $scope.FlgImage = 0;
        }

        $scope.ShowModal = function(ev) {
            $scope.FlgError = false;

            $mdDialog.show({
                controller: 'BannerImageModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Banner/dialogs/ImageModel/ImageModel.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objMedia: "",
                    Tasks: [],
                    event: ev,
                    MediaVM: vm
                }
            });
        }

        $scope.ShowBannerModal = function(ev, o) {
            $scope.FlgError = false;
            $scope.obj = o;
            $mdDialog.show({
                controller: 'BannerImageModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Banner/dialogs/ImageModel/ImageModel.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objMedia: o,
                    Tasks: "EditBannerImage",
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
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];

        $scope.dtColumnDefsModal = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1).notSortable()
        ];


        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {
                if ($scope.model.id == null || $scope.model.id == '' || $scope.model.id == undefined) {
                    $scope.model = {
                        id: '',
                        Name: '',
                    }
                    $scope.FlgImage = 0;
                }
                $scope.FormCreateBanner.Name.$touched = false;
            }
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.model.id = '';
            $scope.modelbanner.BannerId = '';
            $scope.init();
        }

        $scope.ResetModelBanner = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.modelbanner.id = '';
                $scope.modelbanner.ImageUrl = '';
                $scope.modelbanner.alt = '';
                $scope.modelbanner.UrlLink = '';
                $scope.modelbanner.Description = '';

                if ($scope.model.id != null || $scope.model.id != '' || $scope.model.id != undefined) {
                    {
                        $scope.GetBannerMgmtById($scope.model.id);
                        $scope.tab = { selectedIndex: 2 };
                    }
                }
                $scope.FormBannerImage.$setPristine();
                $scope.FormBannerImage.$setUntouched();
            }
        }



        $scope.ResetCreateBannerImage = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.FormBannerImage.$setPristine();
                $scope.FormBannerImage.$setUntouched();

                $scope.modelbanner.id = '';
                $scope.modelbanner.ImageUrl = '';
                $scope.modelbanner.alt = '';
                $scope.modelbanner.UrlLink = '';
                $scope.modelbanner.Description = '';
            }

        }
        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }

        $scope.ResetBanner = function() {
            $scope.model = {
                id: '',
                Name: '',
            }

            $scope.FormCreateBanner.Name.$touched = false;
        }

        $scope.ResetBannerMgmt = function() {
            $scope.modelbanner = {
                id: '',
                BannerId: 0,
                ImageUrl: '',
                alt: '',
                UrlLink: '',
                Description: '',
            }
            $scope.FormBannerImage.$setPristine();
            $scope.FormBannerImage.$setUntouched();

        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })

    }
})();