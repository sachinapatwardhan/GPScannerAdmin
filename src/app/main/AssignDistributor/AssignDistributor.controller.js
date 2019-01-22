(function() {
    'use strict';

    angular
        .module('app.AssignDistributor')
        .controller('AssignDistributorController', AssignDistributorController);

    /** @ngInject */
    function AssignDistributorController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        // console.log("Hell..");
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $scope.ManageModel();
            $scope.flag = false;
            $scope.GetAllInfoList();
            $scope.GetAllDistributor();
        }

        $scope.ManageModel = function() {
            $scope.model = {
                id: 0,
                agentId: null,
                retailerId: null,
                deviceId: '',
                idDistributor: null,
                idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
                AppName: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.AppName,
            }

            $scope.modelSearch = {
                idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
                idDistributor: '',
            }
            $scope.clearSearchTerm();

        }

        $scope.Reset = function() {
            $scope.ManageModel();
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.GetAllDistributor = function() {
            var params = {
                idApp: $scope.model.idApp,
            }
            $http.get($rootScope.RoutePath + "assigndistributor/GetAllDistributor", { params: params }).then(function(data) {
                $scope.lstDistributor = data.data;
            });
        }
        $scope.GetAllDistributorForSearch = function() {
            var params = {
                idApp: $scope.modelSearch.idApp,
            }
            $http.get($rootScope.RoutePath + "assigndistributor/GetAllDistributor", { params: params }).then(function(data) {
                $scope.lstDistributor = data.data;
            });
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }

        $scope.ChangeAppName = function() {
            $scope.model.AppName = _.findWhere($scope.lstAppInfo, { id: parseInt($scope.model.idApp) }).AppName;
            $scope.model.idDistributor = '';
            $scope.lstDistributor = [];
            $scope.GetAllDistributor();
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('Distributor'),
                    DTColumnBuilder.newColumn('deviceId'),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            } else {
                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('Distributor'),
                    DTColumnBuilder.newColumn('deviceId'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            }


            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "assigndistributor/GetAllAssignDistributor",
                    data: function(d) {

                        if ($rootScope.UserRoles != 'Super Admin') {
                            d.appId = $rootScope.appId;
                        }
                        if ($scope.Search != "") {
                            d.search = $scope.Search;
                        } else {
                            d.search = "";
                        }
                        d.AdvanceSearch = $scope.modelSearch;
                        d.UserCountry = $rootScope.UserCountry;
                        d.UserRoles = $rootScope.UserRoles;
                        d.UserId = $rootScope.UserId;
                        d.CountryList = $rootScope.CountryList;
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstdata = json.data;
                            $scope.lstTotal = json.recordsTotal;
                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [0, 'DESC'])
                .withOption('responsive', true).withOption('bAutoWidth', false)
                .withOption('createdRow', createdRow)
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        vm.dtInstance = {};
        vm.dtInstance1 = {};


        //Reload 
        vm.reloadtable = function() {
            $scope.GetAllData(true)
        }

        $scope.GetAllData = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            if ($rootScope.UserRoles == 'Super Admin') {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#Dis').dataTable()._fnAjaxUpdate();

            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#Dis1').dataTable()._fnAjaxUpdate();

            }

        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }




        function NumberHtml(data, type, full, meta) {

            return (meta.row + 1);
        }


        function dateFormat(data, type, full, meta) {
            if (data != null && data != '') {
                return moment(data).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return "";
            }

        }


        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row" layout-align="center center">';
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchDistributorDeviceById(' + data.id + ')">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';

            return btns;
        };

        $scope.FetchDistributorDeviceById = function(id) {
            var o = _.filter($scope.lstdata, { id: id })[0];
            $scope.model.id = o.id;
            $scope.model.deviceId = o.deviceId;
            $scope.model.idDistributor = o.idDistributor;
            $scope.model.AppName = o.AppName;
            $scope.model.idApp = o.idApp;
            $scope.GetAllDistributor();
            $scope.flag = true;
        }

        $scope.SaveDistributor = function(o) {
            $http.post($rootScope.RoutePath + 'assigndistributor/SaveDeviceDistributor', o)
                .then(function(res) {
                    if (res.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(res.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        $scope.GetAllData(true);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(res.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                })
        }
        $scope.DownloadExcelTemplate = function() {
            window.location = $rootScope.RoutePath + "assigndistributor/DownloadTemplate";
        }

        $scope.ShowImportModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportDistributorController',
                controllerAs: 'vm',
                templateUrl: 'app/main/AssignDistributor/dialogs/ImportDistributor/ImportDistributor.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Obj: vm,
                    // UserRoles: $rootScope.UserRoles,
                }
            })
        }

        $scope.ExportExcel = function() {
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            $scope.Search = document.getElementById('modelsearch').value;
            window.location.href = $rootScope.RoutePath + "assigndistributor/ExportDeviceDistributor?search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset + "&idApp=" + $scope.modelSearch.idApp + "&idDistributor=" + $scope.modelSearch.idDistributor;

        }

        $scope.ResetData = function() {
            $scope.ManageModel();
            $scope.clearSearchTerm();
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.ManageModel();
            $scope.resetForm();
            $scope.clearSearchTerm();
            $scope.flag = false;
        }

        $scope.resetForm = function() {
            $scope.FormDistributor.$setUntouched();
            $scope.FormDistributor.$setPristine();

        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.clearSearchTerm = function() {
            vm.searchDistributor = '';
            vm.searchTermidAppName = '';
            vm.search1Distributor = '';
            vm.search1TermidAppName = '';
        };
        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllData(true);
        }

        $scope.toggle = function() {
            if (!$scope.flgforIcon) {
                $scope.flgforIcon = true;
            } else {
                $scope.flgforIcon = false;
            }
            $(function() {
                $(".showBtn").toggleClass("active");
                $(".ShowContentBox").slideToggle();
            })
        }

        $scope.SearchReset = function() {
            $scope.modelSearch = {
                idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
                idDistributor: ''
            }
            $scope.GetAllData(true);
        }
        $scope.init();
    }

})();