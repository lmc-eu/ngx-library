(function(angular, console) {
    'use strict';

    var module = angular.module('ngx.ui.validate', []);

    /**
     * Validates input against scope function
     */
    module.directive('ngxValidate', function() {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function(scope, element, attrs, ctrl) {
                var validators = scope.$eval(attrs.ngxValidate ? attrs.ngxValidate : attrs.validators);

                if (!angular.isObject(validators)) {
                    validators = { validation: validators };
                }

                angular.forEach(validators, function(validator, key) {
                    var ctrls = (ctrl ? [ctrl] : []);

                    // array notation.. { key: [validator, ctrl, ctrl, ctrl] }
                    if (angular.isArray(validator)) {
                        angular.forEach(validator.slice(1), function(value) {
                            ctrls.push(value);
                        });
                        validator = validator[0];
                    }
                    if (!angular.isFunction(validator)) {
                        return;
                    }

                    function validate(value) {
                        var args = [],
                            valid;

                        if (ctrls.length > 1) {
                            angular.forEach(ctrls, function(ctrl) {
                                args.push(ctrl.$viewValue);
                            });
                        } else {
                            args.push(value);
                        }

                        valid = validator.apply(scope, args);
                        angular.forEach(ctrls, function(ctrl) {
                            ctrl.$setValidity(key, valid);
                        });

                        return (valid ? value : undefined);
                    }

                    angular.forEach(ctrls, function(ctrl) {
                        ctrl.$formatters.push(validate);
                        ctrl.$parsers.push(validate);
                    });
                });
            }
        };
    });
})(window.angular, window.console);
