(function() {
    'use strict';

    angular
        .module('app.GPSDeleteData', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.GPSDeleteData', {
                url: '/GPSDeleteData',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/GPSDeleteData/GPSDeleteData.html',
                        controller: 'GPSDeleteDataController as vm'
                    }
                },
                bodyClass: 'GPS Delete Data',
                ModuleName: 'GPS Delete Data'
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