(function() {
    'use strict';

    angular
        .module('app.MediaSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.MediaSetting', {
                url: '/MediaSetting',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/MediaSetting/MediaSetting.html',
                        controller: 'MediaSettingController as vm'
                    }
                },
                bodyClass: 'Media Setting',
                ModuleName: 'Media Setting'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/MediaSetting');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.MediaSetting', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.MediaSetting', {
        //     title: 'Media Setting',
        //     state: 'app.MediaSetting',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
