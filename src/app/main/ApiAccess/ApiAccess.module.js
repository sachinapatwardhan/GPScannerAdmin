(function() {
    'use strict';

    angular
        .module('app.apiaccess', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.apiaccess', {
                url: '/apiaccess',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/ApiAccess/ApiAccess.html',
                        controller: 'ApiAccessController as vm'
                    }
                },
                bodyClass: 'ApiAccess',
                ModuleName: 'ApiAccess'
            });

    }
})();
