(function () {
    'use strict';

    angular
        .module('app.DistributorCustomer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DistributorCustomer', {
                url: '/DistributorCustomer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistributorCustomer/DistributorCustomer.html',
                        controller: 'DistributorCustomerController as vm'
                    }
                },
                bodyClass: 'Customer',
                ModuleName: 'Distributor Customer'
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