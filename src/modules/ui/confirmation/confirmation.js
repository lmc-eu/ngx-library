(function(angular, $window) {
    'use strict';

    var module = angular.module('ngx.ui.confirmation', ['ngx.dictionary']);

    /**
     * On click confirmation
     */
    module.directive('ngxConfirmation', ['ngxDictionary', function(ngxDictionary) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var message = attrs.ngxConfirmationMessage ? attrs.ngxConfirmationMessage : ngxDictionary('NGX_UI_CONFIRMATION');
                element.bind('click', function(event) {
                    if(!$window.confirm(message)) {
                        event.preventDefault();
                    }
                });
            }
        };
    }]);

})(window.angular, window);