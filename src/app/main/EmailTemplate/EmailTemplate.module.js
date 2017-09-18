(function() {
    'use strict';

    angular
        .module('app.EmailTemplate', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.EmailTemplate', {
                url: '/EmailTemplate',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/EmailTemplate/EmailTemplate.html',
                        controller: 'EmailTemplateController as vm'
                    }
                },
                bodyClass: 'Email Template',
                ModuleName: 'Email Template'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/EmailTemplate');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.EmailTemplate', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('CMS.EmailTemplate', {
        //     title: 'Email Template',
        //     state: 'app.EmailTemplate',

        //     weight: 1
        // });
    }
})();