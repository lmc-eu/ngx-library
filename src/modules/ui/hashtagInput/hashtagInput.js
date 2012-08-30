(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.hashtagInput', []);

    /**
     * Hash tag (twitter)
     */
    module.directive('ngxHashtagInput', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                ctrl.$parsers.push(function(value) {
                    if (value === '' || value === '#' || typeof(value) !== 'string') {
                        value = '';
                    } else {
                        value = '#' + value.replace(/^([#]+)/, '');
                    }

                    element.val(value);

                    // validate
                    ctrl.$setValidity('hashtag', !(value && value.substring(1).match(/(\s|#)/)));

                    return value;
                });
            }
        };
    });

})(window.angular);
