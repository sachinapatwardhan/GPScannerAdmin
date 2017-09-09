(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('msSplashScreen', msSplashScreenDirective);

    /** @ngInject */
    function msSplashScreenDirective($animate, $rootScope, $cookieStore) {
        fun.apply();

        function fun() {
            $('.logo').css('background-image', 'url(' + $cookieStore.get('Logo') + ')');
        }
        return {
            restrict: 'E',
            link: function(scope, iElement) {
                var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', function() {
                    $animate.leave(iElement).then(function() {
                        // De-register scope event
                        splashScreenRemoveEvent();

                        // Null-ify everything else
                        scope = iElement = null;
                    });
                });
            }
        };
    }
})();