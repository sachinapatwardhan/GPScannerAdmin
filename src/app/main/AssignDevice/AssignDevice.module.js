(function() {
    'use strict';

    angular
        .module('app.AssignDevice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.AssignDevice', {
                url: '/AssignDevice',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/AssignDevice/AssignDevice.html',
                        controller: 'AssignDeviceController'
                    }
                },
                bodyClass: 'assign-device',
                ModuleName: 'Assign Device'
            });
    }
})();