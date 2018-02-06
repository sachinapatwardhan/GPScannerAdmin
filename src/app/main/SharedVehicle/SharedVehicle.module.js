(function() {
    'use strict';

    angular
        .module('app.SharedVehicle', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.SharedVehicle', {
                url: '/SharedVehicle',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/SharedVehicle/SharedVehicle.html',
                        controller: 'SharedVehicleController as vm'
                    }
                },
                bodyClass: 'Shared Vehicle',
                ModuleName: 'Shared Vehicle'
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