(function() {
    'use strict';

    angular
        .module('app.SendEmail', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.SendEmail', {
                url: '/SendEmail',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/SendEmail/SendEmail.html',
                        controller: 'SendEmailController as vm'
                    }
                },
                bodyClass: 'Email Setting',
                ModuleName: 'Email Setting'
            });

        // Translation
       // $translatePartialLoaderProvider.addPart('app/main/SendEmail');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.EmailSetting', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.SendEmail', {
        //     title: 'Send Email',
        //     state: 'app.SendEmail',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
