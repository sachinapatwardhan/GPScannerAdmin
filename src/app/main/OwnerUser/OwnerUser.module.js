(function() {
    'use strict';

    angular
        .module('app.user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.user', {
                url: '/user',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/OwnerUser/OwnerUser.html',
                        controller: 'OwnerUserController as vm'
                    }
                },
                bodyClass: 'Users',
                ModuleName: 'Users'
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