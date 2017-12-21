(function() {
    'use strict';

    angular
        .module('app.orderservice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.orderservice', {
                url: '/orderservice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/OrderService/OrderService.html',
                        controller: 'OrderServiceController as vm'
                    }
                },
                bodyClass: 'Order Service',
                ModuleName: 'Order Service'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/EmailTemplate');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.EmailTemplate', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('CMS.EmailTemplate', {
        //     title: 'Email Template',
        //     state: 'app.EmailTemplate',

        //     weight: 1
        // });
    }
})();