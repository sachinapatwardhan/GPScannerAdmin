(function() {
    'use strict';

    angular
        .module('app.VehicleType')
        .controller('VehicleTypeController', VehicleTypeController);

    /** @ngInject */
    function VehicleTypeController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        var vm = this;
        $rootScope.AppName = localStorage.getItem('appName');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $scope.modelApp = {
            AppName: $rootScope.AppName
        }
        $scope.init = function() {
            $scope.model = {
                id: 0,
                idApp: parseInt(localStorage.getItem('appId')),
                Type: '',
                IsActive: true,
                OnIcon: '',
                OffIcon: '',
                PowerCuttIcon: '',
                ActiveIcon: '',
                LocateOnIcon: '',
                LocateOffIcon: '',
                LocateActiveIcon: '',
                LocatePowerCuttIcon: '',
                LocateIsRotate: true,
                IsIconDynamic: false
            }
            $scope.modelSearch = {
                Search: '',
            }

            $scope.FlgOnIcon = '';
            $scope.FlgActiveIcon = '';
            $scope.FlgOffIcon = '';
            $scope.FlgPowerCuttIcon = '';
            $scope.FlgLocateOnIcon = '';
            $scope.FlgLocateActiveIcon = '';
            $scope.FlgLocateOffIcon = '';
            $scope.FlgLocatePowerCuttIcon = '';

            $scope.myCroppedOnIcon = '';
            $scope.myCroppedActiveIcon = '';
            $scope.myCroppedOffIcon = '';
            $scope.myCroppedPowerCuttIcon = '';
            $scope.myCroppedLocateOnIcon = '';
            $scope.myCroppedLocateActiveIcon = '';
            $scope.myCroppedLocateOffIcon = '';
            $scope.myCroppedLocatePowerCuttIcon = '';

            $scope.FlgAddedEditlocal = true;
            $scope.flag = false;
            // $scope.GetAlltelco();
            $scope.GetAllInfoList();
        }

        $scope.GetAllInfoList = function() {
            $http.get($rootScope.RoutePath + "appinfo/GetAllInfoList").then(function(data) {
                $scope.lstAppInfo = data.data;
            })
        }

        // $scope.GetAlltelco = function() {
        //     $http.get($rootScope.RoutePath + "telco/GetAllCompany").then(function(data) {
        //         $scope.lstCompany = data.data;
        //     });
        // }

        // function GetAllVehicleType() {
        //     $http.get($rootScope.RoutePath + "vehicletype/Getvehicletype").then(function(data) {
        //         $scope.lstVehicleType = data.data;
        //         for (var i = 0; i < $scope.lstVehicleType.length; i++) {
        //             $scope.lstVehicleType[i].CreatedDate = moment($scope.lstVehicleType[i].CreatedDate).format('DD-MM-YYYY hh:mm:ss a');
        //         }
        //     })
        // }

        $scope.SaveVehicleType = function(o) {
            var flg = true;
            var Message = '';
            if ($scope.modelApp.AppName == 'Tracking' || $scope.model.IsIconDynamic == false) {
                $http.post($rootScope.RoutePath + "vehicletype/SaveVehicleType", o).then(function(data) {
                    var id;
                    if (o.id != 0) {
                        id = o.id;
                    } else {
                        id = data.data.data[0].id;
                    }


                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        $scope.GetAllVehicleType(true);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }


                })
            } else {
                if ($scope.OnIcon.length == 0 && $scope.myCroppedOnIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Home On Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.ActiveIcon.length == 0 && $scope.myCroppedActiveIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Home Activate Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.OffIcon.length == 0 && $scope.myCroppedOffIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Home Off Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.PowerCuttIcon.length == 0 && $scope.myCroppedPowerCuttIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Home Powercut Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.LocateOnIcon.length == 0 && $scope.myCroppedLocateOnIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Locate On Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.LocateOffIcon.length == 0 && $scope.myCroppedLocateOffIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Locate Off Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.LocateActiveIcon.length == 0 && $scope.myCroppedLocateActiveIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Locate Active Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if ($scope.LocatePowerCuttIcon.length == 0 && $scope.myCroppedLocatePowerCuttIcon == '') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Locate Powercut Icon is Required')
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if (flg == false) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(Message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else {
                    var on_flg = true;
                    var active_flg = true;
                    var off_flg = true;
                    var locate_on_flg = true;
                    var locate_active_flg = true;
                    var locate_off_flg = true;
                    if ($scope.OnIcon.length > 0) {
                        var image = new Image();
                        image.src = $scope.OnIcon[0].lfDataUrl;

                        image.onload = function() {
                            var height = this.height;
                            var width = this.width;
                            if (height != 50 || width != 31) {
                                // on_flg = false;
                            }
                        };
                    }
                    if ($scope.ActiveIcon.length > 0) {
                        var Activeimage = new Image();
                        Activeimage.src = $scope.ActiveIcon[0].lfDataUrl;

                        Activeimage.onload = function() {
                            var height = this.height;
                            var width = this.width;
                            if (height != 50 || width != 31) {
                                // active_flg = false;
                            }
                        };
                    }
                    if ($scope.OffIcon.length > 0) {
                        var Offimage = new Image();
                        Offimage.src = $scope.OffIcon[0].lfDataUrl;

                        Offimage.onload = function() {
                            var height = this.height;
                            var width = this.width;
                            if (height != 50 || width != 31) {
                                // off_flg = false;
                            }
                        };
                    }

                    if ($scope.PowerCuttIcon.length > 0) {
                        var PowerCutimage = new Image();
                        PowerCutimage.src = $scope.PowerCuttIcon[0].lfDataUrl;

                        PowerCutimage.onload = function() {
                            var height = this.height;
                            var width = this.width;
                            if (height != 50 || width != 31) {
                                // off_flg = false;
                            }
                        };
                    }

                    setTimeout(function() {
                        if (on_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Home On Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else if (active_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Home active Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else if (off_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Home Off Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else if (locate_on_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Locate On Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else if (locate_active_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Locate active Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else if (locate_off_flg == false) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('please upload vehicle status Locate Off Icon 31x50 px Size image')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        } else {
                            $http.post($rootScope.RoutePath + "vehicletype/SaveVehicleType", o).then(function(data) {
                                var id;
                                if (o.id != 0) {
                                    id = o.id;
                                } else {
                                    id = data.data.data[0].id;
                                }

                                if ($scope.OnIcon.length > 0 || $scope.ActiveIcon.length > 0 || $scope.OffIcon.length > 0 || $scope.PowerCuttIcon.length > 0 || $scope.LocateOnIcon.length > 0 || $scope.LocateActiveIcon.length > 0 || $scope.LocateOffIcon.length > 0 || $scope.LocatePowerCuttIcon.length > 0) {
                                    var formData = new FormData();
                                    if ($scope.OnIcon.length > 0) {

                                        angular.forEach($scope.OnIcon, function(obj) {
                                            var Logo = id + ',' + 'OnIcon';
                                            formData.append(Logo, obj.lfFile);
                                        });
                                    }
                                    if ($scope.ActiveIcon.length > 0) {
                                        angular.forEach($scope.ActiveIcon, function(obj) {
                                            var logo2 = id + ',' + 'ActiveIcon';
                                            formData.append(logo2, obj.lfFile);
                                        });
                                    }
                                    if ($scope.OffIcon.length > 0) {
                                        angular.forEach($scope.OffIcon, function(obj) {
                                            var logo3 = id + ',' + 'OffIcon';
                                            formData.append(logo3, obj.lfFile);
                                        });
                                    }
                                    console.log($scope.PowerCuttIcon)
                                    if ($scope.PowerCuttIcon.length > 0) {
                                        angular.forEach($scope.PowerCuttIcon, function(obj) {
                                            var logo4 = id + ',' + 'PowerCuttIcon';
                                            formData.append(logo4, obj.lfFile);
                                        });
                                    }
                                    if ($scope.LocateOnIcon.length > 0) {

                                        angular.forEach($scope.LocateOnIcon, function(obj) {
                                            var Logo = id + ',' + 'LocateOnIcon';
                                            formData.append(Logo, obj.lfFile);
                                        });
                                    }
                                    if ($scope.LocateActiveIcon.length > 0) {
                                        angular.forEach($scope.LocateActiveIcon, function(obj) {
                                            var logo2 = id + ',' + 'LocateActiveIcon';
                                            formData.append(logo2, obj.lfFile);
                                        });
                                    }
                                    if ($scope.LocateOffIcon.length > 0) {
                                        angular.forEach($scope.LocateOffIcon, function(obj) {
                                            var logo3 = id + ',' + 'LocateOffIcon';
                                            formData.append(logo3, obj.lfFile);
                                        });
                                    }
                                    if ($scope.LocatePowerCuttIcon.length > 0) {
                                        angular.forEach($scope.LocatePowerCuttIcon, function(obj) {
                                            var logo4 = id + ',' + 'LocatePowerCuttIcon';
                                            formData.append(logo4, obj.lfFile);
                                        });
                                    }
                                    $http.post($rootScope.RoutePath + "vehicletype/uploadFile", formData, {
                                        transformRequest: angular.identity,
                                        headers: {
                                            'Content-Type': undefined
                                        }
                                    }).then(function(data) {
                                        if (data.data.success == true) {
                                            $mdToast.show(
                                                $mdToast.simple()
                                                .textContent(data.data.message)
                                                .position('top right')
                                                .hideDelay(3000)
                                            );
                                            $scope.ResetModel();
                                            $scope.GetAllVehicleType(true);
                                        } else {
                                            $mdToast.show(
                                                $mdToast.simple()
                                                .textContent(data.data.message)
                                                .position('top right')
                                                .hideDelay(3000)
                                            );
                                        }
                                    })
                                } else {
                                    if (data.data.success == true) {
                                        $mdToast.show(
                                            $mdToast.simple()
                                            .textContent(data.data.message)
                                            .position('top right')
                                            .hideDelay(3000)
                                        );
                                        $scope.ResetModel();
                                        $scope.GetAllVehicleType(true);
                                    } else {
                                        $mdToast.show(
                                            $mdToast.simple()
                                            .textContent(data.data.message)
                                            .position('top right')
                                            .hideDelay(3000)
                                        );
                                    }
                                }

                            })
                        }
                    }, 100);

                }
            }

        }
        $scope.editVehicleTypeId = function(id) {
            var o = _.findWhere($scope.lstVehicleType, {
                id: id
            });

            if (o.OnIcon == null || o.OnIcon == '') {
                $scope.model.IsIconDynamic = false;
            } else {
                $scope.model.IsIconDynamic = true;
            }
            $scope.model.id = o.id;
            $scope.model.idApp = o.idApp;
            $scope.model.Type = o.Type;
            $scope.model.OnIcon = o.OnIcon;
            $scope.model.ActiveIcon = o.ActiveIcon;
            $scope.model.OffIcon = o.OffIcon;
            $scope.model.PowerCuttIcon = o.PowerCuttIcon;
            $scope.model.LocateOnIcon = o.LocateOnIcon;
            $scope.model.LocateActiveIcon = o.LocateActiveIcon;
            $scope.model.LocateOffIcon = o.LocateOffIcon;
            $scope.model.LocatePowerCuttIcon = o.LocatePowerCuttIcon;
            if (o.LocateIsRotate == 1) {
                $scope.model.LocateIsRotate = true;
            } else {
                $scope.model.LocateIsRotate = false;
            }

            if (o.OnIcon != null && o.OnIcon != '' && o.OnIcon != undefined) {
                $scope.FlgOnIcon = 1;
                $scope.myCroppedOnIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.OnIcon; //$scope.AppLogo;

            } else {
                $scope.FlgOnIcon = 0;
            }

            if (o.ActiveIcon != null && o.ActiveIcon != '' && o.ActiveIcon != undefined) {
                $scope.FlgActiveIcon = 1;
                $scope.myCroppedActiveIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.ActiveIcon; //$scope.AppLogo;

            } else {
                $scope.FlgActiveIcon = 0;
            }

            if (o.OffIcon != null && o.OffIcon != '' && o.OffIcon != undefined) {
                $scope.FlgOffIcon = 1;
                $scope.myCroppedOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.OffIcon; //$scope.AppLogo;

            } else {
                $scope.FlgOffIcon = 0;
            }

            if (o.PowerCuttIcon != null && o.PowerCuttIcon != '' && o.PowerCuttIcon != undefined) {
                $scope.FlgPowerCuttIcon = 1;
                $scope.myCroppedPowerCuttIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.PowerCuttIcon; //$scope.AppLogo;

            } else {
                $scope.FlgPowerCuttIcon = 0;
            }

            if (o.LocateOnIcon != null && o.LocateOnIcon != '' && o.LocateOnIcon != undefined) {
                $scope.FlgLocateOnIcon = 1;
                $scope.myCroppedLocateOnIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.LocateOnIcon; //$scope.AppLogo;

            } else {
                $scope.FlgLocateOnIcon = 0;
            }

            if (o.LocateActiveIcon != null && o.LocateActiveIcon != '' && o.LocateActiveIcon != undefined) {
                $scope.FlgLocateActiveIcon = 1;
                $scope.myCroppedLocateActiveIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.LocateActiveIcon; //$scope.AppLogo;

            } else {
                $scope.FlgLocateActiveIcon = 0;
            }

            if (o.LocateOffIcon != null && o.LocateOffIcon != '' && o.LocateOffIcon != undefined) {
                $scope.FlgLocateOffIcon = 1;
                $scope.myCroppedLocateOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.LocateOffIcon; //$scope.AppLogo;

            } else {
                $scope.FlgLocateOffIcon = 0;
            }

            if (o.LocatePowerCuttIcon != null && o.LocatePowerCuttIcon != '' && o.LocatePowerCuttIcon != undefined) {
                $scope.FlgLocatePowerCuttIcon = 1;
                $scope.myCroppedLocatePowerCuttIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + o.LocatePowerCuttIcon; //$scope.AppLogo;

            } else {
                $scope.FlgLocatePowerCuttIcon = 0;
            }
            $scope.flag = true;
        }

        $scope.DeleteVehicleType = function(Id) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to Delete this Vehicle Type ?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: Id
                };
                $http.get($rootScope.RoutePath + "vehicletype/DeleteVehicleTypeById", {
                    params: params
                }).success(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.ResetModel();
                        $scope.GetAllVehicleType(true);
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
        $scope.UpdateStatus = function(id) {
            var message = '';
            var IsActive = 0;
            var o = _.findWhere($scope.lstVehicleType, {
                id: id
            });
            if (o.IsActive == 1) {
                message = 'Are you sure to Deactivate this Vehicle Type'

            } else {
                message = 'Are you sure to Activate this Vehicle Type'
                IsActive = 1;

            }
            var confirm = $mdDialog.confirm()
                .title(message)
                .textContent('')
                .ariaLabel('Lucky day')
                // .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                var params = {
                    id: id,
                    IsActive: IsActive
                }
                $http.get($rootScope.RoutePath + "vehicletype/UpdateIsActiveStatus", { params: params }).then(function(data) {
                    if (data.data.success) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        // $scope.ResetModel();
                        $scope.GetAllVehicleType(true);
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
                        }
                    }
                });
            });
        }
        $scope.resetForm = function() {
            $scope.formVehicleType.$setUntouched();
            $scope.formVehicleType.$setPristine();
        }

        $scope.Reset = function() {
            $scope.model = {
                id: 0,
                idApp: parseInt(localStorage.getItem('appId')),
                Type: '',
                IsActive: true,
                OnIcon: '',
                OffIcon: '',
                PowerCuttIcon: '',
                ActiveIcon: '',
                LocateOnIcon: '',
                LocateOffIcon: '',
                LocateActiveIcon: '',
                LocatePowerCuttIcon: '',
                LocateIsRotate: true,
                IsIconDynamic: false
            }
            $scope.modelSearch = {
                Search: '',
            }
            $rootScope.FlgAddedEditlocal = false;
            if ($rootScope.FlgAddedAccess == true) {
                $rootScope.FlgAddedEditlocal = true;
            }
            $scope.FlgOnIcon = '';
            $scope.FlgActiveIcon = '';
            $scope.FlgOffIcon = '';
            $scope.FlgPowerCuttIcon = '';
            $scope.FlgLocateOnIcon = '';
            $scope.FlgLocateActiveIcon = '';
            $scope.FlgLocateOffIcon = '';
            $scope.FlgLocatePowerCuttIcon = '';

            $scope.myCroppedOnIcon = '';
            $scope.myCroppedActiveIcon = '';
            $scope.myCroppedOffIcon = '';
            $scope.myCroppedPowerCuttIcon = '';
            $scope.myCroppedLocateOnIcon = '';
            $scope.myCroppedLocateActiveIcon = '';
            $scope.myCroppedLocateOffIcon = '';
            $scope.myCroppedLocatePowerCuttIcon = '';



            if ($scope.modelApp.AppName != 'Tracking') {
                $scope.apiOnIcon.removeAll();
                $scope.apiActiveIcon.removeAll();
                $scope.apiOffIcon.removeAll();
                $scope.apiPowerCuttIcon.removeAll();
                $scope.apiLocateOnIcon.removeAll();
                $scope.apiLocateActiveIcon.removeAll();
                $scope.apiLocateOffIcon.removeAll();
                $scope.apiLocatePowerCuttIcon.removeAll();
            }
            $scope.flag = true;
            $scope.resetForm();
        }

        $scope.ResetModel = function() {
            $scope.model = {
                id: 0,
                idApp: parseInt(localStorage.getItem('appId')),
                Type: '',
                IsActive: true,
                OnIcon: '',
                OffIcon: '',
                PowerCuttIcon: '',
                ActiveIcon: '',
                LocateOnIcon: '',
                LocateOffIcon: '',
                LocateActiveIcon: '',
                LocatePowerCuttIcon: '',
                LocateIsRotate: true,
                IsIconDynamic: false
            }
            $scope.FlgOnIcon = '';
            $scope.FlgActiveIcon = '';
            $scope.FlgOffIcon = '';
            $scope.FlgPowerCuttIcon = '';
            $scope.FlgLocateOnIcon = '';
            $scope.FlgLocateActiveIcon = '';
            $scope.FlgLocateOffIcon = '';
            $scope.FlgLocatePowerCuttIcon = '';

            $scope.myCroppedOnIcon = '';
            $scope.myCroppedActiveIcon = '';
            $scope.myCroppedOffIcon = '';
            $scope.myCroppedPowerCuttIcon = '';
            $scope.myCroppedLocateOnIcon = '';
            $scope.myCroppedLocateActiveIcon = '';
            $scope.myCroppedLocateOffIcon = '';
            $scope.myCroppedLocatePowerCuttIcon = '';

            if ($scope.modelApp.AppName != 'Tracking') {
                $scope.apiOnIcon.removeAll();
                $scope.apiActiveIcon.removeAll();
                $scope.apiOffIcon.removeAll();
                $scope.apiPowerCuttIcon.removeAll();
                $scope.apiLocateOnIcon.removeAll();
                $scope.apiLocateActiveIcon.removeAll();
                $scope.apiLocateOffIcon.removeAll();
                $scope.apiLocatePowerCuttIcon.removeAll();
            }

            $scope.flag = false;
            $scope.resetForm();
        }

        // $scope.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0).notSortable(),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),
        //     DTColumnDefBuilder.newColumnDef(3),
        //     DTColumnDefBuilder.newColumnDef(4),
        //     DTColumnDefBuilder.newColumnDef(5).notSortable()
        // ];

        // $scope.dtInstance = {};
        // $scope.dtOptions = {
        //     dom: 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>',
        //     // dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        //     columnDefs: [],
        //     // initComplete: function() {
        //     //     var api = this.api(),
        //     //         searchBox = angular.element('body').find('#modelsearch');

        //     //     // Bind an external input as a table wide search box
        //     //     if (searchBox.length > 0) {
        //     //         searchBox.on('keyup', function(event) {
        //     //             api.search(event.target.value).draw();
        //     //         });
        //     //     }
        //     // },
        //     pagingType: 'full_numbers',
        //     lengthMenu: [25, 30, 50, 100],
        //     pageLength: 25,
        //     scrollY: 'auto',
        //     responsive: true
        // };
        // $scope.GetSerch = function(Search) {
        //     $scope.dtInstance.DataTable.search(Search);
        //     $scope.dtInstance.DataTable.search(Search).draw();
        // }
        $scope.GetAllVehicleType = function(IsUpdate) {
            var resetPaging = false;
            if (IsUpdate == true) {
                resetPaging = true;
            };
            $scope.dtInstance.reloadData(callback, resetPaging);
            $('#VehicleType').dataTable()._fnPageChange(0);
            $('#VehicleType').dataTable()._fnAjaxUpdate();
        }

        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.FilterStatus = 1;
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).renderWith(NumberHtml).notSortable().withOption('class', 'text-center'),
                DTColumnBuilder.newColumn('Type'),
                DTColumnBuilder.newColumn('CreatedDate').renderWith(dateFormat),
                DTColumnBuilder.newColumn('CreatedBy'),
                DTColumnBuilder.newColumn('tblappinfo.AppName').renderWith(AppNameHtml),
                DTColumnBuilder.newColumn(null).renderWith(IsActiveHtml).notSortable(),
                DTColumnBuilder.newColumn(null).notSortable().renderWith(actionsHtml),
            ]

            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                    url: $rootScope.RoutePath + "vehicletype/Getvehicletype",
                    data: function(d) {
                        if ($scope.modelSearch.Search == '') {
                            d.search = '';
                        } else {
                            d.search = $scope.modelSearch.Search;
                        }
                        return d;
                    },
                    type: "get",
                    dataSrc: function(json) {
                        if (json.success != false) {
                            $scope.lstVehicleType = json.data;
                            return json.data;
                        } else {
                            return [];
                        }
                    },
                })
                .withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('simple') // for get full pagination options // first / last / prev / next and page numbers
                .withDisplayLength(25) // Page size
                .withOption('aaSorting', [2, 'desc'])
                .withOption('responsive', true)
                .withOption('autoWidth', true)
                .withOption('createdRow', createdRow)
                .withOption('dom', 'rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
                .withOption('scrollY', 'auto');
        });
        $scope.dtInstance = {};

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

        function DrawDateFormatNumberHtml(data, type, full, meta) {
            var date = data.tbldrawdate.DrawDate;
            if (date != null) {
                return moment(date).format('DD-MM-YYYY')
            } else {
                return '';
            }
        }

        function AppNameHtml(data, type, full, meta) {
            if (data != null && data != undefined) {
                return data;
            } else {
                return 'Default';
            }
        }

        function dateFormat(date) {
            if (date != null) {
                return moment(date).format('DD-MM-YYYY hh:mm:ss a')
            } else {
                return '';
            }
        }

        function IsActiveHtml(data, type, full, meta) {
            var result = '';

            if (data.IsActive == 1) {
                result = '<md-button  style="font-size: 20px;color: green"  ng-click="UpdateStatus(' + data.id + ')"> &#x2714;<md-tooltip md-visible="" md-direction="">DeActive</md-tooltip></md-button>';
            }
            if (data.IsActive == 0) {
                result = '<md-button style="font-size: 20px;color: red"  ng-click="UpdateStatus(' + data.id + ')">&#x2716;<md-tooltip md-visible="" md-direction="">Active</md-tooltip></md-button>';
            }
            return result;
        }

        function actionsHtml(data, type, full, meta) {
            var btns = '<div layout="row">'

            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="editVehicleTypeId(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-pencil"  class="s18 green-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Edit</md-tooltip>' +
                    '</md-button>';
            }
            if ($rootScope.FlgModifiedAccess) {
                btns += '<md-button class="edit-button md-icon-button"  ng-click="DeleteVehicleType(' + data.id + ')" aria-label="">' +
                    '<md-icon md-font-icon="icon-trash"  class="s18 red-500-fg"></md-icon>' +
                    '<md-tooltip md-visible="" md-direction="">Delete</md-tooltip>' +
                    '</md-button>';
            }
            btns += '</div>'
            return btns;
        };
        $scope.GetSerch = function(Search) {
            $scope.modelSearch.Search = Search;
            $scope.GetAllVehicleType(true);
        };

        $scope.RemoveImage = function(o) {
            if (o == 'OnIcon') {
                $scope.myCroppedOnIcon = '';
                $scope.FlgOnIcon = 0;
                $scope.OnIcon = [];
                // $scope.model.image = '';
            } else if (o == 'ActiveIcon') {
                $scope.myCroppedActiveIcon = '';
                $scope.FlgActiveIcon = 0;
                $scope.ActiveIcon = [];
            } else if (o == 'OffIcon') {
                $scope.myCroppedOffIcon = '';
                $scope.FlgOffIcon = 0;
                $scope.OffIcon = [];
            } else if (o == 'PowerCuttIcon') {
                $scope.myCroppedPowerCuttIcon = '';
                $scope.FlgPowerCuttIcon = 0;
                $scope.PowerCuttIcon = [];
            } else if (o == 'LocateOnIcon') {
                $scope.myCroppedLocateOnIcon = '';
                $scope.FlgLocateOnIcon = 0;
                $scope.LocateOnIcon = [];
                // $scope.model.image = '';
            } else if (o == 'LocateActiveIcon') {
                $scope.myCroppedLocateActiveIcon = '';
                $scope.FlgLocateActiveIcon = 0;
                $scope.LocateActiveIcon = [];
            } else if (o == 'LocateOffIcon') {
                $scope.myCroppedLocateOffIcon = '';
                $scope.FlgLocateOffIcon = 0;
                $scope.LocateOffIcon = [];
            } else if (o == 'LocatePowerCuttIcon') {
                $scope.myCroppedLocatePowerCuttIcon = '';
                $scope.FlgLocatePowerCuttIcon = 0;
                $scope.LocatePowerCuttIcon = [];
            }
        }

        $scope.setOnIcon = function(element) {
            $scope.FlgOnIcon = 0;
            // $scope.myCroppedOnIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OnIcon;
        };
        $scope.setActiveIcon = function(element) {
            $scope.FlgActiveIcon = 0;
            // $scope.myCroppedActiveIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.ActiveIcon;
        };
        $scope.setOffIcon = function(element) {
            $scope.FlgOffIcon = 0;
            // $scope.myCroppedOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OffIcon;
        };
        $scope.setPowerCuttIcon = function(element) {
            $scope.FlgPowerCuttIcon = 0;
            // $scope.myCroppedOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OffIcon;
        };
        $scope.setLocateOnIcon = function(element) {
            $scope.FlgLocateOnIcon = 0;
            // $scope.myCroppedOnIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OnIcon;
        };
        $scope.setLocateActiveIcon = function(element) {
            $scope.FlgLocateActiveIcon = 0;
            // $scope.myCroppedActiveIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.ActiveIcon;
        };
        $scope.setLocateOffIcon = function(element) {
            $scope.FlgLocateOffIcon = 0;
            // $scope.myCroppedOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OffIcon;
        };
        $scope.setLocatePowerCuttIcon = function(element) {
            $scope.FlgLocatePowerCuttIcon = 0;
            // $scope.myCroppedOffIcon = $rootScope.RoutePath + 'MediaUploads/FileUpload/' + $scope.model.OffIcon;
        };

        $scope.init();
    }

})();