(function() {
    'use strict';

    angular
        .module('app.Trackers', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Trackers', {
                url: '/Trackers',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/GpsDevice/GpsDevice.html',
                        controller: 'GpsDeviceController as vm'
                    }
                },
                bodyClass: 'Trackers',
                ModuleName: 'Trackers'
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