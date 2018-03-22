(function() {
    'use strict';

    angular
        .module('app.deviceaccvalue', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.deviceaccvalue', {
                url: '/DeviceAcc',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DeviceAcc/DeviceAcc.html',
                        controller: 'DeviceAccValueController as vm'
                    }
                },
                bodyClass: 'Device Acc',
                ModuleName: 'Device Acc'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();