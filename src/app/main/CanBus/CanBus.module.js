(function() {
    'use strict';

    angular
        .module('app.CanBusData', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.CanBusData', {
                url: '/CanBusData',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/CanBus/CanBus.html',
                        controller: 'CanBusDataController as vm'
                    }
                },
                bodyClass: 'CanBus Data',
                ModuleName: 'CanBus Data'
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