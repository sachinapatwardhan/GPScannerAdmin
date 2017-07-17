(function() {
    'use strict';

    angular
        .module('app.rewardsystem', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.rewardsystem', {
                url: '/rewardsystem',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/RewardSystem/RewardSystem.html',
                        controller: 'RewardSystemController as vm'
                    }
                },
                bodyClass: 'Reward System',
                ModuleName: 'Reward System'
            });

        // Translation
       // $translatePartialLoaderProvider.addPart('app/main/rewardsystem');

        // Navigation
        // msNavigationServiceProvider.saveItem('Settings.rewardsystem', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Settings.rewardsystem', {
        //     title: 'Reward System',
        //     state: 'app.rewardsystem',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();
