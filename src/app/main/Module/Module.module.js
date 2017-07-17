(function() {
    'use strict';

    angular
        .module('app.Module', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Module', {
                url: '/Module',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Module/Module.html',
                        controller: 'ModuleController as vm'
                    }
                },
                bodyClass: 'Manage Module',
                ModuleName: 'Manage Module'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Module');

        // Navigation
        // msNavigationServiceProvider.saveItem('Module.Module', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Module.Module', {
        //     title: 'Manage Module',
        //     state: 'app.Module',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();