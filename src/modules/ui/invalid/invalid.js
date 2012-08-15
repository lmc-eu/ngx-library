(function(angular) {
    var module = angular.module('ngx.ui.invalid', ['ngx']);

    /**
     * Input/expression invalid status
     */
    module.directive('ngxInvalid', function() {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                element.addClass('ngx-invalid');

                // input name in angular scope
                var input = attrs.input;

                // error types (can be comma-separated list)
                var errors = attrs.error;
                if (errors) {
                    errors = errors.split(',');
                }

                // watch to watch
                var watch = [];

                // expression
                var expression = attrs.expression;
                if (expression) {
                    watch.push(expression);
                }

                // input error/valid
                if (input) {
                    var expressions = [];

                    if (errors) {
                        angular.forEach(errors, function(type) {
                            expressions.push(input + '.$error.' + type);
                        });
                    } else {
                        expressions.push(input + '.$invalid');
                    }

                    watch.push(expressions.length > 1 ? '(' + expressions.join(' || ') + ')' : expressions[0]);
                }

                if (watch.length) {
                    scope.$watch(watch.join(' && '), function(value) {
                        $(element).toggle(value ? true : false);
                    });
                }
            }
        };
    });

})(angular);
