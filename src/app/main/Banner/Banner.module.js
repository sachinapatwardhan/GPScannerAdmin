(function() {
    'use strict';

    angular
        .module('app.Banner', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Banner', {
                url: '/Banner',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Banner/Banner.html',
                        controller: 'BannerController'
                    }
                },
                bodyClass: 'Banner',
                ModuleName: 'Banner'
            });

    }
})();