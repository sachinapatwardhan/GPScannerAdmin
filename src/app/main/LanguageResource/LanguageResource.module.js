(function() {
    'use strict';

    angular
        .module('app.LanguageResource')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.LanguageResource', {
                url: '/LanguageResource',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/LanguageResource/LanguageResource.html',
                        controller: 'LanguageResourceController as vm'
                    }
                },
                bodyClass: 'Language Resource',
                ModuleName: 'Language Resource'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/LanguageResource');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.Vendor', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('CMS.LanguageResource', {
            title: 'Language Resource',
            state: 'app.LanguageResource',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
