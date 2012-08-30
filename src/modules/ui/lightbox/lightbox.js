(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.lightbox', ['ngx.config', 'ngx.loader']);

    /**
     * Lightbox directive
     */
    module.directive('ngxLightbox', ['ngxConfig', 'ngxLoader', function(ngxConfig, ngxLoader) {
        var deps = [
            ngxConfig.libsPath + 'jquery.fancybox/jquery.fancybox.js',
            ngxConfig.libsPath + 'jquery.fancybox/css/fancybox.css'
        ];

        return {
            link: function(scope, element, attrs) {
                // group tag
                if (attrs.ngxLightbox) {
                    element.attr('rel', attrs.ngxLightbox);
                }

                ngxLoader(deps, function() {
                    $(element).fancybox({
                        onStart: function(items, index, options) {
                            var arrowStyle = {
                                height: '100%',
                                bottom: 0
                            };

                            angular.extend(options, {
                                href: (attrs.href || attrs.src),
                                title: attrs.title,
                                titlePosition: 'inside',
                                speedIn: 150,
                                speedOut: 150
                            });

                            // autoset options by attributes
                            if (options.href.match(/youtube\.com/)) {
                                // youtube video
                                angular.extend(options, {
                                    type: 'swf',
                                    href: attrs.href + '?autoplay=1&fs=1',        // AS3 + autoplay + fullscreen
                                    width: 661,
                                    height: 481,
                                    swf: {
                                        wmode: 'transparent',
                                        allowfullscreen: true
                                    }
                                });
                                angular.extend(arrowStyle, {
                                    height: '40%',
                                    bottom: '30%'
                                });

                            } else if (options.href.match(/(jpg|png|gif|bmp)$/) || options.href.match(/^data:image\//)) {
                                // image
                                options.type = 'image';

                            } else {
                                // iframe
                                angular.extend(options, {
                                    type: 'iframe',
                                    width: '90%',
                                    height: '95%'
                                });
                            }

                            // override default options from attributes
                            angular.forEach(['width', 'height', 'title', 'type'], function(attr) {
                                if (attrs[attr]) {
                                    options[attr] = attrs[attr];
                                }
                            });

                            $('#fancybox-left').css(arrowStyle);
                            $('#fancybox-right').css(arrowStyle);

                            return options;
                        }
                    });
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
