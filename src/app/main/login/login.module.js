(function() {
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.login', {
            url: '/app/login',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.login': {
                    templateUrl: 'app/main/login/login.html',
                    controller: 'LoginController as vm'
                }
            },
            bodyClass: 'Login',
            ModuleName: 'Login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/login');

        // Navigation
        // msNavigationServiceProvider.saveItem('Demo.login', {
        //     title : 'Authentication',
        //     icon  : 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Demo.login', {
        //     title: 'Login',
        //     state: 'app.login',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }

})();