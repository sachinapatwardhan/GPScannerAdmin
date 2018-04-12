(function() {
    'use strict';

    angular
        .module('app.AssignLicence')
        .controller('AssignLicenceController', AssignLicenceController);

    /** @ngInject */
    function AssignLicenceController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.AppName = localStorage.getItem('appName');
        var vm = this;
        vm.ReloadTable = ReloadTable;
        var pendingSearch = angular.noop;

        function ReloadTable() {
            vm.GetAllLicenceDetail(true)
        }
        // vm.GetAllLicenceDetail = GetAllLicenceDetail;
        $scope.init = function() {
            $scope.modelSearch = { Search: '' }
            $scope.model = {
                Id: 0,
                IdUser: '',
                LicenceNo: '',
                DeviceId: '',
                ExpiryDate: null,
                LicenceRenewalType: '',
                LicenceType: '',
            }
            $scope.ModelSearch = {
                days: '-1',
                StartDate: '',
                EndDate: '',
                idApp: '-1',
            }
            $scope.selectedItem = null;
            $scope.flag = false;
            $scope.getAllApps();
        }
        $scope.ResetModel = function() {
            $scope.Reset();
            $scope.flag = false;
        }
        $scope.Reset = function() {
            $scope.modelSearch = { Search: '' }
            $scope.model = {
                Id: 0,
                IdUser: '',
                LicenceNo: '',
                DeviceId: '',
                ExpiryDate: null,
                LicenceRenewalType: '',
                LicenceType: '',
                idApp: '-1',
            }
            $scope.selectedItem = null;
            $scope.query = '';
            $scope.formLicence.$setUntouched();
            $scope.formLicence.$setPristine();
        }

        $scope.getAllApps = function() {
            $http.get($rootScope.RoutePath + "appsetting/GetAllAppInfo").then(function(res) {
                $scope.appNames = res.data;
            });
        };

        $scope.EditLicence = function(Id) {
            var o = _.findWhere($scope.lstLicence, { Id: Id })
            $scope.flag = true;
            $scope.model.Id = o.Id;
            $scope.model.IdUser = o.IdUser;
            $scope.model.LicenceNo = o.LicenceNo;
            $scope.model.DeviceId = o.DeviceId;
            if (o.LicenceRenewalType == null || o.LicenceRenewalType == undefined || o.LicenceRenewalType == '') {
                $scope.model.LicenceRenewalType = o.appLicenceRenewalType;
            } else {
                $scope.model.LicenceRenewalType = o.LicenceRenewalType;
            }
            if (o.LicenceType == null || o.LicenceType == undefined || o.LicenceType == '') {
                $scope.model.LicenceType = o.appLicenceType;
            } else {
                $scope.model.LicenceType = o.LicenceType;
            }

            // console.log(o.ExpiryDate)
            if (o.ExpiryDate != null && o.ExpiryDate != undefined && o.ExpiryDate != '') {
                $scope.model.ExpiryDate = new Date(o.ExpiryDate);
            } else {
                $scope.changeExpiry($scope.model.LicenceRenewalType)
                    // var ExpiryDate = new Date();
                    // ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);
                    // $scope.model.ExpiryDate = ExpiryDate;
            }
            $scope.GetUserById($scope.model.IdUser);
            // CreatedDate = o.CreatedDate;
            // ModifiedDate = o.ModifiedDat;
        }

        $scope.changeExpiry = function(days) {
            var ExpiryDate = new Date();
            if (days == 'Yearly') {
                ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);
                $scope.model.ExpiryDate = ExpiryDate;
            } else if (days == 'Quarterly') {
                ExpiryDate.setMonth(ExpiryDate.getMonth() + 3);
                $scope.model.ExpiryDate = ExpiryDate;
            } else if (days == 'Monthly') {
                ExpiryDate.setMonth(ExpiryDate.getMonth() + 1);
                $scope.model.ExpiryDate = ExpiryDate;
            }

        }

        $scope.GetUserById = function(id) {
            $http.get($rootScope.RoutePath + "user/GetUserById?idUser=" + id).then(function(data) {
                if (data.data.success == true) {
                    $scope.objUser = data.data.data;
                    $scope.selectedItem = $scope.objUser;
                }
            })
        }

        $scope.GetUserByName = function(query) {
            var params = {
                    UserName: query,
                    appId: localStorage.getItem('appId'),
                }
                // $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
            $http.get($rootScope.RoutePath + "user/GetUserByName", { params: params }).then(function(data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }

        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function(q) {
            if (q != null && q != undefined) {
                $scope.model.IdUser = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.IdUser = '';
                $scope.flgErrorNotFound = 1;
            };
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('LicenceNo'),
                    DTColumnBuilder.newColumn('DeviceId'),
                    // DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                    DTColumnBuilder.newColumn('LicenceType'),
                    DTColumnBuilder.newColumn('LicenceRenewalType'),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
                ]
            } else {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('LicenceNo'),
                    DTColumnBuilder.newColumn('DeviceId'),
                    // DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                    DTColumnBuilder.newColumn('ExpiryDate').renderWith(daysHtml),
                    DTColumnBuilder.newColumn('LicenceType'),
                    DTColumnBuilder.newColumn('LicenceRenewalType'),
                    // DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
                ]
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "licence/GetAllLicence",
                    data: function(d) {

                        if ($scope.modelSearch.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.modelSearch.Search;
                        }
                        d.StartDate = $scope.ModelSearch.StartDate;

                        if (d.StartDate != null && d.StartDate != undefined && d.StartDate != '') {
                            d.StartDate.setHours(0);
                            d.StartDate.setMinutes(0);
                            d.StartDate.setSeconds(0);
                        }
                        d.EndDate = $scope.ModelSearch.EndDate;
                        if (d.EndDate != null && d.EndDate != undefined && d.EndDate != '') {
                            d.EndDate.setHours(0);
                            d.EndDate.setMinutes(0);
                            d.EndDate.setSeconds(0);
                        }
                        if ($rootScope.UserRoles != 'Super Admin') {
                            d.idApp = $rootScope.appId;
                        } else {
                            if ($scope.ModelSearch.idApp != null && $scope.ModelSearch.idApp != undefined && $scope.ModelSearch.idApp != '' && $scope.ModelSearch.idApp != '-1') {
                                d.idApp = $scope.ModelSearch.idApp;
                            }
                        }
                        // console.log(d)
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstLicence = json.data;
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
                .withOption('aaSorting', [5, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');

        });
        vm.dtInstance = {};
        vm.dtInstance1 = {};

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

        function daysHtml(data, type, full, meta) {
            var days = '';
            if (full.ExpiryDate != null && full.ExpiryDate != '') {
                var timeDiff = (new Date(full.ExpiryDate)).getTime() - (new Date()).getTime();
                var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                days = diffDays + ' days';

            }
            return days;
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

        function dateFormat1(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return '';
            }
        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">'
            if ($rootScope.UserRoles == 'Super Admin') {
                if ($rootScope.FlgModifiedAccess) {
                    btns += '<md-button class="edit-button md-icon-button"  ng-click="EditLicence(' + data.Id + ')" aria-label="">' +
                        '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                        '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                        '</md-button>';
                    if (full.DeviceId != null && full.DeviceId != undefined && full.DeviceId != '') {
                        btns += '<md-button class="edit-button md-icon-button"  ng-click="openDeviceIdModel(' + data.Id + ')">' +
                            '<md-icon md-font-icon="icon-rotate-3d"  class="s18 blue-500- fg "></md-icon>' +
                            '<md-tooltip md-visible="" md-direction="">Transfer Device</md-tooltip>' +
                            '</md-button>';
                    }
                }
                if ($rootScope.FlgDeletedAccess) {
                    btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteLicence(' + data.Id + ')" aria-label="">' +
                        '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                        '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                        '</md-button>';
                }

            }
            if (full.DeviceId != null && full.DeviceId != '') {
                // var btn = "<div layout='row'>";
                // btn += '<md-checkbox ng-model="checked[' + data + ']" ng-change="Select( ' + full.IsActive + ',' + full.id + ')" aria-label="Checkbox 1" class="md-primary"></md-checkbox>';
                // btn += '</div>';
                btns += '<md-button class="edit-button md-icon-button"  ng-click="renewal(' + full.Id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-upload"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Renew</md-tooltip>' +
                    '</md-button>';
            }


            btns += '</div>'
            return btns;
        };

        vm.GetAllLicenceDetail = function(IsUpdate) {
            if ($scope.ModelSearch.days == 'Date' && ($scope.ModelSearch.StartDate == null || $scope.ModelSearch.EndDate == null)) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Please select Date.")
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {

                var resetPaging = false;
                if (IsUpdate == true) {
                    resetPaging = true;
                };
                if ($rootScope.UserRoles == 'Super Admin') {
                    vm.dtInstance.reloadData(callback, resetPaging);
                    $('#LicenceDetail').dataTable()._fnPageChange(0);
                    $('#LicenceDetail').dataTable()._fnAjaxUpdate();
                } else {
                    vm.dtInstance1.reloadData(callback, resetPaging);
                    $('#LicenceDetail1').dataTable()._fnPageChange(0);
                    $('#LicenceDetail1').dataTable()._fnAjaxUpdate();
                }
            }
        }

        $scope.GetSerch = function(Search) {
            vm.GetAllLicenceDetail(true)
        };

        $rootScope.reloadLicence = function() {
            vm.GetAllLicenceDetail(true)
        }

        //--------------------------------------------------------------------------

        $scope.openDeviceIdModel = function(Id) {
            var o = _.findWhere($scope.lstLicence, { Id: Id })
                // ShowLoader();
            setTimeout(function() {
                $mdDialog.show({
                    controller: 'LicenceDeviceDetailCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/AssignLicence/dialogs/DeviceDetail/DeviceDetail.html',
                    parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    locals: {
                        Id: Id,
                        // userId: userId,
                        // lstDevice: $scope.lstDevice,
                        OldDeviceId: o.DeviceId,
                    }
                });
                // HideLoader();
            }, 100);

        }

        $scope.ChangeSearchDate = function(days) {
            var StartDate = new Date();
            var EndDate = new Date();
            if (days == '-1') {
                $scope.ModelSearch.StartDate = null;
                $scope.ModelSearch.EndDate = null;
            } else if (days == 'Date') {
                $scope.ModelSearch.StartDate = null;
                $scope.ModelSearch.EndDate = null;
            } else if (days == 'Week') {
                // var StartDate = new Date();
                // var day = StartDate.getDay()
                // var diff = StartDate.getDate() - day;
                // StartDate = new Date(StartDate.setDate(diff));
                // var EndDate = new Date();
                // EndDate = new Date(EndDate.setDate(EndDate.getDate() - EndDate.getDay()));
                EndDate.setDate(EndDate.getDate() + 7);
                $scope.ModelSearch.StartDate = StartDate;
                $scope.ModelSearch.EndDate = EndDate;
            } else if (days == 'Month') {
                // var date = new Date();
                // var StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
                // var EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                EndDate.setMonth(EndDate.getMonth() + 1);
                $scope.ModelSearch.StartDate = StartDate;
                $scope.ModelSearch.EndDate = EndDate;
            } else if (days == 'Quarter') {
                // var date = new Date();
                // var StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
                // var EndDate = new Date(date.getFullYear(), date.getMonth() + 6, 0);
                EndDate.setMonth(EndDate.getMonth() + 3);
                $scope.ModelSearch.StartDate = StartDate;
                $scope.ModelSearch.EndDate = EndDate;
            } else if (days == 'Year') {
                // var date = new Date();
                // var StartDate = new Date(date.getFullYear(), 1, 1);
                // var EndDate = new Date(date.getFullYear(), 12, 0);
                EndDate.setFullYear(EndDate.getFullYear() + 1);
                $scope.ModelSearch.StartDate = StartDate;
                $scope.ModelSearch.EndDate = EndDate;
            }

        }

        $scope.renewal = function(id) {
            var obj = _.findWhere($scope.lstLicence, { Id: id });
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to Renew This Licence ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id,
                    AppName: obj.AppName,
                };
                $http.get($rootScope.RoutePath + "licence/changestatusrenewal", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        vm.GetAllLicenceDetail(true);
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
                        };

                    }
                })
            })
        }

        $scope.SaveLicence = function(o) {
            $http.get($rootScope.RoutePath + "licence/SaveLicenceDetail", { params: o }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.ResetModel();
                    vm.GetAllLicenceDetail(true);
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
                    };

                }
            });
        }

        // $scope.AssignLicence = function() {
        //     var params = {
        //         AppName: 'HC CARGO'
        //     };
        //     $http.get($rootScope.RoutePath + "vehicles/AssignLicenceToExistVehicle", {
        //         params: params
        //     }).success(function(data) {
        //         console.log(data.message)
        //     })
        // }

        $scope.DeleteLicence = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Licence ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "licence/DeleteDeviceLicence", {
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
                        vm.GetAllLicenceDetail(true);
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
            $scope.ModelSearch = {
                days: '-1',
                StartDate: '',
                EndDate: '',
                idApp: '-1',
            }
            vm.GetAllLicenceDetail(true);
        }

        $scope.GenerateLicence = function(ev) {
            $mdDialog.show({
                controller: 'LicenceModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/AssignLicence/dialogs/LicenceModel/LicenceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    Lvm: vm,
                }
            })
        }

        $scope.init();
    }

})();