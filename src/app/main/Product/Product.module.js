(function() {
    'use strict';

    angular
        .module('app.product', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.product', {
                url: '/product',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Product/Product.html',
                        controller: 'ProductController as vm'
                    }
                },
                bodyClass: 'Product',
                ModuleName: 'Product'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/product');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.product', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Products.product', {
        //     title: 'Product',
        //     state: 'app.product',
        //     icon: 'icon-lock',
        //     weight: 3
        // });
    }
})();