(function () {
    'use strict';

    angular
        .module('app.distributor', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.distributor', {
                url: '/distributor',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistributorUser/Distributor.html',
                        controller: 'DistributorController as vm'
                    }
                },
                bodyClass: 'Distributor',
                ModuleName: 'Distributor'
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.owneruser', {
        //     title: 'Owner Users',
        //     state: 'app.owneruser',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();