(function() {
    'use strict';

    angular
        .module('app.VehicleType', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.VehicleType', {
                url: '/VehicleType',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/VehicleType/VehicleType.html',
                        controller: 'VehicleTypeController as vm'
                    }
                },
                bodyClass: 'Vehicle Type',
                ModuleName: 'Vehicle Type',
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