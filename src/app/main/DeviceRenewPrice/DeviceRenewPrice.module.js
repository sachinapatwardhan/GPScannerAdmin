(function() {
    'use strict';

    angular
        .module('app.DeviceRenewPrice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DeviceRenewPrice', {
                url: '/DeviceRenewPrice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DeviceRenewPrice/DeviceRenewPrice.html',
                        controller: 'DeviceRenewPriceController as vm'
                    }
                },
                bodyClass: 'Device Renew Price',
                ModuleName: 'Device Renew Price',
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Master.Banks', {
        //     title: 'Banks',
        //     state: 'app.Banks',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();