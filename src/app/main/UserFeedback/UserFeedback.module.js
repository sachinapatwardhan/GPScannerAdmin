(function() {
    'use strict';

    angular
        .module('app.userfeedback', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.userfeedback', {
                url: '/userfeedback',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/UserFeedback/UserFeedback.html',
                        controller: 'UserFeedbackController as vm'
                    }
                },
                bodyClass: 'User Feedback',
                ModuleName: 'User Feedback'
            });

        // Translation
        // $translatePartialLoaderProvider.addPart('app/main/user');

        // Navigation
        // msNavigationServiceProvider.saveItem('Users.user', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Master.Banks', {
        //     title: 'Banks',
        //     state: 'app.Banks',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();