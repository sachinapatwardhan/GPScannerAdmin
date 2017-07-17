(function() {
    'use strict';

    angular
        .module('app.Feedback')
        .controller('FeedbackEmailTemplateModelController', FeedbackEmailTemplateModelController);

    /** @ngInject */
    function FeedbackEmailTemplateModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, objEmail, Tasks, event) {
        var vm = this;

        $scope.model = {
            id: '',
            EmailTo: '',
            EmailSubject: '',
            EmailBody: '',
            CreatedBy: "Admin",
            CreatedDate: new Date(),
        }
        console.log(objEmail);
        $scope.model.id = objEmail.id;
        $scope.model.EmailTo = objEmail.Email;

        $scope.ReplyEnquiryEmail = function(o) {
            $http.post($rootScope.RoutePath + "email/SendEmail", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $mdDialog.hide();
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            });
        }

        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();
