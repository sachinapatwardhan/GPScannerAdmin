(function() {
    'use strict';

    angular
        .module('app.Dashboard', ['nvd3'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Dashboard', {
                url: '/Dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Dashboard/Dashboard.html',
                        controller: 'DashboardController'
                    }
                },
                bodyClass: 'Dashboard',
                ModuleName: 'Dashboard'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Dashboard');

        // msNavigationServiceProvider.saveItem('Dashboard', {
        //     title: 'Authentication',
        //     icon: 'icon-television',
        //     weight: 1
        // });


        // msNavigationServiceProvider.saveItem('Dashboard', {
        //     title: 'Dashboard',
        //     state: 'app.Dashboard',
        //     // icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();