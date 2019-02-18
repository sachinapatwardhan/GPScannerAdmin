(function () {
    'use strict';

    angular
        .module('app.DistributorRenew', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DistributorRenew', {
                url: '/DistributorRenew',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistributorRenew/DistributorRenew.html',
                        controller: 'DistributorRenewController as vm'
                    }
                },
                bodyClass: 'Distributor Renew',
                ModuleName: 'Distributor Renew',
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Master.Banks', {
        //     title: 'Banks',
        //     state: 'app.Banks',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();