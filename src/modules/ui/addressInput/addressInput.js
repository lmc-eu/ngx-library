(function(angular, $, window) {
    'use strict';

    var module = angular.module('ngx.ui.addressInput', ['ngx.ui.smap', 'ngx.ui.geomap']);

    /**
     * Address input with autocomplete and reverse geocoding
     * @todo hacks cleanup
     */
    module.directive('ngxAddressInput', ['$timeout', 'ngxSmap', function($timeout, ngxSmap) {
        return {
            require: 'ngModel',
            compile: function(element, attrs) {
                var hasGeomap = angular.isDefined(attrs.geomap);

                return function(scope, element, attrs, ctrl) {
                    var strict,      // is strict? .. require address by street number
                        geomap;

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
                            model = (strict ? undefined : { label: data });
                        } else {
                            throw 'Invalid address data';
                        }

                        // valid by address number
                        if (strict) {
                            ctrl.$setValidity('number', model && model.number ? true : false);
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

                    function setStrictMode(value) {
                        if (strict === value) {
                            return;
                        }

                        strict = value;

                        // update validation state
                        ctrl.$setValidity('number', !strict);
                        found(true);

                        // close possible opened autocomplete
                        element.autocomplete('close');

                        // force search when non-strict mode
                        if (!strict) {
                            $timeout(function() {
                                element.autocomplete('search');
                            }, 0);
                        }
                    }

                    function found(count, byNumber) {
                        ctrl.$setValidity('found', angular.isNumber(count) ? (count > 0) : count);
                        ctrl.$setValidity('found_number', angular.isDefined(byNumber) ? (angular.isNumber(byNumber) ? (byNumber > 0) : byNumber) : count);
                    }

                    // strict mode by default
                    setStrictMode(true);

                    // watch strict flag attribute expression
                    if (attrs.strict) {
                        scope.$watch(attrs.strict, function(value) {
                            setStrictMode(value);
                        });
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
                                var foundCount = results.length;

                                angular.forEach(results, function(item) {
                                    // ignore addresses without number in strict mode
                                    if (strict && item.type !== 'number') {
                                        return;
                                    }

                                    // ignore ČR in strict mode .. @hack
                                    if (!strict && item.label.match(/Česká republika/)) {
                                        return;
                                    }

                                    // allow only these address types
                                    if (item.type === 'street' || item.type === 'city' || item.type === 'number' || item.type === 'country') {
                                        $results.push(item);
                                    }
                                });

                                if (strict) {
                                    found(foundCount, $results.length);
                                }

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

                    $(window).click(function() {
                        element.autocomplete('close');
                    });
                };
            }
        };
    }]);
})(window.angular, window.jQuery, window);