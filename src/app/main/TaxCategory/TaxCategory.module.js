(function() {
    'use strict';

    angular
        .module('app.TaxCategory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.TaxCategory', {
                url: '/TaxCategory',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/TaxCategory/TaxCategory.html',
                        controller: 'TaxCategoryController as vm'
                    }
                },
                bodyClass: 'Tax Category',
                ModuleName: 'Tax Category'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/TaxCategory');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.TaxCategory', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Settings.TaxCategory', {
            title: 'Tax Category',
            state: 'app.TaxCategory',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
