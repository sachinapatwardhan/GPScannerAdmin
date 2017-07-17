(function() {
    'use strict';

    angular
        .module('app.discount', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.discount', {
                url: '/discount',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Discount/Discount.html',
                        controller: 'DiscountController as vm'
                    }
                },
                bodyClass: 'Discount',
                ModuleName: 'Discount'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/discount');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.discount', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Settings.discount', {
            title: 'Discount',
            state: 'app.discount',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
