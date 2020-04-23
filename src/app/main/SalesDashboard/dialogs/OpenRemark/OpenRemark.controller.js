(function () {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('RemarkController', RemarkController);

    /** @ngInject */
    function RemarkController($http, $mdDialog, $cookieStore, $mdToast, $scope, $rootScope, obj, MainVM) {
        var vm = this;
        $rootScope.appId = localStorage.getItem('appId');
        $rootScope.Amount = $cookieStore.get('RenewAmount');
        var objDevice = obj;
        console.log(objDevice)

        $scope.init = function () {
            $scope.modelRemark = {
                Remark: '',
            }
            $scope.GetVehicleExpireDetailsByDeviceID();
        }
        $scope.GetVehicleExpireDetailsByDeviceID = function () {
            $scope.lstdeviceData = [];
            var params = {
                deviceid: obj.DeviceId
            }
            $http.get($rootScope.RoutePath + 'dashboard/GetVehicleExpireDetailsByDeviceID', { params: params }).success(function (response) {
                var data = response[0];
                if (data != null) {

                    if ($rootScope.Amount != null && $rootScope.Amount != undefined && $rootScope.Amount != '') {
                        data.RenewPrice = parseFloat($rootScope.Amount);
                    } else {
                        data.RenewPrice = 0;
                    }
                    if (data.GpsDate != null) {
                        var newdate = data.GpsDate * 1000;
                        data.LastGpsDate = moment(moment.utc(newdate).toDate()).format("DD-MM-YYYY hh:mm:ss A");
                    } else {
                        data.LastGpsDate = 'N/A';
                    }
                    if (data.renewaldate != null && data.renewaldate != '') {
                        var timeDiff = (new Date(data.renewaldate)).getTime() - (new Date()).getTime();
                        var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                        if (diffDays < 0) {
                            diffDays = 0;
                        }
                        data.Expiring = diffDays + ' days';
                        data.ExpireDays = diffDays;
                        data.ExpireDate = moment(data.renewaldate).format('DD-MM-YYYY');
                    } else {
                        data.Expiring = 'N/A';
                        data.ExpireDate = 'N/A';
                        data.ExpireDays = 0;
                    }
                    if (data.LicenceRenewalType != null && data.LicenceRenewalType != '') {
                        var nextRenewalDate = new Date(data.renewaldate);
                        var oldexpdate = data.renewaldate;
                        var AddMonth = 0;
                        if (data.LicenceRenewalType == 'Monthly') {
                            data.UOM = '1M';
                            AddMonth = 1;
                        } else if (data.LicenceRenewalType == 'Quarterly') {
                            data.UOM = '3M';
                            AddMonth = 3;
                        } else {
                            data.UOM = '12M';
                            AddMonth = 12;
                        }
                        nextRenewalDate = nextRenewalDate.setMonth(nextRenewalDate.getMonth() + AddMonth);
                        data.NextExpireDate = moment(nextRenewalDate).format('DD-MM-YYYY');

                        var timeDiff = (new Date(oldexpdate)).getTime() - (new Date()).getTime();
                        var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                        var days = diffDays;
                        if (days < 0) {
                            var date = new Date();
                            nextRenewalDate = date.setMonth(date.getMonth() + AddMonth);
                            data.NextExpireDate = moment(nextRenewalDate).format('DD-MM-YYYY');
                        }
                    } else {
                        data.UOM = 'N/A';
                    }
                }
                $scope.lstdeviceData.push(data);
            })
        }
        $scope.RenewMultipleDevice = function (o) {

            var objorder = {
                idUser: $cookieStore.get('UserId'),
                idApp: $rootScope.appId,
                lstProduct: $scope.lstdeviceData,
                Remark: $scope.modelRemark.Remark,
                OrderTotal: 0
            }
            $http.post($rootScope.RoutePath + 'billing/SaveOrderServiceRenew', objorder).success(function (data) {
                if (data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );

                    MainVM.resetTable();
                    $scope.closeModel();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.message)
                            .position('top right')
                            .hideDelay(3000)
                    );

                }

            });
        }
        $scope.closeModel = function () {
            $mdDialog.hide();
        }
        $scope.init();
    }
})();