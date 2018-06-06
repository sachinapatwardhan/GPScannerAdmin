(function() {
    'use strict';

    angular
        .module('app.Vehicle')
        .controller('ViewDetailCtrl', ViewDetailCtrl);

    /** @ngInject */
    function ViewDetailCtrl($http, $mdDialog, $scope, ModalMethod, $rootScope, $mdToast, idVehicle, objVehicle) {
        var vm = this;
        $scope.model = objVehicle;
        // vm.HideLoader = HideLoader;
        $scope.init = function() {
            // HideLoader();
        };
        // if (objVehicle.IsACC == 1) {
        //     $scope.model.IsACC = true;
        // } else {
        //     $scope.model.IsACC = false;
        // }
        $scope.Name = objVehicle.Name;
        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.reload = function() {
            $http.get($rootScope.RoutePath + "vehicles/GetAllVehicleById?id=" + idVehicle).then(function(data) {
                $scope.model = data.data;
                ModalMethod.ListUpdate(data.data);
            })
        }

        $scope.CreateVehicleDetails = function(o) {
            $http.post($rootScope.RoutePath + "vehicles/SaveVehicle", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $rootScope.FlgAddedEditlocal = false;
                    if ($rootScope.FlgAddedAccess == true) {
                        $rootScope.FlgAddedEditlocal = true;
                    }
                    $scope.closeModel();
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
        };

        $scope.SaveModule = function(objModel, name) {
            ShowLoader();
            if (name == 'MaxSpeed') {

                if (objModel >= 0 && objModel <= 200) {
                    var params = {
                        DeviceId: objVehicle.deviceid,
                        Speed: objModel
                    }
                    $http.get($rootScope.RoutePath + "socketapi/SendSpeedData", { params: params }).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();

                        }
                        HideLoader();
                    })
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Please Enter Speed between 0 to 200 km/h")
                        .position('top right')
                        .hideDelay(3000)
                    );
                    return;
                }
            } else if (name == 'SleepMode') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    SleepMode: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetSleepMode", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'GPRSInterval') {
                if (parseInt(objModel) % 10 == 0) {
                    var params = {
                        DeviceId: objVehicle.deviceid,
                        TimeInterval: objModel
                    }
                    $http.get($rootScope.RoutePath + "socketapi/SetGPRSInterval", { params: params }).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        }
                        HideLoader();
                    })
                } else {
                    return;
                }
            } else if (name == 'GPRSStopInterval') {
                if (parseInt(objModel) % 10 == 0) {
                    var params = {
                        DeviceId: objVehicle.deviceid,
                        TimeInterval: objModel
                    }
                    $http.get($rootScope.RoutePath + "socketapi/SetGPRSIntervalStopCar", { params: params }).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        }
                        HideLoader();
                    })
                } else {
                    return;
                }
            } else if (name == 'Arm') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    Arm: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetArmSettings", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'OdoMeter') {
                if (objModel <= 9999) {
                    var params = {
                        DeviceId: objVehicle.deviceid,
                        odometer: objModel
                    }
                    $http.get($rootScope.RoutePath + "socketapi/SetOdometerSetting", { params: params }).then(function(data) {
                        if (data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        }
                        HideLoader();
                    })
                } else {
                    return;
                }
            } else if (name == 'HeartbeatInterval') {
                if (objModel <= 65535) {
                    var params = {
                        DeviceId: objVehicle.deviceid,
                        TimeInterval: objModel
                    }
                    $http.get($rootScope.RoutePath + "socketapi/SetHeartBeatInterval", { params: params }).then(function(data) {
                        if (data.data.success == true) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(data.data.message)
                                .position('top right')
                                .hideDelay(3000)
                            );
                            $scope.reload();
                        }
                        HideLoader();
                    })
                } else {
                    return;
                }
            } else if (name == 'Relay') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    Relay: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetOutputControl", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'Siren') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    Siren: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetOutputControl", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'UserDefined') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    UserDefined: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetOutputControl", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'DoorLock') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    DoorLock: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetOutputControl", { params: params }).then(function(data) {
                    if (data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'DoorUnlock') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    DoorUnLock: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetOutputControl", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            } else if (name == 'TimeZone') {
                // console.log(objModel);
            } else if (name == 'ACC') {
                var params = {
                    DeviceId: objVehicle.deviceid,
                    ACC: objModel
                }
                $http.get($rootScope.RoutePath + "socketapi/SetACCSetting", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.reload();
                    }
                    HideLoader();
                })
            }
        }

        function ShowLoader() {
            document.getElementById('processing1').style.display = "block";
            document.body.scrollTop = "0px";
        }

        function HideLoader() {
            document.getElementById('processing1').style.display = "none";
        }
        $scope.init();
    }


})();