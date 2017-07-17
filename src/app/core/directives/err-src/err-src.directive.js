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
        })

    // angular
    //     .module('app.core').directive('numbersOnly', function() {
    //         return {
    //             require: 'ngModel',
    //             link: function(scope, element, attrs, modelCtrl) {
    //                 modelCtrl.$parsers.push(function(inputValue) {
    //                     if (inputValue == undefined) return ''
    //                     var transformedInput = inputValue.replace(/[^0-9]/g, '');
    //                     if (transformedInput != inputValue) {
    //                         modelCtrl.$setViewValue(transformedInput);
    //                         modelCtrl.$render();
    //                     }

    //                     return transformedInput;
    //                 });
    //             }
    //         };
    //     })
})();
