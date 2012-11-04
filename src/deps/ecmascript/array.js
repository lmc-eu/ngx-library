/**
 * Missing ECMAScript Array functions
 */
(function(Array) {
    'use strict';

    if (!Array.prototype.indexOf) {
        /**
         * Searches the array for the specified item and returns its position
         * @param search
         * @return {Number}
         */
        Array.prototype.indexOf = function(search) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === search) {
                    return i;
                }
            }
            return -1;
        };
    }
})(window.Array);