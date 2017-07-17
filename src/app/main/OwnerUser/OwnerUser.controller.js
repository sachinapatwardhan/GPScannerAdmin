(function() {
    'use strict';

    angular
        .module('app.owneruser')
        .controller('OwnerUserController', OwnerUserController);

    /** @ngInject */
    function OwnerUserController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                email: '',
                username: '',
                ShopName: '',
                PersonInCharge: '',
                phone: '',
                createdby: 'Admin',
                createddate: new Date(),
                modifiedby: '',
                modifieddate: null,
                roleId: '',
                userId: '',
                country: '',
                state: '',
                city: '',
                gender: '',
                image: '',
                Type: '',
                OwnerName: '',
                OwnerPhone: '',
                OwnerEmail: '',
                // OwnerPassword: '',
                IsMobileVerify: false,
            };
            //$scope.GetAllUser();
            $scope.GetAllRoles();
            $scope.GetAllCountry();
            $scope.tab = { selectedIndex: 0 };

            $scope.FlgImage = 0;
            $scope.FlgCropImage = 0;
        }

        // $scope.GetAllUser = function () {
        //     // Data
        //     $http.get($rootScope.RoutePath + "user/GetAllUser").then(function (data) {
        //         $scope.lstUsers = data.data;
        //     });
        // }

        $scope.GetAllRoles = function() {
            // Data
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function(data) {
                $scope.lstRoles = data.data;
            });
        }

        $scope.FetchRoleById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstdata, { id: id });
            $scope.tab.selectedIndex = 1;
            $scope.model.phone = o.phone;
            $scope.model.email = o.email;
            $scope.model.phone = o.phone;
            $scope.model.username = o.username;

            $scope.model.ShopName = o.ShopName;
            $scope.model.PersonInCharge = o.PersonInCharge;

            $scope.model.createddate = o.createddate;
            $scope.model.createdby = o.createdby;
            $scope.model.modifieddate = new Date();
            $scope.model.modifiedby = "Admin";
            $scope.model.id = o.id;
            $scope.model.userId = o.id;
            //$scope.model.password = o.password;
            $scope.model.country = o.country;
            $scope.GetAllStateByCountry($scope.model.country);
            $scope.model.state = o.state;
            $timeout(function() {
                $scope.GetAllCityByStateId($scope.model.state);
                $scope.model.city = o.city;
            }, 1000);

            $scope.model.gender = o.gender;
            $scope.model.Type = o.Type;
            $scope.model.OwnerName = o.OwnerName;
            $scope.model.OwnerPhone = o.OwnerPhone;
            $scope.model.OwnerEmail = o.OwnerEmail;
            // $scope.model.OwnerPassword = o.OwnerPassword;
            $scope.model.IsMobileVerify = o.IsMobileVerify;

            if (o.tbluserinroles.length > 0) {
                for (var i = 0; i < o.tbluserinroles.length; i++) {
                    var obj = _.findWhere($scope.lstRoles, { id: o.tbluserinroles[i].roleId })
                    obj.checked = true;
                }
            }

            $scope.model.image = o.image;
            $scope.myCroppedImage = $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image;
            if ($scope.model.image != null && $scope.model.image != '' && $scope.model.image != undefined) {
                $scope.FlgImage = 1;
            } else {
                $scope.FlgImage = 0;
            }

        }


        //Get All Country
        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
            });
        }

        //Get All State By Country Name
        $scope.GetAllStateByCountry = function(Country) {
            $scope.lstState = '';
            $scope.lstCity = '';
            $scope.model.state = "";
            $scope.model.city = "";
            if (Country != null && Country != '' && Country != undefined) {
                var Countryid = _.where($scope.lstCountry, { Country: Country })[0].id;
                $scope.lstState = '';
                $scope.lstCity = '';
                var params = {
                    CountryId: Countryid
                };
                $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", { params: params }).success(function(data) {
                    $scope.lstState = data.data;
                });
            }

        }

        //Get All City By State Name
        $scope.GetAllCityByStateId = function(State) {
            if (State != null && State != '' && State != undefined) {
                var Stateid = _.where($scope.lstState, { Name: State })[0].id;

                $scope.lstCity = '';
                var params = {
                    StateId: Stateid
                };
                $http.get($rootScope.RoutePath + "city/GetAllCityByStateId", { params: params }).success(function(data) {
                    $scope.lstCity = data.data;
                });
            }
        }

        //Create New User With It's Role
        $scope.CreateUser = function(o) {
            o.roleId = _.where($scope.lstRoles, { checked: true });
            if (o.roleId.length > 0) {
                if ($scope.Mediafiles.length == 0 && (o.id == 0 || o.id == '')) {
                    o.image = null;
                    $cookieStore.put('UserImage', null);
                    $rootScope.UserImage = $cookieStore.get('UserImage');
                }
                $http.post($rootScope.RoutePath + "user/SaveUser", o).then(function(data) {
                    //$scope.SaveUserInRole(o);
                    if (data.data.success == true) {
                        var id;
                        if (o.id != 0) {
                            id = o.id;
                        } else {
                            id = data.data.data.userId;
                        }
                        if ($scope.Mediafiles.length > 0) {
                            var formData = new FormData();
                            // angular.forEach($scope.Mediafiles, function(d) {
                            formData.append(id, file);
                            // });
                            $http.post($rootScope.RoutePath + "user/uploadImage", formData, {
                                transformRequest: angular.identity,
                                headers: { 'Content-Type': undefined }
                            }).then(function(data) {
                                if ($rootScope.UserName == o.username) {
                                    if (data.data.data != null) {
                                        $cookieStore.put('UserImage', data.data.data);
                                        $rootScope.UserImage = $cookieStore.get('UserImage');
                                    }
                                }

                                $scope.myImage = '';
                                $scope.myCroppedImage = '';
                                $scope.apiMedia.removeAll();
                                $scope.GetAllUser(true);
                                $rootScope.FlgAddedEditlocal = false;
                                if ($rootScope.FlgAddedAccess == true) {
                                    $rootScope.FlgAddedEditlocal = true;
                                }

                                $scope.init();
                            }, function(err) {
                                $scope.myImage = '';
                                $scope.myCroppedImage = '';
                                $scope.apiMedia.removeAll();
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(err)
                                    .position('top right')
                                    .hideDelay(3000)
                                );
                                // do sometingh
                            });

                        } else {
                            $rootScope.FlgAddedEditlocal = false;
                            if ($rootScope.FlgAddedAccess == true) {
                                $rootScope.FlgAddedEditlocal = true;
                            }
                            $scope.GetAllUser(true);
                            $scope.init();
                        }
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    } else {
                        if (data.data.data == 'TOKEN') {
                            //$cookieStore.remove('UserName');
                            //$cookieStore.remove('token');
                            //window.location.href = '/app/login';
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
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Please Select atleast One Role...')
                    .position('top right')
                    .hideDelay(3000)
                );
            }

        }

        //$scope.SaveUserInRole = function (o) {
        //    o.roleId = parseInt(o.roleId);
        //    $http.post($rootScope.RoutePath + "user/SaveUserInRole", o).then(function (data) {
        //        if (data.data.success == true) {
        //            $mdToast.show(
        //                $mdToast.simple()
        //                .textContent(data.data.message)
        //                .position('top right')
        //                .hideDelay(3000)
        //            );
        //            $scope.GetAllUser(true);
        //            $scope.init();
        //        } else {
        //            if (data.data.data == 'TOKEN') {
        //                $cookieStore.remove('UserName');
        //                $cookieStore.remove('token');
        //                window.location.href = '/app/login';
        //            } else {
        //                $mdToast.show(
        //                    $mdToast.simple()
        //                    .textContent(data.data.message)
        //                    .position('top right')
        //                    .hideDelay(3000)
        //                );
        //            }
        //        }
        //    });
        //};


        //Dynamic Pagging
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('createddate').renderWith(NumberHtml).notSortable(),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml),
                DTColumnBuilder.newColumn('username'),
                DTColumnBuilder.newColumn('OwnerName'),
                DTColumnBuilder.newColumn('country'),
                DTColumnBuilder.newColumn('email'),
                DTColumnBuilder.newColumn('OwnerPhone'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(roleHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml)
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "user/GetAllDynamicUserbyCountry",
                    data: function(d) {
                        d.UserCountry = $rootScope.UserCountry;
                        d.UserRoles = $rootScope.UserRoles;
                        d.CountryList = $rootScope.CountryList;
                        d.Type = ['Owner', 'Both'];
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
                .withOption('responsive', true)
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
            $('#OwnerUsertable').dataTable()._fnPageChange(0);
            $('#OwnerUsertable').dataTable()._fnAjaxUpdate();

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

        function roleHtml(data, type, full, meta) {
            var varspan = '';
            if (full.tbluserinroles.length > 0) {
                for (var i = 0; i < full.tbluserinroles.length; i++) {
                    if (i == 0) {
                        varspan = full.tbluserinroles[i].tblrole.RoleName;
                    } else {
                        varspan = varspan + ', ' + full.tbluserinroles[i].tblrole.RoleName;
                    }
                }
            } else {
                varspan = 'N/A';
            }
            return varspan;
        };

        function DateFormateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return $rootScope.convertdateformat(data);
            } else {
                return 'N/A';
            }
        }

        function ImageHtml(data, type, full, meta) {
            var img = '';
            if (full.image != "") {
                img = '<img ng-src="' + $rootScope.RoutePath + 'MediaUploads/UserUpload/' + full.image + '" err-src="assets/images/default-user.png" height="50px" width="50px">';

            } else if (full.image == "") {
                img = '<img ng-src="assets/images/default-user.png" height="50px" width="50px">';
            }
            return img;
        }


        function actionsHtml(data, type, full, meta) {

            var btns = '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="FetchRoleById(' + data.id + ')" aria-label="">' +
                '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon>' +
                '</md-button>';

            btns += '<md-button class="md-raised md-primary" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ResetPassword(' + data.id + ')">Reset Password</md-button>';

            return btns;
        };

        //Dynamic Pagging End


        //Reset Password User By Id
        $scope.ResetPassword = function(id) {
            $scope.obj = _.findWhere($scope.lstdata, { id: id });
            
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Reset Password of this User ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "account/forgotpassword?email=" + $scope.obj.email +"&Type=Owner").then(function(data) {
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


        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $scope.setFiles = function() {
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

                    } else {
                        $scope.$apply(function() {
                            $scope.myCroppedImage = '';
                        })

                        $scope.FlgImage = 0;
                    };


                    $scope.FlgCropImage = 0;
                }
                $scope.removeAllFiles();
            }, 1000);

        };

        // $scope.$watch('Mediafiles', function(newVal) {
        //     console.log(newVal);
        //     console.log($scope.Mediafiles);
        // })

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

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        $scope.$watch('myCroppedImage', function(newval) {
            if ($scope.myCroppedImage != '' && $scope.myCroppedImage != $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image && $scope.Mediafiles.length > 0) {
                var image = $scope.myCroppedImage;
                var blob = b64toBlob(image.split(",")[1], $scope.Mediafiles[0].lfFile.type, 512);
                file = new File([blob], $scope.Mediafiles[0].lfFileName, { type: $scope.Mediafiles[0].lfFile.type });
            }
        })

        var file;
        $scope.CropImageToFile = function() {
            if ($scope.myCroppedImage != '' && $scope.myCroppedImage != $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image) {
                var image = $scope.myCroppedImage;
                var blob = b64toBlob(image.split(",")[1], $scope.Mediafiles[0].lfFile.type, 512);
                file = new File([blob], $scope.Mediafiles[0].lfFileName, { type: $scope.Mediafiles[0].lfFile.type });
            }
        }

        $scope.RemoveImage = function() {
            $scope.myImage = '';
            $scope.FlgImage = 0;
            $scope.model.image = '';
        }


        $scope.restForm = function() {
            $scope.AddUserForm.$setUntouched();
            $scope.AddUserForm.$setPristine();
        }

        $scope.ResetEdit = function() {
            if ($rootScope.FlgAddedAccess == true) {
                $scope.model = {
                    id: '',
                    email: '',
                    username: '',
                    phone: '',
                    createdby: 'Admin',
                    createddate: new Date(),
                    modifiedby: '',
                    modifieddate: null,
                    roleId: '',
                    userId: '',
                    country: '',
                    state: '',
                    city: '',
                    gender: '',
                    image: '',
                    Type: '',
                    OwnerName: '',
                    OwnerPhone: '',
                    OwnerEmail: '',
                    // OwnerPassword: '',
                    IsMobileVerify: false,
                };
                $scope.FlgImage = 0;
                $scope.FlgCropImage = 0;

                $scope.GetAllRoles();
                $scope.restForm();
                $scope.myImage = '';
                $scope.myCroppedImage = '';
                $scope.apiMedia.removeAll();
            }
        }
        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess != true) {
                $scope.FlgAddedEditlocal = false;
            }
        }

        $scope.Reset = function() {
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.init();
            $scope.myImage = '';
            $scope.myCroppedImage = '';
            $scope.apiMedia.removeAll();

        }

        $scope.init();
    }

})();
