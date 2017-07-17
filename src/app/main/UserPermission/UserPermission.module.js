(function() {
    'use strict';

    angular
        .module('app.UserPermission', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.UserPermission', {
                url: '/UserPermission',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/UserPermission/UserPermission.html',
                        controller: 'UserPermissionController'
                    }
                },
                bodyClass: 'User Permission',
                ModuleName: 'User Permission'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/UserPermission');

        // msNavigationServiceProvider.saveItem('Users.UserPermission', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.UserPermission', {
        //     title: 'User Permission',
        //     state: 'app.UserPermission',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();