(function() {
    'use strict';

    angular
        .module('app.VehicleType')
        .controller('VehicleTypeController', VehicleTypeController);

    /** @ngInject */
    function VehicleTypeController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $scope.init = function() {
            $scope.model = {
                id: 0,
                Type: '',
                IsActive: true,
            }
            $scope.modelSearch = {
                Search: '',
            }
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            // GetAllVehicleType();
            $scope.GetAlltelco();
        }

        $scope.GetAlltelco = function() {
            $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
                $scope.lstCompany = data.data;
            });
        }

        // function GetAllVehicleType() {
        //     $http.get($rootScope.RoutePath + "vehicletype/Getvehicletype").then(function(data) {
        //         $scope.lstVehicleType = data.data;
        //         for (var i = 0; i < $scope.lstVehicleType.length; i++) {
        //             $scope.lstVehicleType[i].CreatedDate = moment($scope.lstVehicleType[i].CreatedDate).format('DD-MM-YYYY hh:mm:ss a');
        //         }
        //     })
        // }

        $scope.SaveVehicleType = function(o) {
            $http.post($rootScope.RoutePath + "vehicletype/SaveVehicleType", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );

                    $scope.ResetModel();
                    $scope.GetAllVehicleType(true);
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
        $scope.editVehicleTypeId = function(id) {
            var o = _.findWhere($scope.lstVehicleType, {
                id: id
            });
            $scope.model.id = o.id;
            $scope.model.Type = o.Type;
            $scope.flag = true;
        }

        $scope.DeleteVehicleType = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Vehicle Type ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: Id
                };
                $http.get($rootScope.RoutePath + "vehicletype/DeleteVehicleTypeById", {
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
                        $scope.GetAllVehicleType(true);
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
        $scope.UpdateStatus = function(id) {
            var message = '';
            var IsActive = 0;
            var o = _.findWhere($scope.lstVehicleType, {
                id: id
            });
            if (o.IsActive == 1) {
                message = 'Are you sure to Deactivate this Vehicle Type'

            } else {
                message = 'Are you sure to Activate this Vehicle Type'
                IsActive = 1;

            }
            var confirm = $mdDialog.confirm()
                .title(message)
                .textContent('')
                .ariaLabel('Lucky day')
                // .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id,
                    IsActive: IsActive
                }
                $http.get($rootScope.RoutePath + "vehicletype/UpdateIsActiveStatus", { params: params }).then(function(data) {
                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        // $scope.ResetModel();
                        $scope.GetAllVehicleType(true);
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
            });
        }
        $scope.resetForm = function() {
            $scope.formVehicleType.$setUntouched();
            $scope.formVehicleType.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                Type: '',
                IsActive: true,
            }
            $scope.modelSearch = {
                Search: '',
            }
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                Type: '',
                IsActive: true,
            }

            $scope.flag = false;
            $scope.resetForm();
        }

        // $scope.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0).notSortable(),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),
        //     DTColumnDefBuilder.newColumnDef(3),
        //     DTColumnDefBuilder.newColumnDef(4),
        //     DTColumnDefBuilder.newColumnDef(5).notSortable()
        // ];

        // $scope.dtInstance = {};
        // $scope.dtOptions = {
        //     dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
        //     // dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        //     columnDefs: [],
        //     // initComplete: function() {
        //     //     var api = this.api(),
        //     //         searchBox = angular.element('body').find('#modelsearch');

        //     //     // Bind an external input as a table wide search box
        //     //     if (searchBox.length > 0) {
        //     //         searchBox.on('keyup', function(event) {
        //     //             api.search(event.target.value).draw();
        //     //         });
        //     //     }
        //     // },
        //     pagingType: 'full_numbers',
        //     lengthMenu: [25, 30, 50, 100],
        //     pageLength: 25,
        //     scrollY: 'auto',
        //     responsive: true
        // };
        // $scope.GetSerch = function(Search) {
        //     $scope.dtInstance.DataTable.search(Search);
        //     $scope.dtInstance.DataTable.search(Search).draw();
        // }
        $scope.GetAllVehicleType = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#VehicleType').dataTable()._fnPageChange(0);
            $('#VehicleType').dataTable()._fnAjaxUpdate();
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedBy'),
                DTColumnBuilder.newColumn(null).renderWith(IsActiveHtml).notSortable(),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "vehicletype/Getvehicletype",
                    data: function(d) {
                        if ($scope.modelSearch.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.modelSearch.Search;
                        }
                        return d;
                        console.log(d)
                    },
                    type: "get",
                    dataSrc: function(json) {
                        console.log(json)
                        if (json.success != false) {
                            $scope.lstVehicleType = json.data;
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
                .withOption('aaSorting', [2, 'desc'])
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

        function dateFormat(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }

        function IsActiveHtml(data, type, full, meta) {
            var result = '';

            if (data.IsActive == 1) {
                result = '<md-button  style="font-size: 20px;color: green"  ng-click="UpdateStatus(' + data.id + ')"> &#x2714;<md-tooltip md-visible="" md-direction="">DeActive</md-tooltip></md-button>';
            }
            if (data.IsActive == 0) {
                result = '<md-button style="font-size: 20px;color: red"  ng-click="UpdateStatus(' + data.id + ')">&#x2716;<md-tooltip md-visible="" md-direction="">Active</md-tooltip></md-button>';
            }
            return result;
        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">'

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="editVehicleTypeId(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteVehicleType(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>'
            return btns;
        };
        $scope.GetSerch = function(Search) {
            $scope.modelSearch.Search = Search;
            $scope.GetAllVehicleType(true);
        };

        $scope.init();


    }

})();