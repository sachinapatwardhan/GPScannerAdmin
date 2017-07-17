(function() {
    'use strict';

    angular
        .module('app.Country', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Country', {
                url: '/Country',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Country/Country.html',
                        controller: 'CountryController as vm'
                    }
                },
                bodyClass: 'Country',
                ModuleName: 'Country'
            });

        // Translation
       // $translatePartialLoaderProvider.addPart('app/main/Country');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.Country', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Settings.Country', {
            title: 'Country',
            state: 'app.Country',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
