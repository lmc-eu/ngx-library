(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.addressInput', ['ngx.ui.smap', 'ngx.ui.geomap']);

    /**
     * Address input with autocomplete and reverse geocoding
     * @todo hacks cleanup
     */
    module.directive('ngxAddressInput', ['$timeout', '$window', 'ngxSmap', function($timeout, $window, ngxSmap) {
        return {
            require: 'ngModel',
            compile: function(element, attrs) {
                var hasGeomap = angular.isDefined(attrs.geomap);

                return function(scope, element, attrs, ctrl) {
                    var geomap,
                        allowedTypes = (attrs.allowedTypes ? attrs.allowedTypes.replace(/[ ]+/g, '').split(',') : []),
                        requiredTypes = (attrs.requiredTypes ? attrs.requiredTypes.replace(/[ ]+/g, '').split(',') : []);

                    // parse input value and set into model
                    ctrl.$parsers.push(function(data) {
                        var model;

                        if (angular.isObject(data)) {
                            model = data;

                            // exclude meta when not required
                            if (attrs.meta !== 'true') {
                                delete model.meta;
                            }

                            element.val(data.label);
                        } else if (angular.isString(data) || angular.isUndefined(data)) {
                            model = { label: data };
                        } else {
                            throw 'Invalid address data';
                        }

                        return model;
                    });

                    // set input value from model
                    ctrl.$formatters.push(function(value) {
                        if (angular.isObject(value)) {
                            if (value.coords) {
                                setCoords(value.coords);
                            }
                            return (angular.isString(value.label) ? value.label : '');
                        } else {
                            return '';
                        }
                    });

                    function found(count) {
                        ctrl.$setValidity('found', angular.isNumber(count) ? (count > 0) : count);
                    }

                    ctrl.loading = false;

                    function loading(status) {
                        ctrl.loading = status;
                    }

                    function setGeomap(map) {
                        geomap = map;

                        // when coords geocoding is finished
                        $(geomap).bind('geocodeCoords', function(event, data) {
                            $timeout(function() {
                                ctrl.$setViewValue(data);
                            }, 0);
                        });
                    }

                    function setCoords(coords, query) {
                        loading(true);

                        /** @hack */
                        if (angular.isUndefined(query)) {
                            query = { source: 'addr' };
                        }

                        geomap.geocodeCoords(coords, function(data) {
                            // format label
                            data.label = geomap.formatLabel(data, query);

                            // center map
                            if ($(attrs.geomap).is(':visible')) {
                                geomap.setCenter(data.coords, {
                                    zoom: true,
                                    card: data.label
                                });
                            }

                            loading(false);
                            found(true);

                            angular.forEach(requiredTypes, function (requiredType) {
                                ctrl.$setValidity(requiredType, data && data[requiredType]);
                            });
                        });
                    }

                    // use existing geomap element service if available
                    if (hasGeomap) {
                        attrs.$observe('geomap', function(value) {
                            setGeomap(angular.element(value).data('ngx.ui.geomap'));
                        });
                    } else {
                        // otherwise use Seznam geomap
                        setGeomap(ngxSmap());
                    }

                    // bind autocomplete
                    element.autocomplete({
                        delay: 500,
                        source: function(request, response) {
                            loading(true);
                            scope.$apply();

                            geomap.geocodeQuery(request.term, function(results) {
                                var $results = [];

                                angular.forEach(results, function(item) {
                                    // allow only address types defined in attribute
                                    if (!allowedTypes.length || allowedTypes.indexOf(item.type) > -1) {
                                        $results.push(item);
                                    }
                                });

                                found($results.length);

                                response($results);
                                loading(false);
                                scope.$apply();
                            });
                        },
                        select: function(event, ui) {
                            setCoords(ui.item.coords, ui.item);
                            scope.$apply();
                            return false;
                        }
                    });

                    $($window).click(function() {
                        element.autocomplete('close');
                    });
                };
            }
        };
    }]);
})(window.angular, window.jQuery, window);