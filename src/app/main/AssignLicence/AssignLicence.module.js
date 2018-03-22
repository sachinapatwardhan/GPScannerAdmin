(function() {
    'use strict';

    angular
        .module('app.AssignLicence', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AssignLicence', {
                url: '/AssignLicence',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AssignLicence/AssignLicence.html',
                        controller: 'AssignLicenceController as vm'
                    }
                },
                bodyClass: 'Assign Licence',
                ModuleName: 'Assign Licence',
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