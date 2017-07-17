(function() {
    'use strict';

    angular
        .module('app.category')
        .controller('CategoryController', CategoryController);

    /** @ngInject */
    function CategoryController($http, $scope, $rootScope, $state, $mdToast, $document, $cookieStore, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;

        $scope.init = function() {
            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }
            $scope.model = {
                id: '',
                Parent: null,
                Name: '',
                Title: '',
                Description: '',
                Seq: null,
                CreatedBy: 'Admin',
                CreatedDate: new Date(),
                ModifiedBy: '',
                ModifiedDate: null,
                DiscountCategoryList: [],
                ApplyDiscount: [],
                discount_appliedtocategories: []
            };
            $scope.GetAllCategory();
            $scope.GetAllParentCategory();
            $scope.GetAllDiscount();
            $scope.tab = { selectedIndex: 0 };
        }

        $scope.GetAllCategory = function() {
            // Data
            $http.get($rootScope.RoutePath + "category/GetAllCategory").then(function(data) {
                $scope.lstCateogory = data.data;
            });
        }

        $scope.GetAllDiscount = function() {

            $http.get($rootScope.RoutePath + "discount/GetAllDiscountByTypeId?DiscountTypeId=3").then(function(data) {

                $scope.model.DiscountCategoryList = data.data;

                $scope.lstDiscount = data.data;

            });
        }

        $scope.GetAllParentCategory = function() {
            // Data

            $http.get($rootScope.RoutePath + "category/GetAllParentCategory").then(function(data) {

                $scope.lstParentCategory = data.data.data;
            });
        }

        $scope.DeleteCategory = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Category?')
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "category/DeleteCategory?idCategory=" + id).then(function(data) {

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

        $scope.FetchCategoryById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.Title = o.Title;
            $scope.model.Parent = o.Parent;
            $scope.model.Description = o.Description;
            $scope.model.CreatedDate = o.CreatedDate;
            $scope.model.CreatedBy = o.CreatedBy;
            $scope.model.ModifiedBy = o.ModifiedBy;
            $scope.model.ModifiedDate = new Date();

            $scope.Discount = o.discount_appliedtocategories;
            if ($scope.Discount != null && $scope.Discount != '' && $scope.Discount != undefined) {
                for (var j = 0; j < $scope.model.DiscountCategoryList.length; j++) {
                    var val = document.getElementById('Discount' + j).getAttribute('value');
                    for (var i = 0; i < $scope.Discount.length; i++) {
                        if (val == $scope.Discount[i].Discount_Id) {
                            var obj = _.findWhere($scope.model.DiscountCategoryList, { Id: $scope.Discount[i].Discount_Id });
                            if (obj != null && obj != undefined) {
                                $scope.model.DiscountCategoryList[j]["IsChecked"] = true;
                            }
                        }
                    }
                }
            }

        }



        $scope.CreateCateogory = function(o, form) {

            o.ApplyDiscount = [];
            for (var i = 0; i < o.DiscountCategoryList.length; i++) {
                if (o.DiscountCategoryList[i].IsChecked == true) {
                    o.ApplyDiscount.push(o.DiscountCategoryList[i]);
                }
            }

            $http.post($rootScope.RoutePath + "category/CreateCategory", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true;
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
            //$scope.init();
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

            DTColumnDefBuilder.newColumnDef(5).notSortable(),
        ];




        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {

                $scope.FormManageCategory.$setPristine();
                $scope.FormManageCategory.$setUntouched();
                $scope.model = {
                    id: '',
                    Parent: null,
                    Name: '',
                    Title: '',
                    Description: '',
                    Seq: null,
                    CreatedBy: 'Admin',
                    CreatedDate: new Date(),
                    ModifiedBy: '',
                    ModifiedDate: null,
                    DiscountProductList: $scope.model.DiscountProductList,
                }
                $scope.GetAllDiscount();
                $scope.FlgImage = 0;
            }
            //$scope.model.DiscountProductList=$scope.model.DiscountProductList;
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.init();
        }
        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();
