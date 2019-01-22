(function () {
    'use strict';

    angular
        .module('app.DistributorTrackers', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DistributorTrackers', {
                url: '/DistributorTrackers',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DistributorTrackers/DistributorTrackers.html',
                        controller: 'DistributorGpsDeviceController as vm'
                    }
                },
                bodyClass: 'Trackers',
                ModuleName: 'Distributor Trackers'
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