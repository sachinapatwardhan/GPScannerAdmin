(function() {
    'use strict';

    angular
        .module('app.alarm', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.alarm', {
                url: '/Alarm',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Alarm/Alarm.html',
                        controller: 'AlarmController as vm'
                    }
                },
                bodyClass: 'Alarm',
                ModuleName: 'Alarm'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
