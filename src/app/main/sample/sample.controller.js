(function() {
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData, $http, $scope, $rootScope, $cookieStore, $state) {
        var vm = this;
        // $scope.Dhaval = function() {
        //      console.log("Test1");
        //     // Data
        //     $http.get("http://localhost:3030/customer/customer").then(function(data) {
        //          console.log("Test");
        //         console.log(data);
        //     });
        // }

        //$scope.Dhaval();
        vm.helloText = SampleData.data.helloText;
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
        $state.go('app.login');
        // Methods

        //////////
    }
})();
