(function () {
    'use strict';

    angular
        .module('app.DistributorVehicle', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DistributorVehicle', {
                url: '/DistributorVehicle',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistributorVehicles/DistributorVehicles.html',
                        controller: 'DistributorVehiclesController as vm'
                    }
                },
                bodyClass: 'Vehicle',
                ModuleName: 'Distributor Vehicle'
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