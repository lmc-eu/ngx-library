(function(angular, head) {
    'use strict';

    var module = angular.module('ngx.loader', ['ngx']);

    module.factory('ngxLoader', ['ngxConfig', function(ngxConfig) {
        var loaded = [];

        /**
         * Loads external js/css files
         * @param files
         */
        return function(files, onload) {
            var js = [],
                css = [];

            angular.forEach(typeof(files) === 'string' ? [files] : files, function(file) {
                // add base path
                if (!file.match(/^(\/|http)/)) {
                    file = ngxConfig.basePath + file;
                }

                // already loaded
                if (loaded.indexOf(file) !== -1) {
                    return;
                }

                if (file.match(/\.css$/i)) {
                    css.push(file);
                } else if (file.match(/\.js$/i)) {
                    js.push(file);
                } else {
                    throw new Error('File type not supported');
                }
            });

            if (js.length) {
                head.js.apply(this, js);
                head.ready(onload);
            } else {
                onload();
            }

            if (css.length) {
                angular.forEach(css, function(file) {
                    angular.element('head').append(angular.element('<link rel="stylesheet" type="text/css" href="' + file + '"></link>'));
                });
            }
        };
    }]);
})(window.angular, window.head);
