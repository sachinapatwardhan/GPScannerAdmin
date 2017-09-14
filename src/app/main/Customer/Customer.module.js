(function() {
    'use strict';

    angular
        .module('app.Customer1', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Customer1', {
                url: '/Customer1',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Customer/Customer.html',
                        controller: 'CustomerController as vm'
                    }
                },
                bodyClass: 'Customer1',
                ModuleName: 'Customer1'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Customer', {
            title: 'Customer',
            state: 'app.Customer',
            //icon: 'icon-lock',
            //weight: 1
        });
    }
})();