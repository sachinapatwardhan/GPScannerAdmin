(function() {
    'use strict';

    angular
        .module('app.ModuleMgmt', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ModuleMgmt', {
                url: '/ModuleMgmt',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/ModuleMgmt/ModuleMgmt.html',
                        controller: 'ModuleMgmtController as vm'
                    }
                },
                bodyClass: 'Module Management',
                ModuleName: 'Module Management',
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