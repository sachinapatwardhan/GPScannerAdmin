(function() {
    'use strict';

    angular
        .module('app.TransferDevice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.TransferDevice', {
                url: '/TransferDevice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/TransferDevice/TransferDevice.html',
                        controller: 'TransferDeviceController as vm'
                    }
                },
                bodyClass: 'Transfer Device',
                ModuleName: 'Transfer Device'
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