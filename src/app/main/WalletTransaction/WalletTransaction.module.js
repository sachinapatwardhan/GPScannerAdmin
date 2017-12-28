(function() {
    'use strict';

    angular
        .module('app.WalletTransaction', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.WalletTransaction', {
                url: '/WalletTransaction',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/WalletTransaction/WalletTransaction.html',
                        controller: 'WalletTransactionController as vm'
                    }
                },
                bodyClass: 'Wallet Transaction',
                ModuleName: 'Wallet Transaction'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/dynamicpage');

        // Navigation
        // msNavigationServiceProvider.saveItem('CMS.dynamicpage', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.Reward Price', {
        //     title: 'Reward Price',
        //     state: 'app.RewardPrice',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();