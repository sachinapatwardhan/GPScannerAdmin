(function() {
    'use strict';

    angular
        .module('app.Support')
        .controller('SupportController', SupportController);

    /** @ngInject */
    function SupportController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                email: '',
                phone: '',
                ProfileName: '',
                username: '',
                IsMobileVerify: false,
            }
            $scope.tab = { selectedIndex: 0 };
            $scope.FlgEditMode = false;
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('createddate').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('ProfileName'),
                DTColumnBuilder.newColumn('email'),
                DTColumnBuilder.newColumn('phone'),
                DTColumnBuilder.newColumn('country'),
                DTColumnBuilder.newColumn('OTP'),
                DTColumnBuilder.newColumn('IsMobileVerify').renderWith(Verified).notSortable(),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "user/GetAllDynamicCustomer",
                    data: function(d) {
                        d.UserCountry = $rootScope.UserCountry;
                        d.UserRoles = $rootScope.UserRoles;
                        d.CountryList = $rootScope.CountryList;
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstdata = json.data;
                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(10) // Page size
                .withOption('aaSorting', [0, 'asc'])
                .withOption('responsive', true)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllSupport = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Supporttable').dataTable()._fnPageChange(0);
            $('#Supporttable').dataTable()._fnAjaxUpdate();
        }

        $scope.SaveSupport = function(o) {

            console.log(o);
            $http.post($rootScope.RoutePath + "user/SaveSupportUser", o).then(function(data) {
                console.log(data);
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.tab = { selectedIndex: 0 };
                    $scope.GetAllSupport(true);
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

        $scope.FetchSupportById = function(id) {
            console.log($scope.lstdata);
            var o = _.findWhere($scope.lstdata, { id: id });
            $scope.tab.selectedIndex = 1;
            $scope.FlgEditMode = true;

            $scope.model.id = o.id;
            $scope.model.email = o.email;
            $scope.model.username = o.username;
            $scope.model.phone = parseInt(o.phone);
            $scope.model.ProfileName = o.ProfileName;
            $scope.model.IsMobileVerify = o.IsMobileVerify;
            // $scope.model.createddate = o.createddate;
            // $scope.model.createdby = o.createdby;
            // $scope.model.modifieddate = new Date();
            // $scope.model.modifiedby = "Admin";

            // $scope.model.userId = o.id;
            // $scope.model.gender = o.gender;

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

        function Verified(data, type, full, meta) {
            var Flg;
            if (data == true) {
                Flg = '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
            } else {
                Flg = '<i class="icon-cancel red-500-fg"></i>';
            }
            return Flg;

        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="FetchSupportById(' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon></md-button>'
            btns += '<md-button class="md-accent md-raised md-hue-2" ng-click="ShowDeviceModal($event,' + data.id + ')" aria-label="">Device</md-button>';
            btns += '<md-button class="md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ResendOTP(' + data.id + ')">Resend OTP</md-button>';
            btns += '<md-button class="md-raised md-primary" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ResetPassword(' + data.id + ')">Reset Password</md-button>';

            return btns;
        };


        //show User Devices
        $scope.ShowDeviceModal = function(ev, id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });
            $mdDialog.show({
                controller: 'DeviceModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Support/dialogs/DeviceModel/DeviceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objUser: $scope.obj,
                    Tasks: [],
                    event: ev,

                }
            })
        }


        //Dynamic Pagging End


        //Reset Password User By Id
        $scope.ResetPassword = function(id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Reset Password of this User ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                console.log($scope.obj.email);
                $http.get($rootScope.RoutePath + "account/forgotpassword?email=" + $scope.obj.email).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllSupport(true);
                    } else {
                        if (data.data.data == 'TOKEN') {
                            $cookieStore.remove('UserName');
                            $cookieStore.remove('token');
                            $state.go('app.login', {
                                cache: false
                            });
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


        $scope.ResendOTP = function(id) {
            var params = {
                idUser: id,
                OTP: Math.floor(1000 + Math.random() * 9000)
            }

            $http.get($rootScope.RoutePath + "user/GetSupportUserById", { params: params }).success(function(data) {
                if (data.success == true) {
                    if (data.data.messages[0].status == "0") {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('OTP send Successfully')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Unroutable message - rejected')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                    $scope.GetAllSupport(true);

                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('OTP send Failed!')
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
            // console.log(OTP);
        }

        $scope.Reset = function() {
            $scope.init();
        }


        $scope.init();
    }

})();
