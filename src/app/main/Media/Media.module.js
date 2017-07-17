(function() {
    'use strict';

    angular
        .module('app.media', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.media', {
                url: '/media',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Media/Media.html',
                        controller: 'MediaController as vm'
                    }
                },
                bodyClass: 'Media',
                ModuleName: 'Media'
            });


    }
})();