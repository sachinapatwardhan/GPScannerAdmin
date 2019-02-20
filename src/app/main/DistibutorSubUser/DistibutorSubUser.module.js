(function() {
    'use strict';

    angular
        .module('app.distributorsubuser', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.distributorsubuser', {
                url: '/distributorsubuser',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistibutorSubUser/DistibutorSubUser.html',
                        controller: 'DistributorSubUserController as vm'
                    }
                },
                bodyClass: 'Distributor Sub User',
                ModuleName: 'Distributor Sub User'
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