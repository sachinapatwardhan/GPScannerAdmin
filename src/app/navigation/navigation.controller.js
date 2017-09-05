(function() {
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, $rootScope, $cookieStore) {
        var vm = this;

        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };
        $rootScope.Logo = $cookieStore.get('Logo');
        $('.logo-image').css('background-image', 'url(' + $rootScope.Logo + ')');

        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded() {
            vm.folded = !vm.folded;
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function() {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });
    }

})();