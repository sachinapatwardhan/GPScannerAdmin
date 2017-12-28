(function() {
    'use strict';

    angular
        .module('app.VehicleMonitor', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.VehicleMonitor', {
                url: '/VehicleMonitor',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/VehicleMonitor/VehicleMonitor.html',
                        controller: 'VehicleMonitorController as vm'
                    }
                },
                bodyClass: 'Vehicle Monitor',
                ModuleName: 'Vehicle Monitor'
            });
    }
})();