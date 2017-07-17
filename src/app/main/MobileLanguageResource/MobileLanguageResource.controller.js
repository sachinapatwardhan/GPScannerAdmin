(function() {
    'use strict';

    angular
        .module('app.MobileLanguageResource', [])

    .controller('MobileLanguageResourceController', MobileLanguageResourceController);

    /** @ngInject */
    function MobileLanguageResourceController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        vm.GetAllLanguageResources = GetAllLanguageResources;

        $scope.init = function() {
            $scope.model = {

            };
            $scope.flgShow = 0;

            $scope.tab = { selectedIndex: 0 };


        }
        $scope.obj = [];

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
        ];

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
            $scope.tab.selectedIndex = 1;
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

        $scope.Reset = function() {

            $scope.init();
            GetAllLanguageResources(false);
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();