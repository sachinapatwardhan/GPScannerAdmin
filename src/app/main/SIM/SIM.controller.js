(function() {
    'use strict';

    angular
        .module('app.SIM')
        .controller('SIMController', SIMController);

    /** @ngInject */
    function SIMController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.AppName = localStorage.getItem('appName');
        var vm = this;
        // vm.getAllSIMInfo = getAllSIMInfo;
        $scope.init = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: null,
                idApp: $rootScope.appId,
            }
            $scope.modelSearch = {
                    Search: '',
                }
                // $scope.Search = '';  
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            // getAllSIMInfo();
            $scope.GetAlltelco();
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.GetAllInfoList();
            }
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }

        // function getAllSIMInfo() {
        //     $http.get($rootScope.RoutePath + "sim/GetAllSIMInfo").then(function(data) {
        //         $scope.lstSIMInfo = data.data;
        //     })
        // }
        // ----------------------------------------------------------------------
        $scope.GetAllSIMDetail = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#SIMDetail').dataTable()._fnPageChange(0);
            $('#SIMDetail').dataTable()._fnAjaxUpdate();
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('SerialNum'),
                DTColumnBuilder.newColumn('PhoneNum'),
                DTColumnBuilder.newColumn('TelName').renderWith(Valuefun),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('AppName').renderWith(Valuefun),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "sim/GetAllSIMInfoNew",
                    data: function(d) {
                        if ($scope.modelSearch.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.modelSearch.Search;
                        }
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstSIMInfo = json.data;
                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('simple') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [4, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};

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

        function DrawDateFormatNumberHtml(data, type, full, meta) {
            var date = data.tbldrawdate.DrawDate;
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return '';
            }
        }

        function Valuefun(data) {
            var value = '';
            if (data != null && data != undefined && data != '') {
                value = data;
            }
            return value;
        }

        function dateFormat(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }


        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">'

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="editSIMById(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteSIM(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>'
            return btns;
        };
        //--------------------------------------------------------------------------



        // $scope.dtCustomOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(25)
        //     .withOption('responsive', true)
        //     // .withOption('autoWidth', true)
        //     .withOption('aaSorting', [0, 'asc'])
        //     .withOption('deferRender', true)
        //     .withOption('paging', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //     // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"info"i><"pagination"p>>>')
        //     .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
        //     .withOption('scrollY', 'auto'),

        //     vm.dtColumnDefs = [
        //         DTColumnDefBuilder.newColumnDef(0),
        //         DTColumnDefBuilder.newColumnDef(1),
        //         DTColumnDefBuilder.newColumnDef(2),
        //         // DTColumnDefBuilder.newColumnDef(3),
        //         DTColumnDefBuilder.newColumnDef(3).notSortable()
        //     ];
        // $scope.dtInstance = {};

        $scope.SaveSIMInfo = function(o) {
            $http.post($rootScope.RoutePath + "sim/SaveSIMInfo", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    // $scope.init();
                    $scope.ResetModel();
                    // getAllSIMInfo();
                    $scope.GetAllSIMDetail(true);
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }

            })
        }
        $scope.editSIMById = function(id) {
            var o = _.filter($scope.lstSIMInfo, { id: id });
            o = o[0];
            $scope.model.Id = o.id;
            $scope.model.SerialNum = o.SerialNum;
            $scope.model.PhoneNum = parseInt(o.PhoneNum);
            $scope.model.idTelCo = o.idTelCo;
            $scope.model.idApp = o.idApp;
            $scope.flag = true;
        }
        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }
        $scope.DeleteSIM = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this SIM ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "sim/DeleteSIMInfo", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        // getAllSIMInfo();
                        $scope.GetAllSIMDetail(true);

                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                });
            });
        }

        $scope.resetForm = function() {
            $scope.formSIMInfo.$setUntouched();
            $scope.formSIMInfo.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: null,
                idApp: $rootScope.appId,
            }

            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
            $scope.model.idApp = $rootScope.appId;
        }

        $scope.ResetModel = function() {
            $scope.model = {
                Id: 0,
                SerialNum: '',
                PhoneNum: '',
                idTelCo: null,
                idApp: $rootScope.appId,

            }
            $scope.modelSearch = {
                Search: '',
            }
            $scope.flag = false;
            $scope.resetForm();
        }

        // $scope.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),
        //     // DTColumnDefBuilder.newColumnDef(3),
        //     DTColumnDefBuilder.newColumnDef(3).notSortable()
        // ];

        // $scope.dtInstance = {};
        // $scope.dtOptions = {
        //     dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
        //     // dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        //     columnDefs: [],
        //     initComplete: function() {
        //         var api = this.api(),
        //             searchBox = angular.element('body').find('#modelsearch');

        //         // Bind an external input as a table wide search box
        //         if (searchBox.length > 0) {
        //             searchBox.on('keyup', function(event) {
        //                 api.search(event.target.value).draw();
        //             });
        //         }
        //     },
        //     pagingType: 'full_numbers',
        //     lengthMenu: [25, 30, 50, 100],
        //     pageLength: 25,
        //     scrollY: 'auto',
        //     responsive: true
        // };
        $scope.DownloadExcelTemplate = function() {
            window.location = $rootScope.RoutePath + "sim/DownloadTemplate";
        }

        $scope.ShowImportSimModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportSIMController',
                controllerAs: 'vm',
                templateUrl: 'app/main/SIM/dialogs/ImportSIM/ImportSIM.html',
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
        $scope.ExportExcel = function() {
            var CurrentOffset = encodeURIComponent($rootScope.CurrentOffset);
            window.location = $rootScope.RoutePath + "sim/Export?CurrentOffset=" + CurrentOffset;
        }

        $scope.GetSerch = function(Search) {
            $scope.dtInstance.DataTable.search(Search);
            $scope.dtInstance.DataTable.search(Search).draw();
        };

        $scope.init();
    }

})();