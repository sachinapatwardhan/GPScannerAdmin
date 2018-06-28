(function() {
    'use strict';

    angular
        .module('app.AssignRetailer')
        .controller('AssignRetailerController', AssignRetailerController);

    /** @ngInject */
    function AssignRetailerController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        // console.log("Hell..");
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.init = function() {
            $rootScope.appId = localStorage.getItem('appId');
            $rootScope.AppName = localStorage.getItem('appName');
            $scope.GetAllInfoList();
        }

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }


        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
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
                    DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('class', 'text-center')
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
                    url: $rootScope.RoutePath + "assignretailer/GetAllSalesAgent",
                    data: function(d) {

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
                $('#Agent').dataTable()._fnAjaxUpdate();

            } else {
                vm.dtInstance1.reloadData(callback, resetPaging);
                $('#Agent1').dataTable()._fnAjaxUpdate();

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
            var btns = '<md-button class="edit-button md-icon-button"  ng-click="ShowRetailer($event,' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-view-list"  class="s18 purple-500-fg"></md-icon>' +
                '<md-tooltip md-visible="" md-direction="">Show Devices</md-tooltip>' +
                '</md-button>';

            return btns;
        };




        //show User Devices
        $scope.ShowRetailer = function(ev, id) {
            var obj = _.findWhere($scope.lstdata, { id: id });
            $mdDialog.show({
                controller: 'RetailerController',
                controllerAs: 'vm',
                templateUrl: 'app/main/AssignRetailer/dialogs/Retailer/Retailer.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    idUser: id,
                    Email: obj.email,
                    Tasks: [],
                    AgentAppId: obj.idApp,
                    event: ev,
                }
            })
        }
        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllUser(true);
        }

        //Dynamic Pagging End


        $scope.init();
    }

})();