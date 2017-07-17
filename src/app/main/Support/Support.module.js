(function() {
    'use strict';

    angular
        .module('app.Support', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Support', {
                url: '/Support',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Support/Support.html',
                        controller: 'SupportController as vm'
                    }
                },
                bodyClass: 'Support',
                ModuleName: 'Support'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Support', {
            title: 'Support',
            state: 'app.Support',
            //icon: 'icon-lock',
            //weight: 1
        });
    }
})();
