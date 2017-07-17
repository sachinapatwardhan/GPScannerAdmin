(function() {
    'use strict';

    angular
        .module('app.stickyfooter', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.stickyfooter', {
                url: '/stickyfooter',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/StickyFooter/StickyFooter.html',
                        controller: 'StickyFooterController as vm'
                    }
                },
                bodyClass: 'Sticky Footer',
                ModuleName: 'Sticky Footer'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/stickyfooter');

        // Navigation
        // msNavigationServiceProvider.saveItem('CMS.stickyfooter', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('CMS.stickyfooter', {
        //     title: 'Sticky Footer',
        //     state: 'app.stickyfooter',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
