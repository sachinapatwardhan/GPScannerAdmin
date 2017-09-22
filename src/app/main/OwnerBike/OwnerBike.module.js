(function() {
    'use strict';

    angular
        .module('app.ownerbike', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ownerbike', {
                url: '/ownerbike',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/OwnerBike/OwnerBike.html',
                        controller: 'OwnerBikeController as vm'
                    }
                },
                bodyClass: 'Owner Vehicle',
                ModuleName: 'Owner Vehicle'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/pet');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('ownerbike', {
        //     title: 'Owner Vehicle',
        //     state: 'app.ownerbike',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();