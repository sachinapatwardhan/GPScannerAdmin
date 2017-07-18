(function() {
    'use strict';

    angular
        .module('app.PetDevice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.PetDevice', {
                url: '/PetDevice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/PetDevice/PetDevice.html',
                        controller: 'PetDeviceController as vm'
                    }
                },
                bodyClass: 'Pet Device',
                ModuleName: 'Trackers'
            });

    }
})();