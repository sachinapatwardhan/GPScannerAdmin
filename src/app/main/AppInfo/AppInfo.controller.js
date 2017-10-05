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
                AppLogo: '',
                CreatedDate: new Date(),

            }
            $scope.FlgImage = '';
            $scope.ImageLogo = '';
            $scope.IOSC = '';
            $scope.IOSK = '';
            $scope.myCroppedImage = '';
            $scope.Search = '';
            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;

        }

        //Save App info Detail
        $scope.SaveAppInfo = function(o) {
            o.IOSCertificate = $scope.IOSC;
            o.IOSKey = $scope.IOSK;
            var ICName = '';
            var IKName = '';
            if ($scope.IOSCertificate.length == 0 && $scope.IOSC == '') {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('IOS Certificate file is Required')
                    .position('top right')
                    .hideDelay(3000)
                );
            } else if ($scope.IOSKey.length == 0 && $scope.IOSK == '') {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('IOS Key file is Required')
                    .position('top right')
                    .hideDelay(3000)
                );
            } else if ($scope.AppLogo.length == 0 && $scope.myCroppedImage == '') {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Image is Required')
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {
                if ($scope.IOSCertificate.length > 0) {
                    angular.forEach($scope.IOSCertificate, function(obj) {
                        ICName = (obj.lfFile.name).split('.')[1];
                    });
                }
                if ($scope.IOSKey.length > 0) {
                    angular.forEach($scope.IOSKey, function(obj) {
                        IKName = (obj.lfFile.name).split('.')[1];
                    });
                }
                if ((ICName != 'pem' && $scope.IOSC == '') || (IKName != 'pem' && $scope.IOSK == '')) {
                    if (ICName != 'pem') {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Only .pem file is Supported for IOS Certificate')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                    if (IKName != 'pem') {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Only .pem file is Supported for IOS Key')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }


                } else {
                    $http.post($rootScope.RoutePath + "appinfo/SaveAppInfo", o).then(function(data) {
                        var Id;

                        if (o.Id != 0) {
                            Id = o.Id;
                        } else {
                            Id = data.data.data[0].Id;
                        }
                        if ($scope.IOSCertificate.length > 0 || $scope.IOSKey.length > 0 || $scope.AppLogo.length > 0) {
                            var formData = new FormData();
                            // angular.forEach($scope.IOSCertificate, function(obj) {
                            //     formData.append(Id, obj.lfFile);
                            // });
                            if ($scope.AppLogo.length > 0) {
                                angular.forEach($scope.AppLogo, function(obj) {
                                    var Logo = Id + ',' + 'logo';
                                    formData.append(Logo, obj.lfFile);
                                });
                            }
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
                                $rootScope.Logo = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + data.data.data.Name;
                                // localStorage.setItem('appName', data.AppName);
                                localStorage.setItem('Logo', $rootScope.Logo)
                                $('#login-form .logo').css('background-image', 'url(' + $rootScope.Logo + ')');
                                $('.logo-image').css('background-image', 'url(' + $rootScope.Logo + ')');
                                $scope.apiMedia.removeAll();
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
            }
        }

        $scope.setFiles = function(element) {
            $scope.FlgImage = 0;
            $scope.myCroppedProfileImage = $rootScope.RoutePath + 'MediaUploads/EmployeeProfile/' + $scope.model.Document;
        };

        $scope.removeAllFiles = function() {

                function callMethod(i) {
                    if (i < 2) {
                        $timeout(function() {
                            if ($scope.Mediafiles.length > 0) {
                                $scope.FlgImage = 1;
                                $scope.FlgCropImage = 1;

                                $scope.myImage = $scope.Mediafiles[0].lfDataUrl;

                            } else {
                                $scope.myImage = '';

                                if ($scope.model.image != '' && $scope.model.image != null && $scope.model.image != undefined) {
                                    $scope.$apply(function() {
                                        $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image;
                                        $scope.FlgImage = 1;
                                    })

                                    // $('#UploadedImage').attr('src','');
                                    //$('#UploadedImage').remove();
                                    // $('#UploadedImage')[0].removeAttribute("src");
                                    // $('#UploadedImage')[0].src = $scope.myCroppedImage;
                                    // document.getElementById("UploadedImage").src = $scope.myCroppedImage;
                                    //document.getElementById("UploadedImage").innerHTML = "<img src\= " + $scope.myCroppedImage + " width='150px' />";
                                } else {
                                    $scope.$apply(function() {
                                        $scope.myCroppedImage = '';
                                    })

                                    $scope.FlgImage = 0;
                                };
                                $scope.FlgCropImage = 0;
                                callMethod(i + 1);

                            }
                        });
                    };
                }
                callMethod(0);
            }
            // $scope.$watch('myCroppedImage', function(newval) {
            //     if ($scope.myCroppedImage != '' && $scope.myCroppedImage != $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image && $scope.Mediafiles.length > 0) {
            //         var image = $scope.myCroppedImage;
            //         var blob = b64toBlob(image.split(",")[1], $scope.Mediafiles[0].lfFile.type, 512);
            //         file = new File([blob], $scope.Mediafiles[0].lfFileName, {
            //             type: $scope.Mediafiles[0].lfFile.type
            //         });
            //     }
            // })



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
                DTColumnBuilder.newColumn('DisplyCreatedDate').renderWith(Datefun),
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
                // .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};
        $scope.reloadData = function() {}

        function callback(json) {}

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">';

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
                // return moment(moment.utc(data).toDate()).format("DD-MM-YYYY HH:mm");
                return $rootScope.convertdateformat(data, 1);
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
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            var o = _.findWhere($scope.lstAppInfo, { Id: Id });


            $scope.model.Id = o.Id;
            $scope.model.AppName = o.AppName;
            $scope.model.BundleId = o.BundleId;
            $scope.model.IOSCertificate = o.IOSCertificate;
            $scope.model.IOSKey = o.IOSKey;
            $scope.model.AndroidId = o.AndroidId;
            $scope.model.AndroidSenderId = o.AndroidSenderId;
            $scope.model.AppLogo = o.AppLogo;
            $scope.IOSC = o.IOSCertificate;
            $scope.IOSK = o.IOSKey;
            // $scope.AppLogo = o.ImageLogo;
            $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.ImageLogo; //$scope.AppLogo;
            if (o.ImageLogo != null && o.ImageLogo != '' && o.ImageLogo != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }
        }
        $scope.RemoveImage = function() {
            $scope.myImage = '';
            $scope.FlgImage = 0;
            $scope.model.image = '';
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
            $scope.model = {
                Id: 0,
                AppName: '',
                BundleId: '',
                IOSCertificate: '',
                IOSKey: '',
                AndroidId: '',
                AndroidSenderId: '',
                AppLogo: '',
                CreatedDate: new Date(),
            }
            $scope.flag = false;

            $scope.apiResetIC.removeAll();
            $scope.apiResetIK.removeAll();
            $scope.apiMedia.removeAll();
            $scope.resetForm();
        }
        $scope.Reset = function() {
            $scope.model = {
                Id: 0,
                AppName: '',
                BundleId: '',
                IOSCertificate: '',
                IOSKey: '',
                AndroidId: '',
                AndroidSenderId: '',
                AppLogo: '',
                CreatedDate: new Date(),
            }
            $scope.FlgImage = '';
            $scope.IOS_C = '';
            $scope.apiMedia.removeAll();
            $scope.apiResetIC.removeAll();
            $scope.apiResetIK.removeAll();
            $scope.IOSC = '';
            $scope.IOSK = '';
            $scope.myCroppedImage = '';
            $scope.Search = '';
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.flag = true;
            $scope.resetForm();

        }


        $scope.init();


    }

})();