(function() {
    'use strict';

    angular
        .module('app.SIM', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.SIM', {
                url: '/SIM',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/SIM/SIM.html',
                        controller: 'SIMController as vm'
                    }
                },
                bodyClass: 'SIM',
                ModuleName: 'SIM',
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