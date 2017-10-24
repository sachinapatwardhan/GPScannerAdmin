(function() {
    'use strict';

    angular
        .module('app.MainSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.MainSetting', {
                url: '/mainsetting',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/MainSetting/MainSetting.html',
                        controller: 'MainSettingController as vm'
                    }
                },
                bodyClass: 'Setting',
                ModuleName: 'Setting',
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.Setting', {
        //     title: 'Setting',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.Setting', {
        //     title: 'Setting',
        //     state: 'app.MainSetting',
        //     weight: 1
        // });
    }
})();