// IE8 support
document.createElement('ngx-invalid');

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.invalid', ['ngx']);

    /**
     * Input/Form invalid status
     */
    module.directive('ngxInvalid', function() {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                element.addClass('ngx-invalid');

                var parts = (attrs.ngxInvalid ? attrs.ngxInvalid.split(' ') : []),
                    input = (attrs.input ? attrs.input : parts[0]),
                    errors = (attrs.error ? attrs.error : parts[1]),
                    watch = [];

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

                scope.$watch(watch.join(' && '), function(value) {
                    element.toggle(value ? true : false);
                });
            }
        };
    });

})(window.angular);
