(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.tooltip', []);

    /**
     * Tooltip
     * @todo attribute directive on element
     */
    module.directive('ngxTooltip', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="ngx-tooltip" ng-transclude><span class="arrow"><span></span></span></div>',
            link: function(scope, element, attrs) {
                /** @todo */
                if (attrs.ngxTooltip) {
                    return;
                }

                // bind focus/blur events to input elements
                (attrs.element ? $(attrs.element) : element.prevAll('input,select,textarea')).bind({
                    focus: function(event, trigger) {
                        if (trigger && $(trigger).is(':disabled')) {
                            return;
                        }
                        element.show();
                    },
                    blur: function() {
                        element.hide();
                    }
                });

                element.hide();
            }
        };
    });

})(window.angular, window.jQuery);
