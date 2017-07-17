(function() {
    'use strict';

    angular
        .module('app.Setting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Setting', {
                url: '/Setting',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Setting/Setting.html',
                        controller: 'SettingController'
                    }
                },
                bodyClass: 'Setting',
                ModuleName: 'Setting'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Setting');

        // msNavigationServiceProvider.saveItem('Settings.Setting', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.Setting', {
        //     title: 'Setting',
        //     state: 'app.Setting',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();