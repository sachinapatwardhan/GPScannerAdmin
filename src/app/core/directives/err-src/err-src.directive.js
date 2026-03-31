(function() {
    'use strict';

    angular
        .module('app.core').directive('errSrc', function() {
            return {
                link: function(scope, element, attrs) {
                    element.bind('error', function() {
                        if (attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }
                    });
                }
            }
        }).directive('sbLoad', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    var fn = $parse(attrs.sbLoad);
                    elem.on('load', function(event) {
                        scope.$apply(function() {
                            fn(scope, { $event: event });
                        });
                    });
                }
            };
        }])

    
})();