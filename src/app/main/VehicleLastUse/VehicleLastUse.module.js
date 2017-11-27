(function() {
    'use strict';

    angular
        .module('app.VehicleLastUse', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.VehicleLastUse', {
                url: '/VehicleLastUse',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/VehicleLastUse/VehicleLastUse.html',
                        controller: 'VehicleLastUseController as vm'
                    }
                },
                bodyClass: 'Vehicle Last Use',
                ModuleName: 'Vehicle Last Use'
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