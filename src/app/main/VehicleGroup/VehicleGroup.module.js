(function() {
    'use strict';

    angular
        .module('app.VehicleGroup', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.VehicleGroup', {
                url: '/VehicleGroup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/VehicleGroup/VehicleGroup.html',
                        controller: 'VehiclesGroupController as vm'
                    }
                },
                bodyClass: 'Vehicle Group',
                ModuleName: 'Vehicle Group'
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