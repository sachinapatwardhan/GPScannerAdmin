(function() {
    'use strict';

    angular
        .module('app.VehicleMonitor')
        .controller('VehicleMonitorController', VehicleMonitorController);

    /** @ngInject */
    function VehicleMonitorController($http, $scope, $rootScope, $state, $q, $timeout, $mdToast, $document, $mdDialog, $cookieStore, $stateParams, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile) {
        console.log("###############")

        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        $rootScope.UserRoles = $cookieStore.get('UserRoles');
        $rootScope.appId = localStorage.getItem('appId');
        $scope.init = function() {
            $scope.model = {
                MaxSpeed: null,
                SleepMode: '',
                GPRSInterval: '',
                GPRSStopInterval: '',
                Arm: '',
                OdoMeter: '',
                HeartbeatInterval: null,
                ACC: null,
                DeviceList: [],

            }
            $scope.getAllDeviceId();

        }
        $scope.getAllDeviceId = function() {
            var appid = '';
            if ($rootScope.UserRoles != 'Super Admin') {
                appid = $rootScope.appId;
            }
            var params = {
                idApp: appid,
            }
            $http.get($rootScope.RoutePath + "vehicles/GetAllVehicleDeviceId", { params: params }).then(function(data) {
                console.log(data)
                $scope.lstDevice = data.data
                $scope.deviceidlst = [];
                for (var i = 0; i < data.data.length > 0; i++) {
                    $scope.deviceidlst.push(data.data[i].deviceid)
                }
                // $scope.contacts = $scope.deviceidlst;
                $scope.self = [];
                $scope.self.allContacts = $scope.lstDevice;
                $scope.self.contacts = '';
                $scope.self.asyncContacts = [];
                $scope.self.filterSelected = true;
                $scope.self.querySearch = $scope.querySearch;
                $scope.self.delayedQuerySearch = $scope.delayedQuerySearch;
            })
        }

        $scope.querySearch = function(criteria) {
            cachedQuery = cachedQuery || criteria;
            return criteria ? $scope.self.allContacts.filter($scope.createFilterFor(cachedQuery)) : [];
        }

        $scope.createFilterFor = function(query) {
            return function filterFn(contact) {
                // console.log(contact.deviceid)
                contact = (contact.deviceid).toString();
                return (contact.indexOf(query) != -1);
            };
        }

        $scope.delayedQuerySearch = function(criteria) {
            cachedQuery = criteria;
            if (!pendingSearch || !debounceSearch()) {
                cancelSearch();
                return pendingSearch = $q(function(resolve, reject) {
                    // Simulate async search... (after debouncing)
                    cancelSearch = reject;
                    $timeout(function() {
                        resolve($scope.self.querySearch(criteria));
                        refreshDebounce();
                    }, Math.random() * 500, true)
                });
            }
            return pendingSearch;
        }

        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }
        /**
         * Debounce if querying faster than 300ms
         */
        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;
            return ((now - lastSearch) < 300);
        }

        function loadContacts() {
            var contacts = [];

            return contacts.map(function(c, index) {
                var contact = $scope.lstDevice;
                return contact;
            });
        }

        $scope.savesetting = function() {
            $scope.DeviceList = [];
            console.log($scope.self.asyncContacts);
            for (var i = 0; i < $scope.self.asyncContacts.length; i++) {
                $scope.DeviceList.push($scope.self.asyncContacts[i].deviceid);
            }
            $scope.model.DeviceList = $scope.DeviceList;
            console.log($scope.model);
            var params = {
                objDevice: $scope.model.DeviceList,
                MaxSpeed: $scope.model.MaxSpeed,
                SleepMode: $scope.model.SleepMode,
                TimeInterval: $scope.model.GPRSInterval,
                Arm: $scope.model.Arm,
                odometer: $scope.model.OdoMeter,
                HeartbeatInterval: $scope.model.HeartbeatInterval,
                GPRSStopInterval: $scope.model.GPRSStopInterval,
                ACC: $scope.model.ACC,
            }
            $http.get($rootScope.RoutePath + "socketapi/SendCommandToDevice", { params: params }).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.flag = false;
                    // $scope.init();
                    $scope.ResetModel();
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
        $scope.ResetModel = function() {
            $scope.model = {
                MaxSpeed: null,
                SleepMode: '',
                GPRSInterval: '',
                GPRSStopInterval: '',
                Arm: '',
                OdoMeter: '',
                HeartbeatInterval: null,
                ACC: null,
                DeviceList: [],

            }
            $scope.self.asyncContacts = [];
            $scope.resetForm();
            refreshDebounce();
        }
        $scope.resetForm = function() {
            $scope.formSetting.$setUntouched();
            $scope.formSetting.$setPristine();
        }
        $scope.init();
    }
})();