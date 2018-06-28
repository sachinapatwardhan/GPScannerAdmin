(function() {
    'use strict';

    angular
        .module('app.Country')
        .controller('CountryController', CountryController);

    /** @ngInject */
    function CountryController($http, $scope, $rootScope, $state, $mdToast, $document, $mdDialog, $stateParams, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                Code: '',
                Country: '',
                ShortName: '',
                Seq: '0',
                CreatedBy: '',
                CreatedDate: '',
            };
            $scope.GetAllCountry();
            $scope.tab = { selectedIndex: 0 };
        }


        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }


        $scope.CreateCountry = function(o) {
            if (o.id == null || o.id == '') {
                o.CreatedDate = new Date();
            } else {
                o.ModifyDate = new Date();
            }
            $http.post($rootScope.RoutePath + "country/SaveCountry", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.init();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.FetchCountryById = function(o) {
            $scope.tab.selectedIndex = 1;
            $scope.model.id = o.id;
            $scope.model.Code = o.Code;
            $scope.model.Country = o.Country;
            $scope.model.ShortName = o.ShortName;
            $scope.model.CreatedDate = o.CreatedDate;
        }

        $scope.DeleteCountry = function(id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Record ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idCountry: id
                };
                $http.get($rootScope.RoutePath + "country/DeleteCountry", { params: params }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
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
        };

        $scope.Reset = function() {
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
            DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('class', 'text-center'),
            // DTColumnDefBuilder.newColumnDef(5)
        ];

        $scope.ResetModel = function() {
            $scope.model = {
                id: '',
                Code: '',
                Country: '',
                ShortName: '',
                Seq: '0',
                CreatedBy: '',
                CreatedDate: '',
            };
        }

        $scope.init();
    }

})();