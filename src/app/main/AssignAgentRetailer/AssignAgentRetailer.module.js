(function() {
    'use strict';

    angular
        .module('app.AssignAgentRetailer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AssignAgentRetailer', {
                url: '/AssignAgentRetailer',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AssignAgentRetailer/AssignAgentRetailer.html',
                        controller: 'AssignAgentRetailerController as vm'
                    }
                },
                bodyClass: 'Assign Agent Retailer',
                ModuleName: 'Assign Agent Retailer'
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