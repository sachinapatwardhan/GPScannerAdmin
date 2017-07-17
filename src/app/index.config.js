(function() {
    'use strict';

    angular
        .module('fuse')
        .config(config).config(override_mdMaxlength);

    /** @ngInject */
    function config() {
        // Put your custom configurations here
    }

    function override_mdMaxlength($provide) {
        $provide.decorator(
            'mdMaxlengthDirective',
            function($delegate) {
                var mdMaxlength = $delegate[0];
                var link = mdMaxlength.link;
                mdMaxlength.compile = function() {
                    //Line 18 to 64: Code of md-maxlength directive. Change in line 62
                    return function(scope, element, attr, ctrls) {
                        var maxlength;
                        var ngModelCtrl = ctrls[0];
                        var containerCtrl = ctrls[1];
                        var charCountEl = angular.element('<div class="md-char-counter">');

                        attr.$set('ngTrim', 'false');
                        containerCtrl.element.append(charCountEl);

                        ngModelCtrl.$formatters.push(renderCharCount);
                        ngModelCtrl.$viewChangeListeners.push(renderCharCount);
                        element.on(
                            'input keydown',
                            function() {
                                renderCharCount(); //make sure it's called with no args
                            }
                        );

                        scope.$watch(attr.mdMaxlength, function(value) {
                            maxlength = value;
                            if (angular.isNumber(value) && value > 0) {
                                if (!charCountEl.parent().length) {
                                    $animate.enter(
                                        charCountEl,
                                        containerCtrl.element,
                                        angular.element(containerCtrl.element[0].lastElementChild)
                                    );
                                }
                                renderCharCount();
                            } else {
                                $animate.leave(charCountEl);
                            }
                        });

                        ngModelCtrl.$validators['md-maxlength'] = function(modelValue, viewValue) {
                            if (!angular.isNumber(maxlength) || maxlength < 0) {
                                return true;
                            }
                            return (modelValue || element.val() || viewValue || '').length <= maxlength;
                        };

                        function renderCharCount(value) {
                            //Original code commented
                            //charCountEl.text( ( element.val() || value || '' ).length + '/' + maxlength );
                            //CHANGE PROPOSED BY @breeze4 (MATT BAILEY): http://tinyurl.com/pxnnvxb
                            charCountEl.text((ngModelCtrl.$modelValue || '').length + '/' + maxlength);
                            return value;
                        }
                    };
                };
                return $delegate;
            }
        );
    }

})();
