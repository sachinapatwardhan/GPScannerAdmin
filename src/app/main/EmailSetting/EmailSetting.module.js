(function() {
    'use strict';

    angular
        .module('app.EmailSetting', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.EmailSetting', {
                url: '/EmailSetting',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/EmailSetting/EmailSetting.html',
                        controller: 'EmailSettingController as vm'
                    }
                },
                bodyClass: 'Email Setting',
                ModuleName: 'Email Setting'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/EmailSetting');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.EmailSetting', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.EmailSetting', {
        //     title: 'Email Setting',
        //     state: 'app.EmailSetting',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();