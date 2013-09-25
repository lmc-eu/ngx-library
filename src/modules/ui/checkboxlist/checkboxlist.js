(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.checkboxlist', []);

    /**
     * Checkbox list
     * @todo refactoring
     */
    module.directive('ngxCheckboxlist', ['$interpolate', function($interpolate) {
//        var lists = {}; // evil global state causing bugs!
        return {
            require: 'ngModel',
            scope: false,
            link: function(scope, element, attrs, ctrl) {

            var id = attrs.ngModel,
                    required = angular.isDefined(attrs.required),
                    minCount = (attrs.min ? parseInt(attrs.min, 10) : null),
                    maxCount = (attrs.max ? parseInt(attrs.max, 10) : null);

                // 'lists'-variable in parent scope, so not app-global
                if (!scope.$parent.checkboxListMainStore) {
                     scope.$parent.checkboxListMainStore = {};
                }
                if (!scope.$parent.checkboxListMainStore[id]) {
                     scope.$parent.checkboxListMainStore[id] = {
                        ctrl: [],
                        list: {}
                    };
                }
                
                // this is the controll object for a single inputfield
                var checkboxControl = scope.$parent.checkboxListMainStore[id];

                ctrl.value = $interpolate(element.val())(scope);

                checkboxControl.ctrl.push(ctrl);
                checkboxControl.list[ctrl.value] = attrs.title;
                ctrl.list = checkboxControl.list;


                function setValidity(values) {
                    ctrl.$setValidity('required', required ? values.length > 0 : true);
                    ctrl.$setValidity('min', angular.isNumber(minCount) ? values.length >= minCount : true);
                    ctrl.$setValidity('max', angular.isNumber(maxCount) ? values.length <= maxCount : true);
                }

                ctrl.$parsers.push(function() {
                    var values = [];

                    angular.forEach(checkboxControl.ctrl, function(ctrl) {
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

