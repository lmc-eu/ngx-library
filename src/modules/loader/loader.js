(function(angular, head) {
    'use strict';

    var module = angular.module('ngx.loader', ['ngx.config']);

    module.factory('ngxLoader', ['ngxConfig', function(ngxConfig) {
        var loaded = [];

        /**
         * Checks if file is already loaded
         * @param file
         * @return {Boolean}
         */
        function isLoaded(file) {
            for (var i = 0; i < loaded.length; i++) {
                if (loaded[i] === file) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Loads external js/css files
         * @param files
         */
        var ngxLoader = function(files, onload) {
            var js = [],
                css = [];

            angular.forEach(typeof(files) === 'string' ? [files] : files, function(file) {
                // add base path
                if (!file.match(/^(\/|http)/)) {
                    file = ngxConfig.basePath + file;
                }

                // already loaded
                if (isLoaded(file)) {
                    return;
                }

                if (file.match(/\.css$/i)) {
                    css.push(file);
                } else if (file.match(/\.js$/i)) {
                    js.push(file);
                } else {
                    throw new Error('File type not supported');
                }

                loaded.push(file);
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

        /**
         * Returns loaded files
         * @return {Array}
         */
        ngxLoader.getLoaded = function() {
            return loaded;
        };

        return ngxLoader;
    }]);
})(window.angular, window.head);
