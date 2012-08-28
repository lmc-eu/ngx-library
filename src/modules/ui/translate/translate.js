(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.translate', ['ngx', 'ngx.dictionary']);

    module.directive('ngxTranslate', ['ngxDictionary', '$compile', function(ngxDictionary, $compile) {
        return {
            link: function(scope, element, attrs) {
                var key = (attrs.ngxTranslate ? attrs.ngxTranslate : element.html());
                if (key.length) {
                    element.html(ngxDictionary(key, attrs.language));
//                    if (key.indexOf('{{') !== -1) {
//                        $compile(element)(scope);
//                    }
                }
            }
        };
    }]);

})(window.angular);
