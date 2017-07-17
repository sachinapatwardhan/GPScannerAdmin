(function() {
    'use strict';

    angular
        .module('app.datatable', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.datatable', {
                url: '/datatable',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/datatable/datatable.html',
                        controller: 'DatatableController as vm'
                    }
                },
                bodyClass: 'datatable',
                ModuleName: 'datatable'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/datatable');

        // Navigation
        // msNavigationServiceProvider.saveItem('Demo.datatable', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Demo.datatable', {
        //     title: 'datatable Sample',
        //     state: 'app.datatable',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();