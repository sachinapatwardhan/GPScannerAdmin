(function() {
    'use strict';

    angular
        .module('app.AssignRetailer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AssignRetailer', {
                url: '/AssignRetailer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AssignRetailer/AssignRetailer.html',
                        controller: 'AssignRetailerController as vm'
                    }
                },
                bodyClass: 'Assign Retailer',
                ModuleName: 'Assign Retailer'
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