(function(angular, head) {
    'use strict';

    var module = angular.module('ngx.loader', ['ngx.config']);

    module.factory('ngxLoader', ['ngxConfig', function(ngxConfig) {
        var loaded = [];

        /**
         * Loads external js/css files
         * @param files
         */
        return function(files, onload) {
            var queue = {
                js: [],
                css: []
            };

            // group files to load by type
            angular.forEach(typeof(files) === 'string' ? [files] : files, function(file) {
                var type,
                    force = false;

                // add base path
                if (!file.match(/^(\/|http)/)) {
                    file = ngxConfig.basePath + file;
                }

                if (file.match(/\.css$/i)) {
                    type = 'css';
                } else if (file.match(/\.js$/i)) {
                    type = 'js';
                    force = (onload ? true : false);
                } else {
                    throw new Error('File type not supported');
                }

                // already loaded
                if (loaded.indexOf(file) >= 0 && !force) {
                    return;
                }

                queue[type].push(file);
                loaded.push(file);
            });

            // process queue
            angular.forEach(queue, function(files, type) {
                if (!files.length) {
                    return;
                }
                switch (type) {
                    case 'js':
                        // handle onload callback with head.js
                        if (onload) {
                            files.push(onload);
                            onload = null;
                        }
                        head.js.apply(this, files);
                        break;

                    case 'css':
                        angular.forEach(files, function(file) {
                            angular.element('head').append(angular.element('<link rel="stylesheet" type="text/css" href="' + file + '"></link>'));
                        });
                        break;
                }
            });

            if (onload) {
                onload();
            }
        };
    }]);
})(window.angular, window.head);
