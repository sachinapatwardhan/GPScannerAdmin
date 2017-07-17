(function() {
    'use strict';

    angular
        .module('app.OwnerCustomer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.OwnerCustomer', {
                url: '/OwnerCustomer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/OwnerCustomer/OwnerCustomer.html',
                        controller: 'OwnerCustomerController as vm'
                    }
                },
                bodyClass: 'Owner Customer',
                ModuleName: 'Owner Customer'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Gpsina.Owner Customer', {
        //     title: 'Owner Customer',
        //     state: 'app.OwnerCustomer',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();