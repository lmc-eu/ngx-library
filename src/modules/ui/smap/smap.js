(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.smap', ['ngx.smap']);

    /**
     * SMap directive
     */
    module.directive('ngxSmap', ['ngxSmap', function(ngxSmap) {
        return {
            link: function(scope, element, attrs) {
                element.addClass('ngx-smap');

                // create map
                var map = ngxSmap(element[0]);
                map.create({
                    controls: attrs.controls
                });

                // assign to element data
                element.data('ngx.ui.geomap', map);

                function setCoords(coords) {
                    map.setCenter(coords, {
                        zoom: true,
                        marker: true
                    });
                }

                // coords supplied in attribute
                attrs.$observe('coords', function(coords) {
                    if (coords) {
                        setCoords(coords);
                    }
                });
            }
        };
    }]);

})(window.angular);
