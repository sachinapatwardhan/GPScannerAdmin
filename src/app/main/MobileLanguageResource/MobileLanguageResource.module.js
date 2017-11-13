(function() {
    'use strict';

    angular
        .module('app.MobileLanguageResource')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.MobileLanguageResource', {
                url: '/MobileLanguageResource',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/MobileLanguageResource/MobileLanguageResource.html',
                        controller: 'MobileLanguageResourceController as vm'
                    }
                },
                bodyClass: 'Mobile Language Resource',
                ModuleName: 'Mobile Language Resource'
            });
    }
})();