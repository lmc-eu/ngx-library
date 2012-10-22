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

    /**
     * JavaScript equivalent of PHP’s in_array
     * @param needle
     * @param haystack
     * @param argStrict
     * @return {Boolean}
     */
    ngxUtils.in_array = function(needle, haystack, argStrict) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: vlado houba
        // +   input by: Billy
        // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
        // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
        // *     returns 1: true
        // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
        // *     returns 2: false
        // *     example 3: in_array(1, ['1', '2', '3']);
        // *     returns 3: true
        // *     example 3: in_array(1, ['1', '2', '3'], false);
        // *     returns 3: true
        // *     example 4: in_array(1, ['1', '2', '3'], true);
        // *     returns 4: false
        var key = '',
            strict = !! argStrict;

        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true;
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
        }

        return false;
    };

    angular.module('ngx.utils', [])
       .value('ngxUtils', ngxUtils);

})(window.angular);
