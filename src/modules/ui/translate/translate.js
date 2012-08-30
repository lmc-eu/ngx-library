(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.translate', ['ngx.dictionary']);

    var markupSymbol;

    module.config(['$interpolateProvider', function($interpolateProvider) {
        markupSymbol = $interpolateProvider.startSymbol();
    }]);

    module.directive('ngxTranslate', ['ngxDictionary', '$interpolate', '$log', function(ngxDictionary, $interpolate) {
        return {
            link: function(scope, element, attrs) {
                var key = (attrs.ngxTranslate ? attrs.ngxTranslate : element.html());
                if (key.length) {
                    var translated = ngxDictionary(key, attrs.language);

                    // handle bindings in translation
                    if (translated.indexOf(markupSymbol) !== -1) {
                        scope.$watch(function() {
                            return $interpolate(translated)(scope);
                        }, function(value) {
                            element.html(value);
                        });
                    }

                    element.html(translated);
                }
            }
        };
    }]);

})(window.angular);
