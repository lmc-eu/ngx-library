(function(angular) {
    'use strict';

    var module = angular.module('ngx.loader', ['ngx']),
        loaded = [];

    module.factory('ngxLoader', ['ngxConfig', function(ngxConfig) {
        /**
         * Loads external js/css files
         * @param files
         */
        return function(files) {
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
                    // stylesheet
                    angular.element('head').append(angular.element('<link rel="stylesheet" type="text/css" href="' + file + '"></link>'));
                } else if (file.match(/\.js$/i)) {
                    // script
                    angular.element('head').append(angular.element('<script type="text/javascript" src="' + file + '"></script>'));
                } else {
                    throw new Error('File type not supported');
                }

                loaded.push(file);
            });
        };
    }]);
})(window.angular);
