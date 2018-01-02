(function() {
    'use strict';

    angular
        .module('app.ManageCustomer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ManageCustomer', {
                url: '/ManageCustomer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/ManageCustomer/ManageCustomer.html',
                        controller: 'ManageCustomerController as vm'
                    }
                },
                bodyClass: 'Manage Customer',
                ModuleName: 'Manage Customer'
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