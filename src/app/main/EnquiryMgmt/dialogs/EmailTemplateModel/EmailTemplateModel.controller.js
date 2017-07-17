(function () {
    'use strict';

    angular
        .module('app.EnquiryMgmt')
        .controller('EnquiryEmailTemplateModelController', EnquiryEmailTemplateModelController);

    /** @ngInject */
    function EnquiryEmailTemplateModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, objEmail, Tasks, event, EmailUpdateVm) {
        var vm = this;

        $scope.model = {
            id: '',
            EmailTo: '',
            EmailSubject: '',
            EmailBody: '',
            CreatedBy: "Admin",
            CreatedDate: new Date(),
            Status: '',
        }

        $scope.model.id = objEmail.id;
        $scope.model.EmailTo = objEmail.EmailId;
        $scope.model.Status = objEmail.Status;
        $scope.ReplyEnquiryEmail = function (o) {

            $http.post($rootScope.RoutePath + "Enquiry/ReplyEnquiryEmail", o).then(function (data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                );
                    $mdDialog.hide();
                    EmailUpdateVm.GetAllEnquiry('',true);
                }
                else {
                    if (data.data.data == 'TOKEN') {
                        //$cookieStore.remove('UserName');
                        //$cookieStore.remove('token');
                        //window.location.href = '/app/login';
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
        }

        $scope.Reset = function () {
            $mdDialog.hide();
        }

        $scope.closeModel = function () {
            $mdDialog.hide();
        }
    }
})();
