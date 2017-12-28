(function() {
    'use strict';

    angular
        .module('app.wallet', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.wallet', {
                url: '/wallet',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/Wallet/Wallet.html',
                        controller: 'WalletController as vm'
                    }
                },
                bodyClass: 'Wallet',
                ModuleName: 'Wallet'
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