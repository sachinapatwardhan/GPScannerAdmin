(function() {
    'use strict';

    angular
        .module('app.Utility')
        .controller('DefaultValueCtrl', DefaultValueCtrl);

    /** @ngInject */
    function DefaultValueCtrl($http, $mdDialog, $scope, $rootScope, $mdToast) {
        var vm = this;
        // vm.HideLoader = HideLoader;
        $scope.init = function() {
            // HideLoader();
            $scope.getAllDefaultValue();
            $scope.model = {
                MaxSpeed: null,
                SleepMode: null,
                GPRSInterval: null,
                GPRSStopInterval: null,
                Arm: null,
                OdoMeter: null,
                HeartbeatInterval: null,
            }
        };

        $scope.getAllDefaultValue = function() {
            $http.get($rootScope.RoutePath + "vehicles/getAllDefaultValue").then(function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].Type == 'MaxSpeed') {
                        $scope.model.MaxSpeed = data.data[i].Value
                    }
                    if (data.data[i].Type == 'SleepMode') {
                        $scope.model.SleepMode = data.data[i].Value
                    }
                    if (data.data[i].Type == 'GPRSInterval') {
                        $scope.model.GPRSInterval = data.data[i].Value
                    }
                    if (data.data[i].Type == 'GPRSStopInterval') {
                        $scope.model.GPRSStopInterval = data.data[i].Value
                    }
                    if (data.data[i].Type == 'Arm') {
                        $scope.model.Arm = data.data[i].Value
                    }
                    if (data.data[i].Type == 'OdoMeter') {
                        $scope.model.OdoMeter = data.data[i].Value
                    }
                    if (data.data[i].Type == 'HeartbeatInterval') {
                        $scope.model.HeartbeatInterval = data.data[i].Value
                    }

                }
            })
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.SaveModule = function(objModel, name) {
            ShowLoader();
            var params = {
                Type: name,
                Value: objModel
            }
            $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
                    console.log(data);
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(name + data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(name + data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.getAllDefaultValue();

                    }
                    HideLoader();
                })
                // if (name == 'MaxSpeed') {

            //     if (objModel >= 0 && objModel <= 200) {
            //         var params = {
            //             Type: name,
            //             Value: objModel
            //         }
            //         $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //             console.log(data);
            //             if (data.data.success == true) {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //             } else {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //                 $scope.getAllDefaultValue();

            //             }
            //             HideLoader();
            //         })
            //     } else {
            //         $mdToast.show(
            //             $mdToast.simple()
            //             .textContent("Please Enter Speed between 0 to 200 km/h")
            //             .position('top right')
            //             .hideDelay(3000)
            //         );
            //         return;
            //     }
            // } else if (name == 'SleepMode') {
            //     var params = {
            //         Type: name,
            //         Value: objModel
            //     }
            //     $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //         if (data.data.success == true) {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //         } else {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //             $scope.getAllDefaultValue();
            //         }
            //         HideLoader();
            //     })
            // } else if (name == 'GPRSInterval') {
            //     if (parseInt(objModel) % 10 == 0) {
            //         var params = {
            //             Type: name,
            //             Value: objModel
            //         }
            //         $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //             if (data.data.success == true) {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //             } else {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //                 $scope.getAllDefaultValue();
            //             }
            //             HideLoader();
            //         })
            //     } else {
            //         return;
            //     }
            // } else if (name == 'GPRSStopInterval') {
            //     // if (parseInt(objModel) % 10 == 0) {
            //         var params = {
            //             Type: name,
            //             Value: objModel
            //         }
            //         $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //             if (data.data.success == true) {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //             } else {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //                 $scope.getAllDefaultValue();
            //             }
            //             HideLoader();
            //         })
            //     // } else {
            //         // return;
            //     // }
            // } else if (name == 'Arm') {
            //     var params = {
            //         Type: name,
            //         Value: objModel
            //     }
            //     $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //         if (data.data.success == true) {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //         } else {
            //             $mdToast.show(
            //                 $mdToast.simple()
            //                 .textContent(data.data.message)
            //                 .position('top right')
            //                 .hideDelay(3000)
            //             );
            //             $scope.reload();
            //         }
            //         HideLoader();
            //     })
            // } else if (name == 'OdoMeter') {
            //     if (objModel <= 9999) {
            //         var params = {
            //             Type: name,
            //             Value: objModel
            //         }
            //         $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {
            //             if (data.success == true) {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //             } else {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //                 $scope.getAllDefaultValue();
            //             }
            //             HideLoader();
            //         })
            //     } else {
            //         return;
            //     }
            // } else if (name == 'HeartbeatInterval') {
            //     if (objModel <= 65535) {
            //         var params = {
            //             Type: name,
            //             Value: objModel
            //         }
            //         $http.get($rootScope.RoutePath + "vehicles/UpdateDefultValue", { params: params }).then(function(data) {

            //             if (data.data.success == true) {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //             } else {
            //                 $mdToast.show(
            //                     $mdToast.simple()
            //                     .textContent(data.data.message)
            //                     .position('top right')
            //                     .hideDelay(3000)
            //                 );
            //                 $scope.getAllDefaultValue();
            //             }
            //             HideLoader();
            //         })
            //     } else {
            //         return;
            //     }
            // }
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