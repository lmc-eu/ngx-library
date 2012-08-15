(function(angular) {
    var module = angular.module('ngx.ui.checkboxlist', ['ngx']);

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
                    required = (attrs.ngxCheckboxlistRequired ? true : false),
                    min = parseInt(attrs.ngxCheckboxlistMin, 10);

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

                ctrl.$parsers.push(function() {
                    var values = [];

                    angular.forEach(lists[id].ctrl, function(ctrl) {
                        if (ctrl.$viewValue) {
                            values.push(ctrl.value);
                        }
                    });

                    ctrl.$setValidity('required', required ? values.length > 0 : true);
                    ctrl.$setValidity('min', values.length >= min);

                    return values;
                });

                ctrl.$formatters.push(function(values) {
                    if (!values) {
                        values = [];
                    }

                    ctrl.$setValidity('required', required ? values.length > 0 : true);
                    ctrl.$setValidity('min', values.length >= min);

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

})(angular);
