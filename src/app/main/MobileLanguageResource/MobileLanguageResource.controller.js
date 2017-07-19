(function() {
    'use strict';

    angular
        .module('app.MobileLanguageResource', [])

    .controller('MobileLanguageResourceController', MobileLanguageResourceController);

    /** @ngInject */
    function MobileLanguageResourceController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        vm.GetAllLanguageResources = GetAllLanguageResources;
        vm.Reset = Reset;
        $scope.init = function() {
            $scope.Search = '';
            $scope.flag = false;
        }
        $scope.obj = [];

        $scope.gotoList = function() {
            $scope.Search = '';
            $scope.flag = false;
            GetAllLanguageResources(true);
        }

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            vm.dtInstance.DataTable.search(Search);
            vm.dtInstance.DataTable.search(Search).draw();
        }

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
        ];
        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
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

        //Get All Mobile Language Resources
        function GetAllLanguageResources(flag) {
            $http.get($rootScope.RoutePath + "languageResources/GetMobileLanguageData").then(function(data) {
                $scope.lstMobileLanguageResources = data.data;

                $scope.lstLanguage = [];

                for (var objLanKey in $scope.lstMobileLanguageResources[Object.keys($scope.lstMobileLanguageResources)[0]]) {
                    var Language = new Object();
                    Language.Code = objLanKey;
                    for (var obj in $scope.lstMobileLanguageResources) {

                        var langObj = $scope.lstMobileLanguageResources[obj];

                        Language[obj] = langObj[objLanKey];
                    }
                    $scope.lstLanguage.push(Language);
                };

                if (flag) {
                    $scope.objName = [];
                    $scope.obj = [];
                    $scope.obj.push({ Name: "No" });
                    $scope.obj.push({ Name: "Code" });

                    for (var i in $scope.lstMobileLanguageResources) {

                        $scope.obj.push({ Name: i });
                        $scope.objName.push({ Name: i });
                    }

                    $scope.obj.push({ Name: "Action" });
                }
            });
        }

        GetAllLanguageResources(true);

        $scope.FetchLanguageResourceById = function(obj) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.flag = true;
            $scope.flgShow = 1;
            $scope.model = $scope.obj;
            for (var i = 1; i < $scope.model.length - 1; i++) {
                var value = $scope.model[i].Name;
                $scope.model[i].Value = obj[value];
            }
        }

        $scope.CreateMobileLanguageResource = function(form, obj) {
            for (var i = 2; i < obj.length; i++) {
                if (obj.length - 1 > i) {
                    $scope.lstMobileLanguageResources[obj[i].Name][obj[1].Value] = obj[i].Value;
                } else {
                    $http.post($rootScope.RoutePath + "languageResources/SaveMobileLanguageData", $scope.lstMobileLanguageResources).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $rootScope.FlgAddedEditlocal = false;
                            $scope.flgShow = 0;
                            GetAllLanguageResources(false);
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
        }

        //Export Language
        $scope.ExportLanguage = function() {
            window.location = $rootScope.RoutePath + "languageResources/ExportMobileLanguageResource";
        }

        //Import
        $scope.ShowImportLanguageModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportMobileLanguageResourceController',
                controllerAs: 'vm',
                templateUrl: 'app/main/MobileLanguageResource/dialogs/ImportMobileLanguageResource/ImportMobileLanguageResourceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Obj: vm,
                }
            })

        }

        function Reset() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.resetForm();
            $scope.init();
            $scope.flag = true;
        }

        $scope.resetForm = function() {
            $scope.formMobileLanguagesResource.$setUntouched();
            $scope.formMobileLanguagesResource.$setPristine();
        }

        $scope.ResetModel = function() {
            $scope.resetForm();
            $scope.init();
            GetAllLanguageResources(true);
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();