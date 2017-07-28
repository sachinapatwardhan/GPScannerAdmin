(function() {
    'use strict';

    angular
        .module('app.telco', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.telco', {
                url: '/telco',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/TelCo/TelCo.html',
                        controller: 'telcoController as vm'
                    }
                },
                bodyClass: 'Telephone Company',
                ModuleName: 'Telephone Company'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/roles');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.roles', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.roles', {
        //     title: 'Roles',
        //     state: 'app.roles',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();