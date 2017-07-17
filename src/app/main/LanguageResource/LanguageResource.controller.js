(function() {
    'use strict';

    angular
        .module('app.LanguageResource', [])
        .filter('ellipsis', function() {
            return function(text, length) {
                if (text.length > length) {
                    return text.substr(0, length) + "...";
                }
                return text;
            }
        })
        .controller('LanguageResourceController', LanguageResourceController);

    /** @ngInject */
    function LanguageResourceController($http, $scope, $state, $rootScope, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        vm.GetAllLanguageResourcesfromModal = GetAllLanguageResourcesfromModal;
        $scope.init = function() {
            $scope.model = {
                Id: '',
                LanguageId: 0,
                ResourceName: '',
                ResourceValue: '',
            };
            $scope.GetAllLanguage();
            //$scope.GetAllLanguageResources();
            $scope.tab = { selectedIndex: 0 };
        }

        //Get All Languages

        $scope.GetAllLanguage = function() {
            $http.get($rootScope.RoutePath + "language/GetAllLanguage").then(function(data) {
                $scope.lstlanguage = data.data;
            });
        }

        //Get All Language Resources
        //$scope.GetAllLanguageResources = function() {
        //    $http.get($rootScope.RoutePath + "languageResources/GetAllLanguageResources").then(function(data) {
        //        $scope.lstLanguageResources = data.data;
        //    });

        //}

        function GetAllLanguageResourcesfromModal() {
            //$http.get($rootScope.RoutePath + "languageResources/GetAllLanguageResources").then(function(data) {
            //    $scope.lstLanguageResources = data.data;
            //});
            $scope.GetAllLanguageResources(true);
        }

        //Create New Language Resources
        $scope.CreateLanguageResource = function(o) {
            $http.post($rootScope.RoutePath + "languageResources/SaveLanguageResources", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllLanguageResources(true);
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true
                    }
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

        }

        //Get Language Resource By Id
        $scope.FetchLanguageResourceById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstdata, { Id: id });
            $scope.tab.selectedIndex = 1;
            $scope.model.Id = o.Id;
            $scope.model.LanguageId = o.LanguageId;
            $scope.model.ResourceName = o.ResourceName;
            $scope.model.ResourceValue = o.ResourceValue;
        }


        //Delete Language Resource
        $scope.DeleteLanguageResource = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idLanguageResources: id
                };
                $http.get($rootScope.RoutePath + "languageResources/DeleteLanguageResources", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllLanguageResources(true);
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
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });
            });
        };

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.tab = { selectedIndex: 0 };

            $scope.restForm();
        }

        $scope.ShowImportModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportLanguageResourcesController',
                controllerAs: 'vm',
                templateUrl: 'app/main/LanguageResource/dialogs/ImportLanguageResources/ImportLanguageResourcesModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    objLanguageResource: vm,
                }
            })
        }

        $scope.DownloadTemplate = function() {
            window.location = $rootScope.RoutePath + "languageresources/DownloadTemplate";
        }



        //Dynamic Paging
        $scope.lstdata = [];
        $scope.dtInstance = {};
        $scope.GetAllLanguageResources = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#LanguageResourcetable').dataTable()._fnPageChange(0);
            $('#LanguageResourcetable').dataTable()._fnAjaxUpdate();
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.dtColumnDefs = [
                DTColumnBuilder.newColumn(null).notSortable().renderWith(NumberHtml),
                DTColumnBuilder.newColumn('language.Name'),
                DTColumnBuilder.newColumn('ResourceName'),
                DTColumnBuilder.newColumn('ResourceValue'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ButtonHtml)
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "languageResources/GetAllLanguageResources",
                    data: function(d) {
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        $scope.lstdata = json.data;
                        return json.data;
                    },

                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withOption('responsive', true)
                .withOption('autoWidth', false)
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [2, 'asc'])
                .withOption('createdRow', createdRow);
        });
        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }



        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }


        function ButtonHtml(data, type, full, meta) {
            var btn = '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="FetchLanguageResourceById(' + data.Id + ')">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' + '</md-button>';
            btn = btn + '<md-button class="md-icon-button md-raised md-warn md-raised md-hue-2" ng-if="' + $rootScope.FlgDeletedAccess + '" ng-click="DeleteLanguageResource(' + data.Id + ')">' +
                '<md-icon md-font-icon="icon-trash"></md-icon>' + '</md-button>';
            btn = btn + '';
            return btn;
        }
        //End Dynamic Paging



        //Export

        $scope.ShowExport = function(ev) {
            $mdDialog.show({
                controller: 'ExportModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/LanguageResource/dialogs/Export/ExportModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                }
            })
        }

        $scope.restForm = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.formLanguagesResource.$setUntouched();
                $scope.formLanguagesResource.$setPristine();
            }
        }


        $scope.ResetModel = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.model = {
                    Id: '',
                    LanguageId: 0,
                    ResourceName: '',
                    ResourceValue: '',
                };
                $scope.restForm();
            }
        }

        $scope.init();
    }

})();
