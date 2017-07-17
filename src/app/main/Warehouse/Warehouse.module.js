(function() {
    'use strict';

    angular
        .module('app.Warehouse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Warehouse', {
                url: '/Warehouse',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Warehouse/Warehouse.html',
                        controller: 'WarehouseController as vm'
                    }
                },
                bodyClass: 'Warehouses',
                ModuleName: 'Warehouses'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Warehouse');

        // Navigation
        // msNavigationServiceProvider.saveItem('Logistic.Warehouse', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Logistic.Warehouse', {
        //     title: 'Warehouses',
        //     state: 'app.Warehouse',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
