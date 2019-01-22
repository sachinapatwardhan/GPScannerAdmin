(function() {
    'use strict';

    angular
        .module('app.AssignDistributor', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.AssignDistributor', {
                url: '/AssignDistributor',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AssignDistributor/AssignDistributor.html',
                        controller: 'AssignDistributorController as vm'
                    }
                },
                bodyClass: 'Assign Distributor',
                ModuleName: 'Assign Distributor'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/Feedback');

        // Navigation
        // msNavigationServiceProvider.saveItem('Products.brand', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        // msNavigationServiceProvider.saveItem('Owner Customer', {
        //     title: 'Owner Customer',
        //     state: 'app.OwnerCustomer',
        //     icon: 'icon-lock',
        //     weight: 1
        // });
    }
})();