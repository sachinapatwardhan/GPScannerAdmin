(function () {
    'use strict';

    angular
        .module('app.EnquiryMgmt')
        .controller('EnquiryLogController', EnquiryLogController);

    /** @ngInject */
    function EnquiryLogController($http, $mdDialog, $mdToast, $scope, $rootScope, $cookieStore, objEnquiryLog, Tasks, event) {
        var vm = this;

        $http.get($rootScope.RoutePath + "Enquiry/GetAllEnquiryLogByEnquiryId?idEnquiry=" + objEnquiryLog).then(function (data) {
            for (var i = 0; i < data.data.data.length; i++) {
                if (data.data.data[i].CreatedDate != null) {
                    data.data.data[i].CreatedDate = $rootScope.convertdateformat(data.data.data[i].CreatedDate);
                }
            }
            $scope.lstEnuiryLog = data.data.data;
        });

        $scope.closeModel = function () {
            $mdDialog.hide();
        }
    }
})();
