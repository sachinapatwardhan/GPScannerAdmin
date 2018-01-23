(function() {
    'use strict';

    angular
        .module('app.HandShake', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.HandShake', {
                url: '/HandShake',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/HandShake/HandShake.html',
                        controller: 'HandShakeController as vm'
                    }
                },
                bodyClass: 'Hand Shake',
                ModuleName: 'Hand Shake'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();