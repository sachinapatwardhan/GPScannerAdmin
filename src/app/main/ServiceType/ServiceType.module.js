(function() {
    'use strict';

    angular
        .module('app.ServiceType')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.ServiceType', {
                url: '/ServiceType',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/ServiceType/ServiceType.html',
                        controller: 'ServiceTypeController as vm'
                    }
                },
                bodyClass: 'Service Type',
                ModuleName: 'Service Type'
            });


    }
})();