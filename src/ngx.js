(function(angular, document) {
    'use strict';

    // determine base path
    var basePath = null,
        re = /ngx(\.min)?\.js(.*)$/;

    angular.forEach(document.getElementsByTagName('script'), function(script) {
        if (script.src.match(re)) {
            basePath = script.src.replace(re, '');
        }
    });
    if (basePath === null) {
        throw new Error('ngx base path cannot be determined.');
    }

    // register as angular module
    var module = angular.module('ngx', []);

    /**
     * Configuration
     */
    module.value('ngxConfig', {
        basePath: basePath,
        libsPath: basePath + 'libs/',
        templatesPath: basePath + 'templates/',
        ui: {}
    });

})(window.angular, window.document);

// missing ECMAScript functions
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(search) {
        'use strict';
        for (var i = 0; i < this.length; i++) {
            if (this[i] === search) {
                return i;
            }
        }
        return -1;
    };
}
