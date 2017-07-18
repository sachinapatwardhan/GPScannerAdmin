(function() {
    'use strict';

    angular
        .module('app.ownerVehicle', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ownerVehicle', {
                url: '/Vehicle',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Vehicles/Vehicles.html',
                        controller: 'VehiclesController as vm'
                    }
                },
                bodyClass: 'Owner Vehicle',
                ModuleName: 'Owner Vehicle'
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