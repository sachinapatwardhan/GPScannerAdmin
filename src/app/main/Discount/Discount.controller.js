(function() {
    'use strict';

    angular
        .module('app.discount')
        .controller('DiscountController', DiscountController);

    /** @ngInject */
    function DiscountController($filter, $http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.GetAllDiscountFromModal = GetAllDiscountFromModal;

        $scope.init = function() {
            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }
            $scope.model = {
                Id: '',
                Name: '',
                DiscountTypeId: 0,
                UsePercentage: false,
                DiscountPercentage: 0,
                DiscountAmount: 0,
                StartDateUtc: '',
                EndDateUtc: '',
                RequiresCouponCode: false,
                CouponCode: '',
                DiscountLimitationId: 1,
                LimitationTimes: 0,
                MaximumDiscountedQuantity: null,
                discount_appliedtoproducts: '',
                discount_appliedtocategories: '',

            };
            $scope.GetAllDiscount();
            $scope.tab = { selectedIndex: 0 };
        }

        function GetAllDiscountFromModal() {
            $http.get($rootScope.RoutePath + "discount/GetAllDiscount").then(function(data) {

                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].StartDateUtc != null) {
                        data.data[i].StartDateUtc = $scope.convertdateformat(data.data[i].StartDateUtc);
                    }
                    if (data.data[i].EndDateUtc != null) {
                        data.data[i].EndDateUtc = $scope.convertdateformat(data.data[i].EndDateUtc);
                    }
                }
                $scope.lstDiscount = data.data;
            });
        }

        $scope.GetAllDiscount = function() {
            // Data
            $http.get($rootScope.RoutePath + "discount/GetAllDiscount").then(function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].StartDateUtc != null) {
                        data.data[i].StartDateUtc = $scope.convertdateformat(data.data[i].StartDateUtc);
                    }
                    if (data.data[i].EndDateUtc != null) {
                        data.data[i].EndDateUtc = $scope.convertdateformat(data.data[i].EndDateUtc);
                    }
                }
                $scope.lstDiscount = data.data;
            });
        }

        $scope.DeleteDiscount = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Discount?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "discount/DeleteDiscount?idDiscount=" + id).then(function(data) {

                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
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
            }, function() {});

        }

        $scope.FetchDiscountById = function(o) {
            $rootScope.FlgAddedEditlocal = true;
            $scope.tab.selectedIndex = 1;
            $scope.model.Id = o.Id;
            $scope.model.Name = o.Name;
            $scope.model.DiscountTypeId = o.DiscountTypeId;
            $scope.model.UsePercentage = o.UsePercentage;
            $scope.model.DiscountPercentage = o.DiscountPercentage;
            $scope.model.DiscountAmount = o.DiscountAmount;
            if (o.StartDateUtc != null && o.StartDateUtc != '') {
                $scope.model.StartDateUtc = new Date(o.StartDateUtc);
            }
            if (o.EndDateUtc != null && o.EndDateUtc != '') {
                $scope.model.EndDateUtc = new Date(o.EndDateUtc);
            }
            $scope.model.RequiresCouponCode = o.RequiresCouponCode;
            $scope.model.CouponCode = o.CouponCode;
            $scope.model.DiscountLimitationId = o.DiscountLimitationId;
            $scope.model.LimitationTimes = o.LimitationTimes;
            $scope.model.MaximumDiscountedQuantity = o.MaximumDiscountedQuantity;
            $scope.model.discount_appliedtoproducts = null;
            for (var i = 0; i < o.discount_appliedtoproducts.length; i++) {
                if ($scope.model.discount_appliedtoproducts == '' || $scope.model.discount_appliedtoproducts == null) {
                    $scope.model.discount_appliedtoproducts = o.discount_appliedtoproducts[i].product.Name;
                } else {
                    $scope.model.discount_appliedtoproducts = $scope.model.discount_appliedtoproducts + " , " + o.discount_appliedtoproducts[i].product.Name;
                }
            }

            $scope.model.discount_appliedtocategories = null;
            for (var i = 0; i < o.discount_appliedtocategories.length; i++) {
                if ($scope.model.discount_appliedtocategories == '' || $scope.model.discount_appliedtocategories == null) {
                    $scope.model.discount_appliedtocategories = o.discount_appliedtocategories[i].tblcategorymgmt.Name;
                } else {
                    $scope.model.discount_appliedtocategories = $scope.model.discount_appliedtocategories + " , " + o.discount_appliedtocategories[i].tblcategorymgmt.Name;
                }
            }
        }

        $scope.ExportDiscount = function() {
            window.location = $rootScope.RoutePath + "discount/ExportDiscount";
        }

        $scope.DownloadTemplate = function() {
            window.location = $rootScope.RoutePath + "discount/DownloadDiscountTemplate";
        }

        $scope.ShowImportModal = function(ev) {
            $mdDialog.show({
                controller: 'ImportDiscountController',
                controllerAs: 'vm',
                templateUrl: 'app/main/Discount/dialogs/ImportDiscount/ImportDiscountModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Tasks: [],
                    event: ev,
                    objdiscountdata: vm,
                }
            })
        }


        $scope.CreateDiscount = function(o, form) {
            $http.post($rootScope.RoutePath + "discount/SaveDiscount", o).then(function(data) {

                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
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
        };

        // $scope.dtOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(10)
        //     .withOption('responsive', true)
        //     .withOption('autoWidth', true)
        //      .withOption('language', {
        //          'zeroRecords': "No Record Found",
        //          'emptyTable': "No Record Found"
        //      })
        //     .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7).notSortable(),

        ];

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.convertdateformat = function(date1) {
            var date = new Date(date1.substring(0, date1.indexOf('T')));
            var firstdayDay = date.getDate();
            var firstdayMonth = date.getMonth() + 1;
            var firstdayYear = date.getFullYear();
            return ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("00" + firstdayDay.toString()).slice(-2) + "-" + ("0000" + firstdayYear.toString()).slice(-4);
        }

        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.FormManageDiscount.$setPristine();
                $scope.FormManageDiscount.$setUntouched();
                $scope.model = {
                    Id: '',
                    Name: '',
                    DiscountTypeId: 0,
                    UsePercentage: false,
                    DiscountPercentage: 0,
                    DiscountAmount: 0,
                    StartDateUtc: '',
                    EndDateUtc: '',
                    RequiresCouponCode: false,
                    CouponCode: '',
                    DiscountLimitationId: 1,
                    LimitationTimes: 0,
                    MaximumDiscountedQuantity: null,
                };
            }
        }
        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.FormManageDiscount.$setPristine();
            $scope.FormManageDiscount.$setUntouched();
            $scope.init();
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })

    }

})();
