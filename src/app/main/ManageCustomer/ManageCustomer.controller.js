(function() {
    'use strict';

    angular
        .module('app.ManageCustomer')
        .controller('ManageCustomerController', ManageCustomerController);

    /** @ngInject */
    function ManageCustomerController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        // console.log("Hell..");
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $scope.model = {
                id: '',
                username: '',
                email: '',
                phone: '',
                country: '',
                idApp: '',
            }
            $scope.modelSearch = {
                AppName: '',
                country: '',
            }
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            // console.log($rootScope.appId);
            $scope.flag = false;
            GetAllCountry();
            $scope.GetAllInfoList();
        }
        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }

        function GetAllCountry() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        $scope.clearSearchTerm = function() {
            vm.searchTermCountry = '';
            vm.searchTermidAppName = '';
            // $scope.searchTermCity = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }


        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    // DTColumnBuilder.newColumn('OwnerName'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('country'),
                    // DTColumnBuilder.newColumn('IsMobileVerify').renderWith(IsFlg),
                    DTColumnBuilder.newColumn('TotalDevice'),
                    DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            } else {
                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                    DTColumnBuilder.newColumn('username'),
                    DTColumnBuilder.newColumn('email'),
                    // DTColumnBuilder.newColumn('OwnerName'),
                    DTColumnBuilder.newColumn('phone'),
                    DTColumnBuilder.newColumn('country'),
                    // DTColumnBuilder.newColumn('IsMobileVerify').renderWith(IsFlg),
                    DTColumnBuilder.newColumn('TotalDevice'),
                    // DTColumnBuilder.newColumn('AppName'),
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center'),
                ]
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "user/GetAllDynamicOwnerCustomer",
                    data: function(d) {
                        if ($rootScope.UserRoles != 'Super Admin') {
                            d.appId = $rootScope.appId;
                        } else {
                            d.appId = $scope.modelSearch.idApp;
                        }
                        if ($scope.Search != "") {
                            d.search = $scope.Search;
                        } else {
                            d.search = "";
                        }
                        d.country = $scope.modelSearch.country;
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


        //Reload Datatable

        $scope.GetAllUser = function(IsUpdate) {
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
            var btns = '<div layout="row" layout="center">';
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
            btns += '</div>';
            return btns;
        };


        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllUser(true);
        }

        //Dynamic Pagging End

        $scope.toggle = function() {
            if (!$scope.flgforIcon) {
                $scope.flgforIcon = true;
            } else {
                $scope.flgforIcon = false;
            }

            $(function() {
                $(".showBtn").toggleClass("active");
                $(".ShowContentBox").slideToggle();
            });
        };
        $scope.updateCustomer = function() {
            console.log($scope.model)
            $http.post($rootScope.RoutePath + "user/updateCustomer", $scope.model).success(function(data) {
                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.GetAllUser(true);
                    $scope.flag = false;
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            })
        }

        $scope.EditCustomer = function(id) {
            var o = _.filter($scope.lstdata, { id: id })
            $scope.flag = true;
            $scope.model.id = o[0].id;
            $scope.model.username = o[0].username;
            $scope.model.email = o[0].email;
            $scope.model.phone = o[0].phone;
            $scope.model.country = o[0].country;
            $scope.model.idApp = o[0].idApp;
        }

        $scope.DeleteCustomer = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Customer ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id
                };
                $http.get($rootScope.RoutePath + "user/DeleteCustomer", {
                    params: params
                }).success(function(data) {
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

        $scope.resetForm = function() {
            $scope.AddCustomerForm.$setUntouched();
            $scope.AddCustomerForm.$setPristine();
        }

        $scope.ResetData = function() {
            $scope.model = {
                id: '',
                username: '',
                email: '',
                phone: '',
                country: '',
                idApp: '',
            }
            $scope.resetForm();
        }

        $scope.Reset = function() {
            $scope.flag = false;
            $scope.model = {
                id: '',
                username: '',
                email: '',
                phone: '',
                country: '',
                idApp: '',
            }
            $scope.resetForm();

        }
        $scope.SearchReset = function() {
            $scope.modelSearch = {
                AppName: '',
                country: '',
            }
            $scope.GetAllUser(true);
        }
        $scope.init();
    }

})();