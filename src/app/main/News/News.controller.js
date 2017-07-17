(function() {
    'use strict';

    angular
        .module('app.News')
        .filter('ellipsis', function() {
            return function(text, length) {
                if (text.length > length) {
                    return text.substr(0, length) + "<a href='#'>...</a>";
                }
                return text;
            }
        })
        .controller('NewsController', NewsController);

    /** @ngInject */
    function NewsController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            // if ($rootScope.FlgAddedAccess == true) {
            //     $scope.FlgAddedEditlocal = true;
            // } else {
            //     $scope.FlgAddedEditlocal = false;
            // }

            $scope.model = {
                id: '',
                LanguageId: 0,
                Name: '',
                Description: '',
                CreatedBy: '',
                CreatedDate: null,
            };
            $scope.GetNews();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetNews = function() {
            $http.get($rootScope.RoutePath + "news/GetAllNews").then(function(data) {
                $scope.lstNews = data.data;
            });
        }

        $scope.CreateNews = function(o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            } else {
                o.ModifyDate = new Date();
            }
            o.CreatedBy = 'Admin';
            $http.post($rootScope.RoutePath + "news/SaveNews", o).then(function(data) {
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
                    };

                }


            });
        }

        $scope.FetchNewsById = function(o) {
            $rootScope.FlgAddedEditlocal = true;

            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Name = o.Name;
            $scope.model.Description = o.Description;
            $scope.model.CreatedDate = o.CreatedDate;
        }

        $scope.DeleteNews = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idNews: id
                };
                $http.get($rootScope.RoutePath + "news/DeleteNews", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
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
                                .textContent(data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        }
                    }
                });


            });
        };

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true
            }
            $scope.init();
        }


        //vm.dtOptions = DTOptionsBuilder.newOptions()
        //    .withPaginationType('full_numbers')
        //    .withDisplayLength(10)
        //    .withOption('responsive', true)
        //    .withOption('autoWidth', true)
        //     .withOption('language', {
        //         'zeroRecords': "No Record Found",
        //         'emptyTable': "No Record Found"
        //     })
        //    .withOption('dom', '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        // .withDOM('<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            // DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.resetForm = function() {
            $scope.formNews.$setUntouched();
            $scope.formNews.$setPristine();
        }
        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.ResetModel = function() {
            if ($rootScope.FlgAddedAccess == true) {

                $scope.model = {
                    id: '',
                    LanguageId: 0,
                    Name: '',
                    Description: '',
                    CreatedBy: '',
                    CreatedDate: null,
                };
                $scope.resetForm();
            }
        }


        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })
    }

})();
