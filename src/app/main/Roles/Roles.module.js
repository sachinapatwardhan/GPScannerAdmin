(function() {
    'use strict';

    angular
        .module('app.roles', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.roles', {
                url: '/roles',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Roles/Roles.html',
                        controller: 'RolesController as vm'
                    }
                },
                bodyClass: 'Roles',
                ModuleName: 'Roles'
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