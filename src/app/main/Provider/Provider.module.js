(function() {
    'use strict';

    angular
        .module('app.Provider', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Provider', {
                url: '/Provider',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Provider/Provider.html',
                        controller: 'ProviderController'
                    }
                },
                bodyClass: 'Tax Provider',
                ModuleName: 'Tax Provider'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Provider');

        // msNavigationServiceProvider.saveItem('Settings.Provider', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.Tax Provider', {
        //     title: 'Tax Provider',
        //     state: 'app.Provider',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
