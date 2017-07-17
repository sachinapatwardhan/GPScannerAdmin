(function() {
    'use strict';

    angular
        .module('app.State', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.State', {
                url: '/State',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/State/State.html',
                        controller: 'StateController as vm'
                    }
                },
                bodyClass: 'State',
                ModuleName: 'State'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/State');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.State', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Settings.State', {
            title: 'State',
            state: 'app.State',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
