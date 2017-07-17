(function() {
    'use strict';

    angular
        .module('app.menu', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.menu', {
                url: '/menu',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Menu/Menu.html',
                        controller: 'MenuController as vm'
                    }
                },
                bodyClass: 'Menu',
                ModuleName: 'Menu'
            });

    }
})();