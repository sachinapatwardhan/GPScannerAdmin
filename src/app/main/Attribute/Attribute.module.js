(function() {
    'use strict';

    angular
        .module('app.attribute', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.attribute', {
                url: '/attribute',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Attribute/Attribute.html',
                        controller: 'AttributeController as vm'
                    }
                },
                bodyClass: 'Attribute',
                ModuleName: 'Attribute'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/ProductAttribute');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.ProductAttribute', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Products.attribute', {
        //     title: 'Attribute',
        //     state: 'app.attribute',
        //     icon: 'icon-lock',
        //     weight: 4
        // });
    }
})();