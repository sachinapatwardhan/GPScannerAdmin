(function() {
    'use strict';

    angular
        .module('app.ChangePassword', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ChangePassword', {
                url: '/ChangePassword',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/ChangePassword/ChangePassword.html',
                        controller: 'ChangePasswordController'
                    }
                },
                bodyClass: 'Change Password',
                ModuleName: 'Change Password'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/ChangePassword');

        // msNavigationServiceProvider.saveItem('Settings.Setting', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Users.ChangePassword', {
        //     title: 'Change Password',
        //     state: 'app.ChangePassword',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();