(function() {
    'use strict';

    angular
        .module('app.EnquiryMgmt', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.EnquiryMgmt', {
                url: '/EnquiryMgmt',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/EnquiryMgmt/EnquiryMgmt.html',
                        controller: 'EnquiryMgmtController as vm'
                    }
                },
                bodyClass: 'Enquiry Mgmt',
                ModuleName: 'Enquiry Mgmt'
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/EnquiryMgmt');

        // Navigation
        // msNavigationServiceProvider.saveItem('Module.Module', {
        //     title: 'Authentication',
        //     icon: 'icon-lock',
        //     weight: 1
        // });

        msNavigationServiceProvider.saveItem('CMS.EnquiryMgmt', {
            title: 'Enquiry Mgmt',
            state: 'app.EnquiryMgmt',
            icon: 'icon-lock',
            weight: 1
        });
    }
})();
