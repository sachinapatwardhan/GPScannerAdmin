(function() {
    'use strict';

    angular
        .module('app.Logs', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Logs', {
                url: '/Logs',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Logs/Logs.html',
                        controller: 'LogsController as vm'
                    }
                },
                bodyClass: 'Logs',
                ModuleName: 'Logs'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();