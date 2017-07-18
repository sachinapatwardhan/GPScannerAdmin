(function() {
    'use strict';

    angular
        .module('app.gps', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.gps', {
                url: '/Gps',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Gps/Gps.html',
                        controller: 'GpsController as vm'
                    }
                },
                bodyClass: 'Gps',
                ModuleName: 'Gps'
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
