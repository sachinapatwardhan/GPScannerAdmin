(function() {
    'use strict';

    angular
        .module('app.Customer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Customer', {
                url: '/Customer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/OwnerCustomer/OwnerCustomer.html',
                        controller: 'OwnerCustomerController as vm'
                    }
                },
                bodyClass: 'Customer',
                ModuleName: 'Customer'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Owner Customer', {
        //     title: 'Owner Customer',
        //     state: 'app.OwnerCustomer',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();