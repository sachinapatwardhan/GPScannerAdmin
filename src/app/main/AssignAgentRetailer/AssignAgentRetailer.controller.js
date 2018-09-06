(function() {
    'use strict';

    angular
        .module('app.AssignAgentRetailer')
        .controller('AssignAgentRetailerController', AssignAgentRetailerController);

    /** @ngInject */
    function AssignAgentRetailerController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        // console.log("Hell..");
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $scope.model = {
                id: 0,
                agentId: null,
                retailerId: '',
                agent: '',
                deviceId: '',
                AppName: '',
            }

            $scope.modelSearch = {
                idApp: $rootScope.UserRoles == 'Super Admin' ? '' : $rootScope.appId,
                agentId: '',
                retailerId: ''
            }
            $scope.flag = false;
            $scope.GetAllInfoList();
            $scope.GetAllAgent();
            $scope.GetAllRetailer();
        }

        $scope.GetAllAgent = function() {
            $scope.modelSearch.agentId = "";
            var params = {
                idApp: $scope.modelSearch.idApp,
            }
            $http.get($rootScope.RoutePath + "assignagentretailer/GetAllAgent", { params: params }).then(function(data) {
                $scope.lstAgent = data.data;
            });
        }

        $scope.GetAllRetailerByAgent = function(agentId) {
            $scope.modelSearch.retailerId = "";
            $scope.lstAllRetailerByAgent = _.filter($scope.lstAssignRetailer, { agentId: agentId })
        }

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }

        $scope.GetAllRetailer = function(idUser) {
            $http.get($rootScope.RoutePath + "assignretailer/GetAllAssignRetailer").then(function(data) {
                $scope.lstAssignRetailer = data.data;
            });
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('agent'),
                    DTColumnBuilder.newColumn('retailer'),
                    DTColumnBuilder.newColumn('deviceId'),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            } else {
                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('agent'),
                    DTColumnBuilder.newColumn('retailer'),
                    DTColumnBuilder.newColumn('deviceId'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
                ]
            }


            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "assignagentretailer/GetAllAgentRetailer",
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
                $('#AgentRetailer').dataTable()._fnAjaxUpdate();

            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#AgentRetailer1').dataTable()._fnAjaxUpdate();

            }

        }

        $scope.reloadData = function() {}

        function callback(json) {}

        //compile Datatable And Apply Class
        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function IsFlg(data, type, full, meta) {
            var Flg;
            if (data == true || data == 'true' || data == 1) {
                Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
            } else {
                Flg = '<i class="icon-cancel red-500-fg"></i>';
            }

            return Flg;

        }

        function NumberHtml(data, type, full, meta) {

            return (meta.row + 1);
        }

        function ImageHtml(data, type, full, meta) {
            var filename = data.image;
            if (filename != null) {
                return ' <img src="' + $rootScope.RoutePath + 'MediaUploads/' + data.image + '" err-src="assets/images/no-image.png" height="50px" width="50px">';
            } else {
                return ' <img src= "assets/images/no-image.png" height="50px" width="50px">';
            }
        }

        function dateFormat(data, type, full, meta) {
            if (data != null && data != '') {
                return moment(data).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return "";
            }

        }

        function MaxSpeed(data, type, full, meta) {
            if (data == null) {
                return 0;
            } else {
                return data;
            }
        }

        function IsSecurity(data, type, full, meta) {
            var Flg;
            if (data == true) {
                Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
            } else {
                Flg = '<i class="icon-cancel red-500-fg"></i>';
            }
            return Flg;

        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row" layout-align="center center">';
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchAgentDeviceById(' + data.id + ')">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';

            return btns;
        };

        $scope.FetchAgentDeviceById = function(id) {
            var o = _.filter($scope.lstdata, { id: id })[0];
            $scope.model.id = o.id;
            $scope.model.agentId = o.agentId;
            $scope.model.deviceId = o.deviceId;
            $scope.model.agent = o.agent;
            $scope.lstAllRetailer = _.filter($scope.lstAssignRetailer, function(item) {
                if (item.agentId == o.agentId && item.idApp == o.idApp) {
                    return item;
                }
            })
            $scope.model.retailerId = o.retailerId;
            $scope.model.AppName = o.AppName;
            $scope.flag = true;
        }

        $scope.SaveAgentRetailer = function(o) {
            $http.post($rootScope.RoutePath + 'assignagentretailer/SaveAgentDeviceRetailer', {
                    id: o.id,
                    retailerId: o.retailerId,
                    agentId: o.agentId,
                    devcieId: o.devcieId,
                })
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
            window.location = $rootScope.RoutePath + "assignagentretailer/DownloadTemplate";
        }

        $scope.ShowImportAgentRetailerModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportAgentRetailerController',
                controllerAs: 'vm',
                templateUrl: 'app/main/AssignAgentRetailer/dialogs/ImportAgentRetailer/ImportAgentRetailer.html',
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
            var UserId = '';
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            if ($rootScope.UserRoles == 'Sales Agent') {
                UserId = $rootScope.UserId;
            }


            // window.location.href = $rootScope.RoutePath + "assignagentretailer/ExportAgentRetailer?search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset + "&appId=" + $scope.model.appId + "&AdvanceSearch=" + $scope.modelSearch;
            $scope.Search = document.getElementById('modelsearch').value;
            window.location.href = $rootScope.RoutePath + "assignagentretailer/ExportAgentRetailer?search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset + "&idApp=" + $scope.modelSearch.idApp + "&agentId=" + $scope.modelSearch.agentId + "&retailerId=" + $scope.modelSearch.retailerId;

            // if ($rootScope.UserRoles == 'Super Admin') {
            //     setTimeout(function() {
            //         $mdDialog.show({
            //             controller: 'ExportAgentRetailerCtrl',
            //             controllerAs: 'vm',
            //             templateUrl: 'app/main/AssignAgentRetailer/dialogs/ExportAgentRetailer/ExportAgentRetailer.html',
            //             parent: angular.element($document.body),
            //             clickOutsideToClose: true,
            //             locals: {
            //                 search: $scope.Search,
            //             }
            //         });
            //     }, 100);
            //     // window.location.href = $rootScope.RoutePath + "PetDevice/ExportTracker?UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            // } else {
            //     window.location.href = $rootScope.RoutePath + "assignagentretailer/ExportAgentRetailer?AppName=" + $rootScope.AppName + "&UserId=" + UserId + "&search=" + $scope.Search + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
            // }
        }

        $scope.ResetData = function() {
            $scope.model.retailerId = o.retailerId;
            $scope.clearSearchTerm();
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                agentId: null,
                retailerId: '',
                agent: '',
                deviceId: '',
                AppName: '',
            }

            $scope.resetForm();
            $scope.flag = false
        }

        $scope.resetForm = function() {
            $scope.formAgentRetailer.$setUntouched();
            $scope.formAgentRetailer.$setPristine();

        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.clearSearchTerm = function() {
            vm.searchReatiler = '';
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
                agentId: '',
                retailerId: ''
            }
            $scope.GetAllData(true);
        }
        $scope.init();
    }

})();