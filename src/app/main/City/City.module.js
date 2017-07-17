(function() {
    'use strict';

    angular
        .module('app.City', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.City', {
                url: '/City',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/City/City.html',
                        controller: 'CityController as vm'
                    }
                },
                bodyClass: 'Country-State-City',
                ModuleName: 'Country-State-City'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/City');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.City', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.Country-State-City', {
        //     title: 'Country-State-City',
        //     state: 'app.City',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();