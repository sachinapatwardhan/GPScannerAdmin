(function() {
    'use strict';

    angular
        .module('app.MobileWidget', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.MobileWidget', {
                url: '/MobileWidget',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/MobileWidget/MobileWidget.html',
                        controller: 'MobileWidgetController'
                    }
                },
                bodyClass: 'Mobile Widget',
                ModuleName: 'Mobile Widget'
            });


    }
})();