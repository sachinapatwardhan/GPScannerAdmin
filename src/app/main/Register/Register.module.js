(function() {
    'use strict';

    angular
        .module('app.Register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.Register', {
            url: '/app/Register',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.Register': {
                    templateUrl: 'app/main/Register/Register.html',
                    controller: 'RegisterController as vm'
                }
            },
            bodyClass: 'Register',
            ModuleName: 'Register'
        });

        // Translation
        ///$translatePartialLoaderProvider.addPart('app/main/Register');

        // Navigation
        // msNavigationServiceProvider.saveItem('Demo.login', {
        //     title : 'Authentication',
        //     icon  : 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Demo.Register', {
        //     title: 'Register',
        //     state: 'app.Register',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }

})();
