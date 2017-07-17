(function() {
    'use strict';

    angular
        .module('app.FacebookFeed', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.FacebookFeed', {
                url: '/FacebookFeed',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/FacebookFeed/FacebookFeed.html',
                        controller: 'FacebookFeedController as vm'
                    }
                },
                bodyClass: 'FacebookFeed',
                ModuleName: 'Facebook Feeds'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/menu');

        //Navigation
        // msNavigationServiceProvider.saveItem('CMS.menu', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('FacebookFeeds', {
            title: 'Facebook Feeds',
            state: 'app.FacebookFeed',
            // icon: 'icon-lock',
            weight: 1
        });
    }
})();
