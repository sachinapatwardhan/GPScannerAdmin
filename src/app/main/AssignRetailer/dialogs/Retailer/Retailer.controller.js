(function() {
    'use strict';

    angular
        .module('app.AssignRetailer')
        .controller('RetailerController', RetailerController);

    /** @ngInject */
    function RetailerController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, idUser, Email, AgentAppId, Tasks, event) {
        var vm = this;
        $rootScope.UserId = $cookieStore.get('UserId');
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $scope.AgentIdApp = AgentAppId;
        $scope.Email = Email;
        $scope.init = function() {
            $scope.idUser = idUser;
            // $scope.GetAllRetailerByUser($scope.idUser);
            $scope.GetAllRetailer();
            // $scope.GetAllAssignRetailer();
        }

        // $scope.GetAllRetailerByUser = function(idUser) {
        //     var params = {
        //         iduser: idUser,
        //     }
        //     $http.get($rootScope.RoutePath + "assignretailer/GetAllRetailerByUser", { params: params }).then(function(data) {
        //         $scope.lstUserRetailer = data.data;
        //     });
        // }

        $scope.GetAllRetailer = function(idUser) {
            var params = {
                idApp: $scope.AgentIdApp,
                agentId: $scope.idUser
            }
            $http.get($rootScope.RoutePath + "assignretailer/GetAllRetailer", { params: params }).then(function(data) {
                // All user
                $scope.lstRetailer = data.data;
                $scope.GetAllAssignRetailer();

            });
        }

        $scope.GetAllAssignRetailer = function(idUser) {
            var params = {
                idApp: $rootScope.appId,
            }
            $http.get($rootScope.RoutePath + "assignretailer/GetAllAssignRetailer", { params: params }).then(function(data) {
                //Assign user
                $scope.lstAssignRetailer = data.data;
                $scope.findRetailerList();
            });
        }

        $scope.findRetailerList = function() {
            $scope.finalRetailerList = [];
            var obj = _.filter($scope.lstAssignRetailer, { agentId: $scope.idUser })
            _.filter($scope.lstRetailer, function(item) {
                _.filter(obj, function(o) {
                    if (o.retailerId == item.id) {
                        item.IsRetailer = true;
                        $scope.finalRetailerList.push(item);
                    }
                })
            })
            _.filter($scope.lstRetailer, function(item) {

                var obj = _.findWhere($scope.lstAssignRetailer, { retailerId: item.id });
                if (obj) {} else {
                    item.IsRetailer = false;
                    $scope.finalRetailerList.push(item);
                }
            })

        }


        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.AssignRetailer = function(o) {
            var obj = _.findWhere($scope.finalRetailerList, { id: o.id })
            var params = {
                agentId: $scope.idUser,
                retailerId: o.id,
                createdDatetime: '',
            }
            if (o.IsRetailer == true) {
                $http.get($rootScope.RoutePath + "assignretailer/SaveAssignRetailer", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );

                        $scope.init();
                        // $scope.ResetModel();
                        // getAllSIMInfo();
                        // vm.GetAllSIMDetail(true);

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
                $http.get($rootScope.RoutePath + "assignretailer/removeAssignRetailer", { params: params }).then(function(data) {
                    if (data.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        $scope.init();
                        // $scope.ResetModel();
                        // getAllSIMInfo();
                        // vm.GetAllSIMDetail(true);

                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(data.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }

                })
            }
        }

        $scope.init();
    }
})();