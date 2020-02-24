(function () {
    'use strict';

    angular
        .module('app.WarrantyDevice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.WarrantyDevice', {
                url: '/WarrantyDevice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/WarrantyDevice/WarrantyDevice.html',
                        controller: 'WarrantyDeviceController as vm'
                    }
                },
                bodyClass: 'Warranty Device',
                ModuleName: 'Warranty Device'
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