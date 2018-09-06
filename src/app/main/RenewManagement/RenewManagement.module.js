(function () {
    'use strict';

    angular
        .module('app.RenewManagement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.RenewManagement', {
                url: '/RenewManagement',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/RenewManagement/RenewManagement.html',
                        controller: 'RenewManagementController as vm'
                    }
                },
                bodyClass: 'Renew Management',
                ModuleName: 'Renew Management',
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