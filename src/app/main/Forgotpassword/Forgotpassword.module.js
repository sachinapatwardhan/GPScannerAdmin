(function() {
    'use strict';

    angular
        .module('app.Forgotpassword', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.Forgotpassword', {
            url: '/app/Forgotpassword',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.Forgotpassword': {
                    templateUrl: 'app/main/Forgotpassword/Forgotpassword.html',
                    controller: 'ForgotpasswordController as vm'
                }
            },
            bodyClass: 'Forgotpassword',
            ModuleName: 'Forgotpassword'
        });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Forgotpassword');

        // Navigation
        // msNavigationServiceProvider.saveItem('Demo.login', {
        //     title : 'Authentication',
        //     icon  : 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Demo.Forgotpassword', {
        //     title: 'Login',
        //     state: 'app.Forgotpassword',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }

})();
