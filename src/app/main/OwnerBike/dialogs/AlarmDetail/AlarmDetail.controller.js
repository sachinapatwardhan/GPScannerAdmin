(function() {
    'use strict';

    angular
        .module('app.ownerbike')
        .controller('AlarmDetail1Controller', AlarmDetail1Controller);

    /** @ngInject */
    function AlarmDetail1Controller($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, objUser, Tasks, event) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                Id : '',
                Datetime: '',
                Latitude: '',
                Longtitude: '',
                GPSPositioning: '',
                Speed: '',
                Direction: '',
                Status: '',
                ReservedSign: '',
                ReservedSelection: '',
                DeviceId: '',
                AlarmCode: '',
            };

            $scope.deviceid = objUser.deviceid;
            console.log($scope.deviceid)
            $scope.GetAlarmByDeviceId($scope.deviceid);
        }

        $scope.GetAlarmByDeviceId = function(o) {
            var params = {
                deviceid: o
            }
            $http.get($rootScope.RoutePath + "petAlarm/GetAlarmByDeviceId", { params: params }).then(function(data) {
                $scope.lstAlarmdetail = data.data;
            });
        }

        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }

        $scope.init();
    }
})();
