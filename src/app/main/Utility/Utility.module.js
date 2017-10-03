(function() {
    'use strict';

    angular
        .module('app.Utility', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Utility', {
                url: '/Utility',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Utility/Utility.html',
                        controller: 'UtilityController as vm'
                    }
                },
                bodyClass: 'Utility',
                ModuleName: 'Utility',
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