(function() {
    'use strict';

    angular
        .module('app.Widget', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Widget', {
                url: '/Widget',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Widget/Widget.html',
                        controller: 'WidgetController'
                    }
                },
                bodyClass: 'Web Widget',
                ModuleName: 'Web Widget'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Widget');

        // msNavigationServiceProvider.saveItem('CMS.Widget', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('CMS.Widget', {
            title: 'Web Widget',
            state: 'app.Widget',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
