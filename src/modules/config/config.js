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

    var module = angular.module('ngx.config', []);

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
