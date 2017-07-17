(function() {
    'use strict';

    angular
        .module('app.FacebookSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.FacebookSetting', {
                url: '/',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/FacebookSetting/FacebookSetting.html',
                        controller: 'FacebookSettingController as vm'
                    }
                },
                bodyClass: 'Facebook Page Setting',
                ModuleName: 'Facebook Page Setting'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/News');

        // Navigation
        // msNavigationServiceProvider.saveItem('CMS.News', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Settings.News', {
            title: 'Facebook Page Setting',
            state: 'app.FacebookSetting',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
