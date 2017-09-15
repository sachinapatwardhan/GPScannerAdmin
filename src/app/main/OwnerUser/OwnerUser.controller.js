(function() {
    'use strict';

    angular
        .module('app.user')
        .controller('OwnerUserController', OwnerUserController);

    /** @ngInject */
    function OwnerUserController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {

        var vm = this;
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.UserRoles = localStorage.getItem('UserRoles');

        $scope.init = function() {
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
                IsMobileVerify: false,
                idApp: $rootScope.appId,
            };
            //$scope.GetAllUser();
            $scope.GetAllRoles();
            $scope.tab = {
                selectedIndex: 0
            };

            $scope.FlgImage = 0;
            $scope.FlgCropImage = 0;

            $scope.Search = '';
            $scope.flag = false;
        }

        $scope.clearSearchTerm = function() {
            $scope.searchTermCountry = '';
            $scope.searchTermState = '';
            $scope.searchTermCity = '';
            $scope.searchTermLocation = '';
            $scope.searchTermSubLocation = '';

            $scope.searchCountry = '';
            $scope.searchState = '';
            $scope.searchCity = '';
            $scope.searchLocation = '';
            $scope.searchSubLocation = '';
        };

        $scope.onSearchChange = function($event) {
            $event.stopPropagation();
        }

        $scope.GetAllRoles = function() {
            // Data
            $http.get($rootScope.RoutePath + "role/GetAllRole").then(function(data) {
                $scope.lstRoles = data.data;
            });
        }

        $scope.FetchRoleById = function(id) {
            $rootScope.FlgAddedEditlocal = true;
            var o = _.findWhere($scope.lstdata, {
                id: id
            });
            $scope.tab.selectedIndex = 1;
            $scope.model.phone = o.phone;
            $scope.model.email = o.email;
            $scope.model.phone = o.phone;
            $scope.model.username = o.username;
            $scope.model.createddate = o.createddate;
            $scope.model.createdby = o.createdby;
            $scope.model.modifieddate = new Date();
            $scope.model.modifiedby = "Admin";
            $scope.model.id = o.id;
            $scope.model.userId = o.id;
            //$scope.model.password = o.password;
            $scope.model.country = o.country;
            // $scope.GetAllStateByCountry($scope.model.country);
            // $scope.model.state = o.state;
            // $timeout(function() {
            //     $scope.GetAllCityByStateId($scope.model.state);
            //     $scope.model.city = o.city;
            // }, 1000);

            $scope.model.gender = o.gender;
            $scope.model.IsMobileVerify = o.IsMobileVerify;

            if (o.tbluserinroles.length > 0) {
                for (var i = 0; i < o.tbluserinroles.length; i++) {
                    var obj = _.findWhere($scope.lstRoles, {
                        id: o.tbluserinroles[i].roleId
                    })
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

            $scope.flag = true;

        }


        //Get All Country
        $scope.GetAllCountry = function() {
            $http.get($rootScope.RoutePath + "country/GetAllCountry").then(function(data) {
                $scope.lstCountry = data.data;
                var obj = _.filter($scope.lstCountry, {
                    Country: 'Malaysia'
                });
                $scope.idCountry = obj[0].Country;
                // console.log($scope.idCountry);
            });
        }

        //Get All State By Country Name
        $scope.GetAllStateByCountry = function(Country) {
            $scope.lstState = '';
            $scope.lstCity = '';
            $scope.model.state = "";
            $scope.model.city = "";

            // console.log(Country);
            // if (Country != null && Country != '' && Country != undefined) {
            //     var Countryid = _.filter($scope.lstCountry, {
            //         Country: Country
            //     });
            //     $scope.lstState = '';
            //     $scope.lstCity = '';
            //     var params = {
            //         CountryId: Countryid[0].id
            //     };
            //     $http.get($rootScope.RoutePath + "state/GetAllStateByCountryId", {
            //         params: params
            //     }).success(function(data) {
            //         $scope.lstState = data.data;
            //     });
            // }

        }

        //Get All City By State Name
        $scope.GetAllCityByStateId = function(State) {
            if (State != null && State != '' && State != undefined) {
                var Stateid = _.filter($scope.lstState, {
                    Name: State
                });
                $scope.lstCity = '';
                var params = {
                    StateId: Stateid[0].id
                };
                $http.get($rootScope.RoutePath + "city/GetAllCityByStateId", {
                    params: params
                }).success(function(data) {
                    $scope.lstCity = data.data;
                });
            }
        }

        //Create New User With It's Role
        $scope.CreateUser = function(o) {
            console.log(o);
            o.roleId = _.where($scope.lstRoles, {
                checked: true
            });
            if (o.roleId.length > 0) {
                if ($scope.Mediafiles.length == 0 && (o.id == 0 || o.id == '')) {
                    o.image = null;
                    $cookieStore.put('UserImage', null);
                    $rootScope.UserImage = $cookieStore.get('UserImage');
                }
                o.idApp = localStorage.getItem('appId');
                $http.post($rootScope.RoutePath + "user/SaveUserNew", o).then(function(data) {
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
                                headers: {
                                    'Content-Type': undefined
                                }
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


        //Dynamic Pagging
        // console.log($rootScope.UserCountry);
        // console.log($rootScope.UserRoles);
        // console.log($rootScope.CountryList);
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('createddate').renderWith(NumberHtml).notSortable().withOption('width', '4%'),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(ImageHtml).withOption('width', '4%'),
                DTColumnBuilder.newColumn('username').withOption('width', '12%'),
                DTColumnBuilder.newColumn('email').withOption('width', '13%'),
                DTColumnBuilder.newColumn('phone').withOption('width', '9%'),
                DTColumnBuilder.newColumn(null).renderWith(roleHtml),
                // DTColumnBuilder.newColumn('AppName').renderWith(AppHtml),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml).withOption('width', '20%').withOption('class', 'text-center')
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "user/GetAllDynamicUser",
                    data: function(d) {
                        if ($scope.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.Search;
                        }
                        d.appId = $rootScope.appId;
                        d.UserCountry = $rootScope.UserCountry;
                        d.UserRoles = $rootScope.UserRoles;
                        d.CountryList = $rootScope.CountryList;
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        // console.log(json);
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
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [2, 'asc'])
                .withOption('responsive', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};


        //Reload Datatable
        $scope.GetAllUser = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#Usertable').dataTable()._fnPageChange(0);
            $('#Usertable').dataTable()._fnAjaxUpdate();

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

        function AppHtml(data, type, full, meta) {
            // console.log(full)
            var appname = '';

            if (full.AppName != null && full.AppName != undefined && full.AppName != '') {
                appname = full.AppName;
            }

            return appname;
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
            // if (full.RoleName != null) {
            //     varspan = full.RoleName;
            // } else {
            //     varspan = 'N/A';
            // }
            return varspan;
        };

        function DateFormateHtml(data, type, full, meta) {
            if (data != null && data != undefined && data != '') {
                return $rootScope.convertdate(data);
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
            var btns = '<div layout="row">'
                // btns += '<md-button  class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="FetchRoleById(' + data.id + ')" aria-label="">' +
                //     '<md-icon md-font-icon="icon-pencil-box-outline"></md-icon> <md-tooltip md-visible="" md-direction="">Edit User </md-tooltip>' +
                //     '</md-button>';


            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="FetchRoleById(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="ResetPassword(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-account-alert"  class="s18 blue-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Reset Password</md-tooltip>' +
                    '</md-button>';
            }

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="ChangePassword($event,' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-key-change"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Change Password</md-tooltip>' +
                    '</md-button>';
            }
            // if (data.IsSuspend) {
            //     btns += '<md-button class="edit-button md-icon-button" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="SetSuspendStatus(' + data.id + ',0)" aria-label="">' +
            //         '<md-icon md-font-icon="icon-lock-outline" class="s18 red-500-fg"></md-icon> <md-tooltip md-visible="" md-direction="">Resume User </md-tooltip>' +
            //         '</md-button>';
            // } else {
            //     btns += '<md-button class="edit-button md-icon-button" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="SetSuspendStatus(' + data.id + ',1)" aria-label="">' +
            //         '<md-icon md-font-icon="icon-lock-unlocked-outline" class="s18 deep-purple-500-fg"></md-icon> <md-tooltip md-visible="" md-direction="">Suspend User </md-tooltip>' +
            //         '</md-button>';
            // }

            // btns += '<md-button class="md-icon-button md-accent md-raised md-hue-2" ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ResetPassword(' + data.id + ')"><md-icon md-svg-icon="assets/icons/icon-pass-reset.svg"></md-icon> <md-tooltip md-visible="" md-direction="">Reset Password</md-tooltip></md-button></div>';
            // btns += '<md-button class="md-raised md-primary"  ng-if="' + $rootScope.FlgModifiedAccess + '" ng-click="ResetPassword(' + data.id + ')">Reset Password</md-button>'

            return btns;
        };

        //Dynamic Pagging End

        $scope.SetSuspendStatus = function(id, flg) {
            var title = "";
            if (flg) {
                title = 'Are you sure you want to suspend this user?';
            } else {
                title = 'Are you sure you want to resumed this user?';
            }
            var confirm = $mdDialog.confirm()
                .title(title)
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    idUser: id,
                    flg: flg
                };
                $http.get($rootScope.RoutePath + "user/SetSuspendStatus", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.GetAllUser(true);
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
        }

        //Reset Password User By Id
        $scope.ResetPassword = function(id) {
            $scope.obj = _.findWhere($scope.lstdata, {
                id: id
            });
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Reset Password of this User ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "account/forgotpassword?email=" + $scope.obj.email).then(function(data) {
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

        $scope.ChangePassword = function(ev, id) {
            var obj = _.findWhere($scope.lstdata, { id: id })
            $mdDialog.show({
                controller: 'ChangePassword1Controller',
                controllerAs: 'vm',
                templateUrl: 'app/main/OwnerUser/dialogs/ChangePassword/ChangePassword.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    obj: obj,
                    Tasks: [],
                    event: ev,
                    VM: vm
                }
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

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }

        $scope.$watch('myCroppedImage', function(newval) {
            if ($scope.myCroppedImage != '' && $scope.myCroppedImage != $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image && $scope.Mediafiles.length > 0) {
                var image = $scope.myCroppedImage;
                var blob = b64toBlob(image.split(",")[1], $scope.Mediafiles[0].lfFile.type, 512);
                file = new File([blob], $scope.Mediafiles[0].lfFileName, {
                    type: $scope.Mediafiles[0].lfFile.type
                });
            }
        })

        var file;
        $scope.CropImageToFile = function() {
            if ($scope.myCroppedImage != '' && $scope.myCroppedImage != $rootScope.RoutePath + 'MediaUploads/UserUpload/' + $scope.model.image) {
                var image = $scope.myCroppedImage;
                var blob = b64toBlob(image.split(",")[1], $scope.Mediafiles[0].lfFile.type, 512);
                file = new File([blob], $scope.Mediafiles[0].lfFileName, {
                    type: $scope.Mediafiles[0].lfFile.type
                });
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

        $scope.GetSerch = function(Search) {
            $scope.Search = Search;
            $scope.GetAllUser(true);
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
                    IsMobileVerify: false,
                    idApp: $rootScope.appId,
                };
                $scope.tab = {
                    selectedIndex: 1
                };
                $scope.FlgImage = 0;
                $scope.FlgCropImage = 0;
                $scope.flag = true;

                $scope.GetAllRoles();
                $scope.restForm();
                $scope.myImage = '';
                $scope.myCroppedImage = '';
                $scope.apiMedia.removeAll();
            }
        }
        $scope.ResetData = function() {

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
                IsMobileVerify: false,
                idApp: $rootScope.appId,
            };
            $scope.FlgImage = 0;
            $scope.FlgCropImage = 0;
            $scope.restForm();
            $scope.myImage = '';
            $scope.myCroppedImage = '';
            $scope.apiMedia.removeAll();

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