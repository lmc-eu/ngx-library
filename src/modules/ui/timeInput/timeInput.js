(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.timeInput', []);

    /**
     * Time input type
     */
    module.directive('ngxTimeInput', ['$parse', function($parse) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                // related date input
                var dateInput;
                if (attrs.dateInput) {
                    dateInput = $parse(attrs.dateInput)(scope);
                    dateInput.timeInput = ctrl;    // back reference
                }

                // autocomplete
                var values = [];
                for (var h = 0; h <= 23; h++) {
                    for (var m = 0; m <= 59; m = m + 15) {
                        values.push((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m));
                    }
                }
                element.autocomplete({
                    source: values,
                    minLength: 0,
                    delay: 0,
                    open: function() {
                        element.autocomplete('widget').css('width', '60px');
                    },
                    select: function(event, ui) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(ui.item.value);
                        });
                    }
                }).focus(function() {
                    element.autocomplete('search', ($.inArray(element.val(), values) === -1) ? '' : element.val());
                });

                ctrl.$parsers.push(function(value) {
                    ctrl.hours = undefined;
                    ctrl.minutes = undefined;

                    // validation
                    var valid = true;
                    if (value && value.length) {
                        var re = new RegExp('([0-9]{1,2}):([0-9]{2})$').exec(value);
                        valid = (re && re[1] >= 0 && re[1] <= 23 && re[2] >= 0 && re[2] <= 59);
                        if (valid) {
                            ctrl.hours = parseInt(re[1], 10);
                            ctrl.minutes = parseInt(re[2], 10);
                        }
                    }

                    ctrl.$setValidity('time', valid);

                    if (dateInput) {
                        dateInput.$setViewValue(dateInput.$viewValue);
                    }

                    return value;
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
