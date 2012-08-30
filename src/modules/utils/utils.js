(function(angular) {
    'use strict';

    var ngxUtils = {};

    /**
     * Recursive angular.extend
     * @param dst
     * @param src
     * @return {Object}
     */
    ngxUtils.extendRecursive = function(dst, src) {
        angular.forEach(arguments, function(obj, index) {
            if (index === 0) {
                return;
            }
            angular.forEach(obj, function(value, property) {
                if (angular.isObject(value) && angular.isObject(dst[property])) {
                    ngxUtils.extendRecursive(dst[property], value);
                } else {
                    dst[property] = value;
                }
            });
        });

        return dst;
    };

    angular.module('ngx.utils', [])
       .value('ngxUtils', ngxUtils);

})(window.angular);
