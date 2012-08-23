(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.scrollTo', ['ngx']);

    /**
     * Scroll to on click
     */
    module.directive('ngxScrollTo', function() {
        return function(scope, element, attrs) {
            element.bind('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $(attrs.ngxScrollTo).offset().top + (attrs.scrollOffset ? parseInt(attrs.scrollOffset, 10) : 0) }, 600);
                return false;
            });
        };
    });

})(window.angular, window.jQuery);
