(function () {
    'use strict';

    angular
        .module('app.Customer')
        .controller('CustomerController', CustomerController);

    /** @ngInject */
    function CustomerController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        // console.log("Hell..");
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function () {
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $scope.model = {
                id: '',
                email: '',
                username: '',
                phone: '',
                createdby: 'Admin',
                createddate: new Date(),
                modifiedby: '',
                modifieddate: null,
                roleId: '',
                userId: '',
                country: '',
                state: '',
                city: '',
                gender: '',
                image: '',
                password: '',
                confirmpassword: '',
                IsMobileVerify: false,
                idApp: parseInt($rootScope.appId),
            }
            $scope.clearSearchTerm();
            $scope.modelSearch = {
                AppName: '',
                country: '',
            }

            // console.log($rootScope.appId);
            $scope.flag = false;
            GetAllCountry();
            $scope.GetAllRoles();
            $scope.GetAllInfoList();
        }

        $scope.setUsernameValue = function (email) {
            $scope.model.username = $scope.model.email;
        }

        $scope.GetAllInfoList = function () {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
                $scope.lstAppInfo = data.data;
            })
        }

        function GetAllCountry() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function (data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.GetAllRoles = function () {
            // Data
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function (data) {
                $scope.lstRoles = data.data;
            });
        }

        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    // DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
                    DTColumnBuilder.newColumn('email'),
                    // DTColumnBuilder.newColumn('OwnerName'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('country'),
                    // DTColumnBuilder.newColumn('OTP'),
                    // DTColumnBuilder.newColumn('IsMobileVerify').renderWith(IsFlg),
                    DTColumnBuilder.newColumn('TotalDevice'),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn('LastLogin').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            } else {
                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    // DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
                    DTColumnBuilder.newColumn('email'),
                    // DTColumnBuilder.newColumn('OwnerName'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('country'),
                    // DTColumnBuilder.newColumn('OTP'),
                    // DTColumnBuilder.newColumn('IsMobileVerify').renderWith(IsFlg),
                    DTColumnBuilder.newColumn('TotalDevice'),
                    DTColumnBuilder.newColumn('LastLogin').renderWith(dateFormat),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            }


            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "user/GetAllDynamicOwnerCustomer",
                data: function (d) {

                    if ($rootScope.UserRoles != 'Super Admin') {
                        d.appId = $rootScope.appId;
                    }
                    if ($scope.Search != "") {
                        d.search = $scope.Search;
                    } else {
                        d.search = "";
                    }
                    d.UserCountry = $rootScope.UserCountry;
                    d.UserRoles = $rootScope.UserRoles;
                    d.UserId = $rootScope.UserId;
                    d.CountryList = $rootScope.CountryList;
                    return d;
                },
                type: "get",
                dataSrc: function (json) {
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


        //Reload Datatable

        $scope.GetAllUser = function (IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            if ($rootScope.UserRoles == 'Super Admin') {
                vm.dtInstance.reloadData(callback, resetPaging);
                $('#Customer').dataTable()._fnAjaxUpdate();

            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#Customer1').dataTable()._fnAjaxUpdate();

            }

        }

        $scope.reloadData = function () { }

        function callback(json) { }

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
            var btns = '<md-button class="edit-button md-icon-button"  ng-click="ShowDeviceModal($event,' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-timer"  class="s18 purple-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">Show Devices</md-tooltip>' +
                '</md-button>';
            // if ($rootScope.FlgModifiedAccess) {
            btns += '<md-button class="edit-button md-icon-button"  ng-click="ResetPassword($event,' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-account-alert"  class="s18 blue-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">Reset Password</md-tooltip>' +
                '</md-button>';

            //}
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangePassword($event,' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-key-change"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Change Password</md-tooltip>' +
                    '</md-button>';
            }

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="EditCustomer(' + data.id + ')" aria-label="Edit Location">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip  md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteCustomer(' + data.id + ')" aria-label="Add Sub-Location">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible=""  md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            return btns;
        };

        $scope.DeleteCustomer = function (id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Customer ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    id: id
                };
                $http.get($rootScope.RoutePath + "user/DeleteCustomer", {
                    params: params
                }).success(function (data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
                        $scope.GetAllUser(true);

                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
                    }
                });
            })
        }

        $scope.ChangePassword = function (ev, id) {
            var obj = _.findWhere($scope.lstdata, { id: id })
            $mdDialog.show({
                skipHide: true,
                controller: 'ChangePasswordCustomerController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Customer/dialogs/ChangePassword/ChangePassword.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: obj,
                    Tasks: [],
                    event: ev,
                    VM: vm
                }
            });
        }
        $scope.GetSerch = function (Search) {
            $scope.Search = Search;
            $scope.GetAllUser(true);
        }

        $scope.EditCustomer = function (id) {

            var o = _.findWhere($scope.lstdata, { id: id });
            for (var prop in $scope.model) {
                $scope.model[prop] = o[prop];
            }
            $scope.model.createddate = o.CreatedDate;
            $scope.model.modifieddate = new Date();
            $scope.model.modifiedby = 'Admin';
            $scope.flag = true;
            // $scope.model.id = o[0].id;
            // $scope.model.username = o[0].username;
            // $scope.model.email = o[0].email;
            // $scope.model.phone = o[0].phone;
            // $scope.model.country = o[0].country;
            // $scope.model.idApp = o[0].idApp;
        }

        // $scope.updateCustomer = function() {
        //     $scope.model.idApp = $rootScope.idApp;
        //     $http.post($rootScope.RoutePath + "user/updateCustomer", $scope.model).success(function(data) {
        //         if (data.success == true) {
        //             $mdToast.show(
        //                 $mdToast.simple()
        //                 .textContent(data.message)
        //                 .position('top right')
        //                 .hideDelay(3000)
        //             );
        //             $scope.GetAllUser(true);
        //             $scope.flag = false;
        //         } else {
        //             $mdToast.show(
        //                 $mdToast.simple()
        //                 .textContent(data.message)
        //                 .position('top right')
        //                 .hideDelay(3000)
        //             );
        //         }
        //     })
        // }
        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
        }
        $scope.CreateCustomer = function (o) {
            o.roleId = _.where($scope.lstRoles, { RoleName: 'User' });
            if (o.id == '') {
                if (o.confirmpassword != o.password) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Password and Confirm Password does not match...')
                            .position('top right')
                            .hideDelay(3000)
                    );
                    return;
                }
            }
            $http.post($rootScope.RoutePath + "user/SaveCustomer", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );
                    $scope.resetForm();
                    $scope.init();
                    $scope.GetAllUser(true);
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
        };


        $scope.ResetPassword = function (ev, id) {
            var obj = _.findWhere($scope.lstdata, { id: id })
            $mdDialog.show({
                controller: 'PasswordConifrmationController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Customer/dialogs/PasswordConfirmation/PasswordConfirmation.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: obj,
                    Tasks: [],
                    event: ev,
                    VM: vm,
                    flg: 1
                }
            })
        }

        //Reset Password User By Id
        $scope.ResetPassword1 = function (id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });

            var confirm = $mdDialog.confirm()
                .title('Are you sure to Reset Password of this Customer ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function () {
                var params = {
                    // email: $scope.obj.email,
                    // idApp: $rootScope.appId,
                    id: id,
                    AppName: localStorage.getItem('appName') + ' Admin',
                }
                $http.get($rootScope.RoutePath + "account/forgotpasswordfromOwnerCustomer", { params: params }).then(function (data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
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


        //show User Devices
        $scope.ShowDeviceModal = function (ev, id) {
            $mdDialog.show({
                controller: 'DeviceModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Customer/dialogs/DeviceModel/DeviceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    idUser: id,
                    Tasks: [],
                    event: ev,
                }
            })
        }


        //Dynamic Pagging End

        $scope.ResetData = function () {
            $scope.model = {
                id: '',
                email: '',
                username: '',
                phone: '',
                createdby: 'Admin',
                createddate: new Date(),
                modifiedby: '',
                modifieddate: null,
                roleId: '',
                userId: '',
                country: '',
                state: '',
                city: '',
                gender: '',
                image: '',
                password: '',
                confirmpassword: '',
                IsMobileVerify: false,
                idApp: parseInt($rootScope.appId),
            }
            $scope.clearSearchTerm();
            $scope.resetForm();
        }
        $scope.clearSearchTerm = function () {
            vm.searchTermidAppName = '';
        }
        $scope.Reset = function () {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.model = {
                id: '',
                email: '',
                username: '',
                phone: '',
                createdby: 'Admin',
                createddate: new Date(),
                modifiedby: '',
                modifieddate: null,
                roleId: '',
                userId: '',
                country: '',
                state: '',
                city: '',
                gender: '',
                image: '',
                password: '',
                confirmpassword: '',
                IsMobileVerify: false,
                idApp: parseInt($rootScope.appId),
            }
            $scope.flag = true;
            $scope.clearSearchTerm();
            $scope.resetForm();

        }

        $scope.Cancel = function () {
            $scope.ResetData();
            $scope.flag = false;
        }

        $scope.resetForm = function () {
            $scope.AddCustomerForm.$setUntouched();
            $scope.AddCustomerForm.$setPristine();

        }
        $scope.SearchReset = function () {
            $scope.modelSearch = {
                AppName: '',
                country: '',
            }
            $scope.GetAllUser(true);
        }

        $scope.init();

        $scope.Export = function () {
            var AppId = $rootScope.UserRoles == "Super Admin" ? '' : $rootScope.appId;
            var CurrentOffset = $rootScope.CurrentOffset.charAt(0) == '+' ? $rootScope.CurrentOffset.replace('+', 'p') : $rootScope.CurrentOffset.replace('-', 'm');
            window.location.href = $rootScope.RoutePath + "User/ExportOwnerCustomer?appId=" + AppId + "&UserRoles=" + $rootScope.UserRoles + "&CurrentOffset=" + CurrentOffset;
        }
    }

})();