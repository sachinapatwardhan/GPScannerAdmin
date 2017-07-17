(function() {
    'use strict';

    angular
        .module('app.Language')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Language', {
                url: '/Language',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Language/Language.html',
                        controller: 'LanguageController as vm'
                    }
                },
                bodyClass: 'Language',
                ModuleName: 'Language'
            });


    }
})();