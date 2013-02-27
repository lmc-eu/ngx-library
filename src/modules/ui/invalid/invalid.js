// IE8 support
document.createElement('ngx-invalid');

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.invalid', []);

    /**
     * Input/Form invalid status
     */
    module.directive('ngxInvalid', ['$window', function($window) {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                element.addClass('ngx-invalid');

                var parts = (attrs.ngxInvalid ? attrs.ngxInvalid.split(' ') : []),
                    input = (attrs.input ? attrs.input : parts[0]),
                    errors = (attrs.error ? attrs.error : parts[1]),
                    scrollable = (attrs.ngxScrollable !== undefined ? true : false),
                    watch = [];

                scope.elementOffset = 0;

                // error types
                if (errors) {
                    // can be comma-separated list
                    angular.forEach(errors.split(','), function(type) {
                        watch.push(input + '.$error.' + type);
                    });
                } else {
                    watch.push(input + '.$invalid');
                }

                watch = [watch.length > 1 ? '(' + watch.join(' || ') + ')' : watch[0]];

                if (attrs.ngShow) {
                    watch.push(attrs.ngShow);
                }
                if (attrs.expression) {
                    watch.push(attrs.expression);
                }

                scope.$watch('elementOffset', function(value, oldvalue) {
                    if(value !== oldvalue && value !== null) {
                        $window.scrollTo(0, value.top - 50);
                    }
                });

                scope.$watch(watch.join(' && '), function(value) {
                    element.toggle(value ? true : false);
                    if(value === true && scrollable) {
                        scope.elementOffset = $('.ngx-invalid:visible:eq(0)').offset();
                    }
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
