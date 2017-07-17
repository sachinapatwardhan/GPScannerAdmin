(function() {
    'use strict';

    angular
        .module('app.carrier')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.carrier', {
                url: '/carrier',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Carrier/Carrier.html',
                        controller: 'CarrierController as vm'
                    }
                },
                bodyClass: 'Carrier',
                ModuleName: 'Carrier'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Language');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.Vendor', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Pettorway.carrier', {
            title: 'Carrier',
            state: 'app.carrier',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
