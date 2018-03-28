(function () {
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
        var pendingSearch = angular.noop;
        // vm.GetAllLicenceDetail = GetAllLicenceDetail;
        $scope.init = function () {
            $scope.modelSearch = { Search: '' }
            $scope.model = {
                Id: 0,
                IdUser: '',
                LicenceNo: '',
                DeviceId: '',
                ExpiryDate: null,

            }
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
            }
            $scope.selectedItem = null;
            $scope.flag = false;
        }
        $scope.ResetModel = function () {
            $scope.Reset();
            $scope.flag = false;
        }
        $scope.Reset = function () {
            $scope.modelSearch = { Search: '' }
            $scope.model = {
                Id: 0,
                IdUser: '',
                LicenceNo: '',
                DeviceId: '',
                ExpiryDate: null,

            }
            $scope.selectedItem = null;
            $scope.query = '';
            $scope.formLicence.$setUntouched();
            $scope.formLicence.$setPristine();
        }

        $scope.EditLicence = function (Id) {
            var o = _.findWhere($scope.lstLicence, { Id: Id })
            $scope.flag = true;
            $scope.model.Id = o.Id;
            $scope.model.IdUser = o.IdUser;
            $scope.model.LicenceNo = o.LicenceNo;
            $scope.model.DeviceId = o.DeviceId;
            if (o.ExpiryDate != null && o.ExpiryDate != undefined && o.ExpiryDate != '') {
                $scope.model.ExpiryDate = new Date(o.ExpiryDate);
            } else {
                var ExpiryDate = new Date();
                ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);
                $scope.model.ExpiryDate = ExpiryDate;
            }
            $scope.GetUserById($scope.model.IdUser);
            // CreatedDate = o.CreatedDate;
            // ModifiedDate = o.ModifiedDat;
        }

        $scope.GetUserById = function (id) {
            $http.get($rootScope.RoutePath + "user/GetUserById?idUser=" + id).then(function (data) {
                if (data.data.success == true) {
                    $scope.objUser = data.data.data;
                    $scope.selectedItem = $scope.objUser;
                }
            })
        }

        $scope.GetUserByName = function (query) {
            var params = {
                UserName: query,
                appId: localStorage.getItem('appId'),
            }
            // $http.get($rootScope.RoutePath + "user/GetUserByName?UserName=" + query).then(function(data) {
            $http.get($rootScope.RoutePath + "user/GetUserByName", { params: params }).then(function (data) {
                $scope.lstUser = data.data;
                var deferred = $q.defer();
                deferred.resolve($scope.lstUser);
                pendingSearch = deferred.promise;
                return pendingSearch
            });

            return pendingSearch;
        }

        $scope.flgErrorNotFound = 1;
        $scope.selectedItemChange = function (q) {
            if (q != null && q != undefined) {
                $scope.model.IdUser = q.id;
                $scope.flgErrorNotFound = 0;
            } else {
                $scope.model.IdUser = '';
                $scope.flgErrorNotFound = 1;
            };
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('LicenceNo'),
                DTColumnBuilder.newColumn('DeviceId'),
                DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('email'),
                DTColumnBuilder.newColumn('ExpiryDate').renderWith(dateFormat1),
                DTColumnBuilder.newColumn(null).renderWith(daysHtml),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('ModifiedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "licence/GetAllLicence",
                data: function (d) {
                    if ($scope.modelSearch.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.modelSearch.Search;
                    }
                    d.StartDate = $scope.ModelSearch.StartDate;
                    d.EndDate = $scope.ModelSearch.EndDate;
                    // console.log(d)
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    if (json.success != false) {
                        // $scope.lstLicence = json.data;
                        // for (var i = 0; i < $scope.lstLicence.length; i++) {
                        //     var newdate = $scope.lstLicence[i].Date * 1000;
                        //     var timeDiff = (new Date()).getTime() - (new Date($scope.lstdata[i].Date * 1000)).getTime();
                        //     var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                        //     $scope.lstdata[i].Days = diffDays + ' days';
                        // }
                        $scope.lstLicence = json.data;
                        console.log(json)
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
        $scope.dtInstance = {};

        $scope.reloadData = function () { }

        function callback(json) { }

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
                var timeDiff =  (new Date(full.ExpiryDate)).getTime()-(new Date()).getTime() ;
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

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="EditLicence(' + data.Id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteLicence(' + data.Id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            if (full.ExpiryDate != null && full.ExpiryDate != '') {
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

        vm.GetAllLicenceDetail = function (IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#LicenceDetail').dataTable()._fnPageChange(0);
            $('#LicenceDetail').dataTable()._fnAjaxUpdate();
        }

        $scope.GetSerch = function (Search) {
            vm.GetAllLicenceDetail(true)
        };
        //--------------------------------------------------------------------------

        $scope.renewal = function (id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to Renew This Licence ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    id: id
                };
                $http.get($rootScope.RoutePath + "licence/changestatusrenewal", { params: params }).then(function (data) {
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

        $scope.SaveLicence = function (o) {
            $http.get($rootScope.RoutePath + "licence/SaveLicenceDetail", { params: o }).then(function (data) {
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

        $scope.DeleteLicence = function (Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Licence ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "licence/DeleteDeviceLicence", {
                    params: params
                }).success(function (data) {
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

        $scope.toggle = function () {
            if (!$scope.flgforIcon) {
                $scope.flgforIcon = true;
            } else {
                $scope.flgforIcon = false;
            }
            $(function () {
                $(".showBtn").toggleClass("active");
                $(".ShowContentBox").slideToggle();
            })
        }

        $scope.SearchReset = function () {
            $scope.ModelSearch = {
                StartDate: '',
                EndDate: '',
            }
            vm.GetAllLicenceDetail(true);
        }



        $scope.init();
    }

})();