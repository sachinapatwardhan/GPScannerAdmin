(function () {
    'use strict';

    angular
        .module('app.WarrantySIM')
        .controller('WarrantySIMController', WarrantySIMController)
        .directive('mdOption', function () {
            return {
                link: function (scope, elem) {
                    scope.$on('$destroy', function () {
                        elem.detach();
                    });
                }
            };
        });

    /** @ngInject */
    function WarrantySIMController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.FlagAdmin = ($rootScope.UserRoles).indexOf('Super Admin') != -1 ? true : false;
        $rootScope.idApp = localStorage.getItem('idApp');
        $rootScope.AppName = localStorage.getItem('appName');
        $scope.modelApp = {
            AppName: $rootScope.AppName
        }
        $scope.init = function () {

            $scope.selectedItem = null;
            $scope.Search = '';
            $scope.flag = false;
            $rootScope.appId = localStorage.getItem('appId');
            $scope.InitModel();
            $scope.clearSearchTerm();
            $scope.GetAllSim();
            $scope.GetAllInfoList();


            if ($rootScope.UserRoles == 'Super Admin') {
                $scope.GetAllInfoList();
            }
        }

        // var pendingSearch = angular.noop;
        $scope.clearSearchTerm = function () {
            vm.searchTermnewsim = '';
            vm.searchTermOldsim = '';
        };
        $scope.onSearchChange = function ($event) {
            $event.stopPropagation();
        }


        $scope.GetAllSim = function () {
            // var params = {
            //     idApp: $scope.model.idApp
            // }
            $http.post($rootScope.RoutePath + "simreplace/GetAllSim").success(function (data) {
                $scope.lstsim = data.data;
            })
        }



        $scope.GetAllInfoList = function () {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function (data) {
                $scope.lstAppInfo = data.data;
            })
        }
        $scope.GetSerch = function (Search) {
            $scope.Search = Search;
            GetAllDynamicWarranty(true);
        }

        function GetAllDynamicWarranty(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            vm.dtInstance1.reloadData(callback, resetPaging);
            $('#Warranty').dataTable()._fnAjaxUpdate();
        }

        $scope.Createwarrantyreplace = function (o) {
            if (o.OldSim == o.NewSim) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Your New SIM and Old SIM is Same. you can't Replace it.")
                        .position('top right')
                        .hideDelay(3000)
                );

            } else {
                var params = {
                    OldSim: o.OldSim,
                    NewSim: o.NewSim,

                }
                $http.post($rootScope.RoutePath + "simreplace/SaveSimReplace", params).then(function (data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                        );
                        $scope.resetForm();
                        $scope.init();
                        GetAllDynamicWarranty(true);
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
        };

        //Dynamic Pagging

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function (response) {
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('CreatedDate').renderWith(NumberHtml).notSortable().withOption('width', '4%').withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('OldSim'),
                DTColumnBuilder.newColumn('NewSim'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
                // DTColumnBuilder.newColumn('IsReuseSim').renderWith(IsActiveHtml),

            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "simreplace/GetAllDyanmicSimReplace",
                data: function (d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    d.idApp = '';
                    if ($rootScope.UserRoles != "Super Admin") {
                        d.idApp = $rootScope.appId;
                    }
                    return d;

                    return d;
                },
                type: "get",
                dataSrc: function (json) {
                    if (json.success != false) {
                        $scope.lst = json.data;
                        $scope.lstTotal = json.recordsTotal;
                        return json.data;
                    } else {
                        $scope.lstTotal = 0;
                        return [];

                    }
                },
            })

                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [0, 'Desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        vm.dtInstance1 = {};

        // function IsActiveHtml(data, type, full, meta) {
        //     var IsReuseSim = '';

        //     if (data.IsReuseSim == 1) {
        //         IsReuseSim = '<md-button  style="font-size: 20px;color: green" >&#x2714;</md-button>';
        //     }
        //     if (data.IsReuseSim == 0) {
        //         IsReuseSim = '<md-button style="font-size: 20px;color: red" ">&#x2716;</md-button>';
        //     }
        //     return IsReuseSim;
        // }


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


        function Datefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                // return $filter('date')(data, "dd-MM-yyyy");
                return moment(moment.utc(data).toDate()).format("DD/MM/YYYY hh:mm:ss A");
            } else {
                return '';
            }
        }

        $scope.resetForm = function () {
            $scope.Formwarranty.$setUntouched();
            $scope.Formwarranty.$setPristine();
        }

        $scope.ResetTab = function () {
            if ($rootScope.FlgAddedAccess != true) {
                $rootScope.FlgAddedEditlocal = false;
            }
        }

        $scope.Reset = function () {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.InitModel();
            $scope.flag = true;

        }

        $scope.cancel = function () {
            $scope.ResetData();
            $scope.flag = false;
        }

        $scope.ResetData = function () {
            $scope.selectedItem = null;
            $scope.resetForm();
            $scope.clearSearchTerm();
            $scope.InitModel();
        }

        $scope.InitModel = function () {
            $scope.model = {
                id: 0,
                OldSim: '',
                NewSim: '',
                // idApp: parseInt($rootScope.appId),
            };
        }
        $scope.init();
    }

})();