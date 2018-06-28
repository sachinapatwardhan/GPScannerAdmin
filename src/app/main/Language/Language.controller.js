(function() {
    'use strict';

    angular
        .module('app.Language', [])
        .controller('LanguageController', LanguageController);

    /** @ngInject */
    function LanguageController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.SelectImage = SelectImage;
        vm.Reset = Reset;
        vm.searchLanguageCulture = '';
        $scope.init = function() {

            $scope.model = {
                Id: '',
                Name: '',
                LanguageCulture: '',
                UniqueSeoCode: '',
                FlagImageFileName: '',
                Rtl: false,
                Published: true,
                DisplayOrder: null,
            };

            $scope.flag = false;
            $scope.FlgImage = 0;
            $scope.GetAllLanguage();
            $scope.GetLangageCulture();
            $scope.tab = { selectedIndex: 0 };
            $scope.langCl = "";
            $scope.myCroppedImage = '';
            $scope.FlagImageFileName = [];
        }

        $scope.clearSearchTerm = function() {
            $scope.langCl = "";
            vm.searchLanguageCulture = '';
        };
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        $scope.gotoList = function() {
            $scope.model = {
                Id: '',
                Name: '',
                LanguageCulture: '',
                UniqueSeoCode: '',
                FlagImageFileName: '',
                Rtl: false,
                Published: true,
                DisplayOrder: null,
            };
            $scope.GetAllLanguage();
            $scope.GetLangageCulture();
            $scope.Search = '';
            $scope.flag = false;
        }

        $scope.GetAllLanguage = function() {
            $http.get($rootScope.RoutePath + "language/GetAllLanguage").then(function(data) {
                $scope.lstlanguage = data.data;
            });
        }

        $scope.GetLangageCulture = function() {
            $http.get($rootScope.RoutePath + "language/GetLangageCulture").then(function(data) {
                $scope.lstCulture = data.data;
            });
        }

        function SelectImage(o) {
            $scope.FlgImage = 1;
            $scope.model.FlagImageFileName = o.FileName;
            $mdDialog.hide();
        }
        $scope.RemoveImage = function() {
            $scope.model.FlagImageFileName = '';
            $scope.FlgImage = 0;
        }

        $scope.ShowModal = function(ev, o) {
            $mdDialog.show({
                controller: 'ImageModelLanguageController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Language/dialogs/ImageModel/ImageModel.html',
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


        $scope.CreateLanguage = function(o) {
            if ($scope.FlagImageFileName.length == 0 && $scope.myCroppedImage == '') {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Image is required')
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {
                $http.post($rootScope.RoutePath + "language/SaveLanguage", o).then(function(data) {
                    if (data.data.success == true) {
                        var Id;
                        if (o.Id != 0) {
                            Id = o.Id;
                        } else {
                            Id = data.data.data[0].Id;
                        }
                        var formData = new FormData();
                        if ($scope.FlagImageFileName.length > 0) {
                            angular.forEach($scope.FlagImageFileName, function(obj) {
                                formData.append(Id, obj.lfFile);
                            });


                            $http.post($rootScope.RoutePath + "language/uploadImage", formData, {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }).then(function(data) {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(data.data.message)
                                    .position('top right')
                                    .hideDelay(3000)
                                );
                                $scope.apiImag.removeAll();
                                $scope.GetAllLanguage();
                            })
                        }
                        if ($scope.FlagImageFileName.length == 0) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                        $rootScope.FlgAddedEditlocal = false;
                        if ($rootScope.FlgAddedAccess == true) {
                            $rootScope.FlgAddedEditlocal = true
                        }
                        $scope.apiImag.removeAll();
                        $scope.GetAllLanguage();
                        $scope.ResetModel();
                        // $scope.init();
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

        }

        $scope.FetchLanguageById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model.Id = o.Id;
            $scope.model.Name = o.Name;
            $scope.model.LanguageCulture = o.LanguageCulture;
            $scope.model.UniqueSeoCode = o.UniqueSeoCode;
            $scope.model.FlagImageFileName = o.FlagImageFileName;
            if ($scope.model.FlagImageFileName != null && $scope.model.FlagImageFileName != '' && $scope.model.FlagImageFileName != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }
            $scope.model.Rtl = o.Rtl;
            $scope.model.Published = o.Published;
            $scope.model.DisplayOrder = o.DisplayOrder;
            $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/' + o.FlagImageFileName; //$scope.AppLogo;
            if (o.FlagImageFileName != null && o.FlagImageFileName != '' && o.FlagImageFileName != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }
            $scope.flag = true;
        }

        $scope.DeleteLanguage = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idLanguage: id
                };
                $http.get($rootScope.RoutePath + "language/DeleteLanguage", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                    } else {
                        if (data.data.data == 'TOKEN') {
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
            DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('class', 'text-center'),
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
            $scope.formLanguages.$setUntouched();
            $scope.formLanguages.$setPristine();
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }
        $scope.ResetModel = function() {
            $scope.FlgImage = 0;
            $scope.model = {
                Id: '',
                Name: '',
                LanguageCulture: '',
                UniqueSeoCode: '',
                FlagImageFileName: '',
                Rtl: false,
                Published: true,
                DisplayOrder: null,
            };
            $scope.restForm();
            $scope.flag = false;
        }
        $scope.ResetData = function() {
            $scope.FlgImage = 0;
            $scope.model = {
                Id: '',
                Name: '',
                LanguageCulture: '',
                UniqueSeoCode: '',
                FlagImageFileName: '',
                Rtl: false,
                Published: true,
                DisplayOrder: null,
            };
            $scope.restForm();
        }

        $scope.setFiles = function(element) {
            $scope.FlgImage = 0;
            // $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.FlagImageFileName;
        };
        $scope.RemoveImage = function() {
            $scope.myCroppedImage = '';
            $scope.FlgImage = 0;
            $scope.FlagImageFileName = [];
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
        $scope.openModel = function(Id) {
            $mdDialog.show({
                controller: 'LanguageCountryModelCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/main/Language/dialogs/CountryModel/CountryModel.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    Id: Id,
                }
            });
        }

    }

})();