(function() {
    'use strict';

    angular
        .module('app.DeviceStatus', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.DeviceStatus', {
                url: '/DeviceStatus',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/DeviceStatus/DeviceStatus.html',
                        controller: 'DeviceStatusController as vm'
                    }
                },
                bodyClass: 'Device Status',
                ModuleName: 'Device Status'
            });

    }
})();