(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.checkboxlist', []);

    /**
     * Checkbox list
     * @todo refactoring
     */
    module.directive('ngxCheckboxlist', ['$interpolate', function($interpolate) {
        var lists = {};
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                var id = attrs.ngModel,
                    required = angular.isDefined(attrs.required),
                    minCount = (attrs.min ? parseInt(attrs.min, 10) : null),
                    maxCount = (attrs.max ? parseInt(attrs.max, 10) : null);

                ctrl.value = $interpolate(element.val())(scope);

                if (!lists[id]) {
                    lists[id] = {
                        ctrl: [],
                        list: {}
                    };
                }
                lists[id].ctrl.push(ctrl);
                lists[id].list[ctrl.value] = attrs.title;
                ctrl.list = lists[id].list;

                function setValidity(values) {
                    ctrl.$setValidity('required', required ? values.length > 0 : true);
                    ctrl.$setValidity('min', angular.isNumber(minCount) ? values.length >= minCount : true);
                    ctrl.$setValidity('max', angular.isNumber(maxCount) ? values.length <= maxCount : true);
                }

                ctrl.$parsers.push(function() {
                    var values = [];

                    angular.forEach(lists[id].ctrl, function(ctrl) {
                        if (ctrl.$viewValue) {
                            values.push(ctrl.value);
                        }
                    });

                    setValidity(values);
                    return values;
                });

                ctrl.$formatters.push(function(values) {
                    if (!values) {
                        values = [];
                    }

                    setValidity(values);

                    for (var i = 0; i < values.length; i++) {
                        if (values[i] === ctrl.value) {
                            return true;
                        }
                    }

                    return false;
                });
            }
        };
    }]);

})(window.angular);
