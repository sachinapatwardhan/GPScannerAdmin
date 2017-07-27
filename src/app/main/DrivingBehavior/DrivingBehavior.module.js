(function() {
    'use strict';

    angular
        .module('app.DrivingBehavior', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DrivingBehavior', {
                url: '/DrivingBehavior',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DrivingBehavior/DrivingBehavior.html',
                        controller: 'DrivingBehaviorController as vm'
                    }
                },
                bodyClass: 'Driving Behavior',
                ModuleName: 'Driving Behavior'
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