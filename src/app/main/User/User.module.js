(function() {
    'use strict';

    angular
        .module('app.user1', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.user1', {
                url: '/user',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/User/User.html',
                        controller: 'UserController as vm'
                    }
                },
                bodyClass: 'Shopper Users',
                ModuleName: 'Shopper Users'
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Shopper Users',
        //     state: 'app.user',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();