(function() {
    'use strict';

    angular
        .module('app.SalesDashboard', ['nvd3'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.SalesDashboard', {
                url: '/SalesDashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/SalesDashboard/SalesDashboard.html',
                        controller: 'SalesDashboardController'
                    }
                },
                bodyClass: 'Sales Dashboard',
                ModuleName: 'Sales Dashboard'
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