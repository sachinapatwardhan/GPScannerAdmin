(function() {
    'use strict';

    angular
        .module('app.appinfo')
        .controller('AppInfoController', AppInfoController);

    /** @ngInject */
    function AppInfoController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        $scope.init = function() {
            $scope.model = {
                    Id: 0,
                    AppName: '',
                    BundleId: '',
                    IOSCertificate: '',
                    IOSKey: '',
                    AndroidId: '',
                    AndroidSenderId: '',

                }
                // $scope.IOSCertificate = '';
            $scope.IOSC = '';
            $scope.IOSK = '';
            $scope.Search = '';
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;

        }

        //Save App info Detail
        $scope.SaveAppInfo = function(o) {
            o.IOSCertificate = $scope.IOSC;
            o.IOSKey = $scope.IOSK;
            $http.post($rootScope.RoutePath + "appinfo/SaveAppInfo", o).then(function(data) {
                console.log(data.data.data);
                var Id;
                if (o.Id != 0) {
                    Id = o.Id;
                } else {
                    Id = data.data.data.Id;
                }
                if ($scope.IOSCertificate.length > 0 || $scope.IOSKey.length > 0) {
                    var formData = new FormData();
                    // angular.forEach($scope.IOSCertificate, function(obj) {
                    //     formData.append(Id, obj.lfFile);
                    // });

                    if ($scope.IOSCertificate.length > 0) {
                        angular.forEach($scope.IOSCertificate, function(obj) {
                            var IC = Id + ',' + 'IC';

                            formData.append(IC, obj.lfFile);
                        });
                    }
                    if ($scope.IOSKey.length > 0) {
                        angular.forEach($scope.IOSKey, function(obj) {
                            var IK = Id + ',' + 'IK';
                            formData.append(IK, obj.lfFile);
                        });
                    }

                    $http.post($rootScope.RoutePath + "appinfo/uploadFile", formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function(data) {
                        // $scope.IOSCertificate = '';
                        // $scope.IOSKey = '';
                        $scope.apiResetIC.removeAll();
                        $scope.apiResetIK.removeAll();
                        $rootScope.FlgAddedEditlocal = false;
                        if ($rootScope.FlgAddedAccess == true) {
                            $rootScope.FlgAddedEditlocal = true;
                        }
                        GetAllDynamicAppInfo(true);
                        $scope.init();
                    }, function(err) {

                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(err)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        // do sometingh
                    });
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
                GetAllDynamicAppInfo(true);
                $scope.ResetModel();
            });
        }


        //Dynamic Pagging
        function GetAllDynamicAppInfo(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#AppInfo').dataTable()._fnAjaxUpdate();

        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {

            $scope.FilterStatus = '';

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn('AppName'),
                DTColumnBuilder.newColumn('BundleId'),
                DTColumnBuilder.newColumn('IOSCertificate'),
                DTColumnBuilder.newColumn('IOSKey'),
                DTColumnBuilder.newColumn('AndroidId'),
                DTColumnBuilder.newColumn('AndroidSenderId'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(Datefun),
                DTColumnBuilder.newColumn('CreatedBy'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: $rootScope.RoutePath + "appinfo/GetAllAppInfo",
                data: function(d) {
                    if ($scope.Search == '') {
                        d.search = '';
                    } else {
                        d.search = $scope.Search;
                    }
                    return d;
                },
                type: "get",
                dataSrc: function(json) {
                    if (json.success != false) {
                        // console.log(json.data);
                        $scope.lstAppInfo = json.data;
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
                .withOption('aaSorting', [7, 'DESC'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                // .withOption('deferRender', true)
                .withOption('createdRow', createdRow)
                // .withOption('bFilter', false)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};
        $scope.reloadData = function() {}

        function callback(json) {
            // console.log(json);
        }


        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">';

            // console.log($rootScope.FlgModifiedAccess, $rootScope.FlgDeletedAccess)
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="EditAppinfo(' + data.Id + ')" aria-label="Edit Location">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip  md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgDeletedAccess) {
                btns += '<md-button class="edit-button md-icon-button" ng-click="DeleteAppInfo(' + data.Id + ')" aria-label="Add SubLocation">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible=""  md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>';
            return btns;
        };

        function NumberHtml(data, type, full, meta) {
            return (meta.row + 1);
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function Datefun(data, type, full, meta) {
            if (data != '' && data != null && data != undefined) {
                // return $filter('date')(data, "dd-MM-yyyy");
                return moment(moment.utc(data).toDate()).format("DD-MM-YYYY HH:mm");
            } else {
                return '';
            }
        }

        //reset form....
        $scope.resetForm = function() {
            $scope.formAppInfo.$setUntouched();
            $scope.formAppInfo.$setPristine();
        }

        // Edit app Info........
        $scope.EditAppinfo = function(Id) {
            console.log("Edir...")
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            var o = _.findWhere($scope.lstAppInfo, { Id: Id });

            $scope.model = o;
            $scope.IOSC = o.IOSCertificate;
            $scope.IOSK = o.IOSKey;
        }

        //Delete app info....................
        $scope.DeleteAppInfo = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this App Info ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    Id: Id
                };
                $http.get($rootScope.RoutePath + "appinfo/DeleteAppInfo", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                        $scope.resetForm();
                        GetAllDynamicAppInfo(true);
                    } else {
                        if (data.data.data == 'TOKEN') {
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

        $scope.RemoveIOSCertificat = function() {
            $scope.IOSC = '';
        }
        $scope.RemoveIOSKey = function() {
            $scope.IOSK = '';
        }
        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            GetAllDynamicAppInfo(true);
        }
        $scope.ResetModel = function() {
            $scope.model = '';
            $scope.flag = false;
            $scope.apiResetIC.removeAll();
            $scope.apiResetIK.removeAll();
            $scope.resetForm();
        }
        $scope.Reset = function() {
                $scope.model = {
                        Id: '',
                        AppName: '',
                        BundleId: '',
                        IOSCertificate: '',
                        IOSKey: '',
                        AndroidId: '',
                        AndroidSenderId: '',
                        CreatedDate: '',
                        CreatedBy: '',
                        tblappinfocol: '',
                    }
                    // $scope.IOSCertificate = '';
                    // $scope.IOSKey = '';
                    // // $scope.apiReset.removeAll()
                $scope.IOS_C = '';
                $scope.apiResetIC.removeAll();
                $scope.apiResetIK.removeAll();
                $scope.Search = '';
                $rootScope.FlgAddedEditlocal = false;
                if ($rootScope.FlgAddedAccess == true) {
                    $rootScope.FlgAddedEditlocal = true;
                }
                $scope.flag = true;
                $scope.resetForm();

            }
            // $scope.apiResetFile = function() {
            //     $scope.apiReset.removeAll()
            // }

        $scope.init();
    }

})();