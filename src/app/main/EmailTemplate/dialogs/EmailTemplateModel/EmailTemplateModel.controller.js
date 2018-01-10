(function() {
    'use strict';

    angular
        .module('app.EmailTemplate')
        .controller('EmailTemplateModelController', EmailTemplateModelController);

    /** @ngInject */
    function EmailTemplateModelController($http, $mdDialog, $mdToast, $scope, $cookieStore, $rootScope, obj, Tasks, event, EmailTemplateVM) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                id: '',
                EmailTo: '',
                EmailSubject: '',
                EmailBody: '',
                CreatedBy: "Admin",
                CreatedDate: new Date(),
            }
        }
        $scope.init();
        if (obj != null && obj != undefined && obj.id != '') {
            $scope.model.id = obj.id;
            $scope.model.Type = obj.Type;
            $scope.model.EmailSubject = obj.EmailSubject;
            $scope.model.EmailBody = obj.EmailBody;
            $scope.model.EmailFrom = obj.EmailFrom;
        }
        $scope.SaveEmailTemplate = function(o) {
            $http.post($rootScope.RoutePath + "email/SaveEmailTemplate", o).then(function(data) {
                if (data.data.success == true) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    EmailTemplateVM.GetAllEmailTemplate();
                    $mdDialog.hide();
                } else {
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

        $scope.Reset = function() {
            $mdDialog.hide();
        }

        $scope.closeModel = function() {
            $mdDialog.hide();
        }
    }
})();