(function() {
    'use strict';

    angular
        .module('app.DrivingBehaviour', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DrivingBehaviour', {
                url: '/DrivingBehaviour',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DrivingBehavior/DrivingBehavior.html',
                        controller: 'DrivingBehaviourController as vm'
                    }
                },
                bodyClass: 'Driving Behaviour',
                ModuleName: 'Driving Behaviour'
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