(function() {
    'use strict';

    angular
        .module('app.AuditLog', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AuditLog', {
                url: '/AuditLog',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AuditLog/AuditLog.html',
                        controller: 'AuditLogController as vm'
                    }
                },
                bodyClass: 'Audit Log',
                ModuleName: 'Audit Log'
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