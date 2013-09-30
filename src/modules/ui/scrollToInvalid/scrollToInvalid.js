(function (angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.scrollToInvalid', []);

    /**
     * first ngx invalid element visibility
     */
    module.directive('ngxScrollToInvalid', ['$window', function ($window) {
        return {
            link: function (scope, element) {
                element.bind('click', function () {
                    setTimeout(function() {
                        var visibleInvalid = $('.ngx-invalid:visible');
                        if (visibleInvalid.length > 0) {
                            var previousElement = visibleInvalid.eq(0).prevAll('input, textarea, select'),
                                height = (previousElement.length === 0) ? 50 : previousElement.height() + 20;
                            $window.scrollTo(0, visibleInvalid.eq(0).offset().top - height);
                        }
                    });
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
