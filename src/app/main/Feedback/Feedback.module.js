(function() {
    'use strict';

    angular
        .module('app.Feedback', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.Feedback', {
                url: '/Feedback',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Feedback/Feedback.html',
                        controller: 'FeedbackController as vm'
                    }
                },
                bodyClass: 'Feedback',
                ModuleName: 'Feedback'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('Pettorway.Feedback', {
            title: 'Feedback',
            state: 'app.Feedback',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
