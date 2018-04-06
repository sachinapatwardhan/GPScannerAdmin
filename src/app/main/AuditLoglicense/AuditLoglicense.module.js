(function() {
    'use strict';

    angular
        .module('app.AuditLoglicense', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AuditLoglicense', {
                url: '/AuditLoglicense',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AuditLoglicense/AuditLoglicense.html',
                        controller: 'AuditLoglicenseController as vm'
                    }
                },
                bodyClass: 'Audit Log Liacense',
                ModuleName: 'Audit Log Liacense'
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