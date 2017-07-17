(function() {
    'use strict';

    angular
        .module('app.News', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.News', {
                url: '/News',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/News/News.html',
                        controller: 'NewsController as vm'
                    }
                },
                bodyClass: 'News',
                ModuleName: 'News'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/News');

        // Navigation
        // msNavigationServiceProvider.saveItem('CMS.News', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('CMS.News', {
            title: 'News',
            state: 'app.News',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
