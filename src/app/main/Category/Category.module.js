(function() {
    'use strict';

    angular
        .module('app.category', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.category', {
                url: '/category',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Category/Category.html',
                        controller: 'CategoryController as vm'
                    }
                },
                bodyClass: 'Category',
                ModuleName: 'Category'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/category');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.category', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Products.category', {
            title: 'Category',
            state: 'app.category',
            icon: 'icon-lock',
            weight: 5
        });
    }
})();
