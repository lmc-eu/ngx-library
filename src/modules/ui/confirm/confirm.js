(function(angular, $window) {
    'use strict';

    var module = angular.module('ngx.ui.confirm', ['ngx.dictionary']);

    /**
     * On click confirmation
     */
    module.directive('ngxConfirm', ['ngxDictionary', function(ngxDictionary) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var message = attrs.ngxConfirm ? attrs.ngxConfirm : ngxDictionary('NGX_UI_CONFIRM');
                element.bind('click', function(event) {
                    if(!$window.confirm(message)) {
                        event.preventDefault();
                    }
                });
            }
        };
    }]);

})(window.angular, window);