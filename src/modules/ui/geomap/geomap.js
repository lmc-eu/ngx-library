(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.geomap', ['ngx.ui.smap']);

    /**
     * Geomap directive
     */
    module.directive('ngxGeomap', ['$compile', function($compile) {
        return {
            link: function(scope, element, attrs) {
                attrs.$set('ngxGeomap', undefined);
                attrs.$set('ngxSmap', '');
                $compile(element)(scope);
            }
        };
    }]);
})(window.angular);
