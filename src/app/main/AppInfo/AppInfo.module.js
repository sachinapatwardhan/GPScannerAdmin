(function() {
    'use strict';

    angular
        .module('app.appinfo', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.appinfo', {
                url: '/appinfo',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AppInfo/AppInfo.html',
                        controller: 'AppInfoController as vm'
                    }
                },
                bodyClass: 'App Info',
                ModuleName: 'App Info',
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