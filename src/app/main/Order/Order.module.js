(function() {
    'use strict';

    angular
        .module('app.order', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.order', {
                url: '/order',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Order/Order.html',
                        controller: 'OrderController as vm'
                    }
                },
                bodyClass: 'Orders',
                ModuleName: 'Orders'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Order');

        // Navigation
        // msNavigationServiceProvider.saveItem('Sales.order', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Sales.order', {
            title: 'Orders',
            state: 'app.order',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
