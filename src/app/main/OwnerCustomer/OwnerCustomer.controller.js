(function() {
    'use strict';

    angular
        .module('app.OwnerCustomer')
        .controller('OwnerCustomerController', OwnerCustomerController);

    /** @ngInject */
    function OwnerCustomerController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;

        $scope.init = function() {

            }
            //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '5%'), ,
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml).withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('email').withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('OwnerName').withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('phone').withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('country').withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('MaxSpeed').renderWith(MaxSpeed).withOption('width', '5%'), ,
                DTColumnBuilder.newColumn('IsSecurity').renderWith(IsSecurity).notSortable().withOption('width', '5%'), ,
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('width', '5%'),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "user/GetAllDynamicOwnerCustomer",
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
                .withOption('responsive', true).withOption('bAutoWidth', false)
                .withOption('createdRow', createdRow);
        });
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllUser = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
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
            var btns = '<md-button class="md-accent md-raised md-hue-2" ng-click="ShowDeviceModal($event,' + data.id + ')" aria-label="">Device</md-button>';

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-click="ResetPassword(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-account-alert"></md-icon>' +
                    '<md-tooltip md-visible=" " md-direction=" ">Reset Password</md-tooltip>' +
                    '</md-button>';

            }
            return btns;
        };

        //Reset Password User By Id
        $scope.ResetPassword = function(id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });

            var confirm = $mdDialog.confirm()
                .title('Are you sure to Reset Password of this User ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "account/forgotpasswordfromOwnerCustomer?email=" + $scope.obj.email + "&Type=Owner").then(function(data) {
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
        $scope.ShowDeviceModal = function(ev, id) {

            $mdDialog.show({
                controller: 'DeviceModelController',
                controllerAs: 'vm',
                templateUrl: 'app/main/OwnerCustomer/dialogs/DeviceModel/DeviceModel.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    objUser: id,
                    Tasks: [],
                    event: ev,

                }
            })
        }


        //Dynamic Pagging End

        $scope.init();
    }

})();