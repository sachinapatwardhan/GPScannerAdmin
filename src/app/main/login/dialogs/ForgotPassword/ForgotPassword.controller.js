(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController($http, $mdDialog, $mdToast, $scope, $rootScope, $cookieStore, Tasks, event, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        $scope.init = function() {
            $scope.model = {
                Email: '',
            };

        }

        //Forgot Password
        $scope.SubmitForgotPassword = 0;
        $scope.ForgotPassword = function(o) {
                // console.log(o);
                // if (form.$valid) {
                var params = {
                        Email: o.Email,
                    }
                    //     $http.get(route.Lookup.ForgotPassword, { params: params }).success(function(data) {
                    //         if (data.success == 1) {
                    //             toastr.success(data.message);
                    //               $scope.SubmitForgotPassword = 0;
                    //             $scope.Reset();
                    //         } else {
                    //             toastr.error(data.message);
                    //         }
                    //     });
                    // } else {
                    //     $scope.SubmitForgotPassword = 1;
                    // }
            }
            //End Forgot Password
            // if (objCountry == 0) {
            //     $scope.tab = { selectedIndex: 1 };
            // }
            // else {
            // }

        $scope.init();
    }
})();