(function(angular, $, window) {
    'use strict';

    var module = angular.module('ngx.smap', []);

    module.config(function() {
        // some Seznam library disables console debug mode :-/
        window.console.DEBUG = true;
    });

    /**
     * Seznam map service
     */
    module.factory('ngxSmap', function() {
        var SMap = window.SMap;

        if (SMap === undefined) {
            throw 'Seznam map API is not loaded, see http://api4.mapy.cz/view?page=instruction';
        }

        function NgxSmap(wrapper) {
            var smap, card, markerLayer, geocoder,
                self = this;

            // api cache
            var cache = {
                coords: {},
                query: {}
            };

            // SMap source code list
            var typeList = {
                'stre': 'street',
                'addr': 'number',
                'muni': 'city',
                'dist': 'district',
                'regi': 'region',
                'ward': 'ward',
                'coun': 'country',
                'base': 'base',
                'firm': 'firm'
            };

            // filter by source
            var typeFilter = {
                'street': '^ulice ',
                'number': '^č\\.p\\. ',
                'city': '^obec ',
                'district': '^okres ',
                'region': '^(kraj( Hlavní město)?|provincie) ',
                'ward': '^(čtvrť|část obce) '
            };

            function smapCoords(coords) {
                if (typeof(coords) === 'object') {
                    // convert into SMap.Coords
                    if (!coords.toWGS84) {
                        return SMap.Coords.fromWGS84(coords.lon !== undefined ? coords.lon : coords[0], coords.lat !== undefined ? coords.lat : coords[1]);
                    } else {
                        return coords;
                    }
                } else if (typeof(coords) === 'string') {
                    coords = coords.split(',');
                    return smapCoords({
                        lat: coords[0],
                        lon: coords[1]
                    });
                } else {
                    return undefined;
                }
            }

            // initialize map
            this.create = function(options) {
                smap = new SMap(wrapper);
                smap.addDefaultLayer(SMap.DEF_BASE).enable();

                if (!options) {
                    options = {};
                }

                if (options.controls !== 'off') {
                    smap.addDefaultControls();
                }

                // card
                card = new SMap.Card(230);
                $(card.getBody()).css('padding-right', '18px');

                // marker layer
                markerLayer = new SMap.Layer.Marker();
                smap.addLayer(markerLayer);
                markerLayer.enable();

                // bind map-click event on control click event
                smap.getSignals().addListener(window, 'map-click', function(signal) {
                    $(self).triggerHandler('click', [SMap.Coords.fromEvent(signal.data.event, smap)]);
                });
            };

            // geocode by query
            this.geocodeQuery = function(query, callback) {
                // cached
                if (cache.query[query]) {
                    callback(cache.query[query]);

                    // query api
                } else {
                    // abort previous request
                    if (geocoder) {
                        geocoder.abort();
                    }

                    geocoder = new SMap.Geocoder(query, function(geocoder) {
                        var results = geocoder.getResults();
                        results = (results[0] && results[0].results && results[0].results.length ? results[0].results : []);

                        angular.forEach(results, function(item, key) {
                            // append item type
                            results[key].type = typeList[item.source];

                            // format coords
                            results[key].coords = self.formatCoords(item.coords);
                        });

                        cache.query[query] = results;
                        callback(results);
                    });
                }
            };

            // (reverse) geocode by coords
            this.geocodeCoords = function(coords, callback) {
                coords = smapCoords(coords);

                // onfinish callbacks
                function callbacks(data) {
                    // trigger callback
                    if (callback) {
                        callback(data);
                    }

                    // trigger global 'geocodeCoords' event
                    $(self).triggerHandler('geocodeCoords', [data]);
                }

                // cached
                var ckey = coords.x + '-' + coords.y;
                if (cache.coords[ckey]) {
                    callbacks(cache.coords[ckey]);
                    return;
                }

                // reverse geocode
                var geocoder = new SMap.Geocoder.Reverse(coords, function(geocoder) {
                    var results = geocoder.getResults(),
                        coords = results.coords.toWGS84();

                    // result data
                    var data = {
                        coords: self.formatCoords(coords),
                        label: results.label,
                        meta: {}
                    };

                    // create address fields from items[]
                    var type, label;
                    angular.forEach(results.items, function(item) {
                        type = typeList[item.type];

                        if (!type) {
                            return;
                        }

                        label = item.name;

                        // apply filter by type
                        if (typeFilter[type]) {
                            label = label.replace(new RegExp(typeFilter[type], 'i'), '');
                        }

                        data[type] = label;

                        // include meta
                        data.meta[type] = {
                            id: item.id,
                            coords: self.formatCoords(item.coords)
                        };

                        switch (type) {
                            case 'number':
                                // parse land registry and house number
                                var parts = label.split('/');
                                data.registry_number = parts[0];
                                data.house_number = (parts[1] ? parts[1] : undefined);
                                break;

                            case 'city':
                                // zip code is not included in items, try parse it from city label
                                try {
                                    var match = new RegExp(', ([0-9]{3}) ([0-9]{2}) ' + label).exec(results.label);
                                    if (match) {
                                        data.zip_code = match[1] + ' ' + match[2];
                                    }
                                } catch (e) {}
                                break;
                        }
                    });

                    // if street field is empty, set ward name as street name
                    if (!data.street && data.ward) {
                        data.street = data.ward;
                    }

                    cache.coords[ckey] = data;
                    callbacks(data);
                });
            };

            // sets map center with additional actions (zoom, marker, card)
            this.setCenter = function(coords, options) {
                if (!coords) {
                    return;
                }

                coords = smapCoords(coords);

                // zoom into coords
                if (options.zoom) {
                    smap.setCenterZoom(coords, (options.zoom === true ? 15 : options.zoom));
                } else {
                    smap.setCenter(coords);
                }

                // add marker
                if (options.marker) {
                    markerLayer.removeAll();
                    markerLayer.addMarker(new SMap.Marker(coords, 'marker'));
                }

                // add card with label
                if (options.card) {
                    smap.addCard(card, coords);
                    card.getBody().innerHTML = options.card;
                }
            };

            // formats label by query and reverse geocoded data
            this.formatLabel = function(data, query) {
                // format only when firm or address
                if (query.source === 'firm' || query.source === 'addr') {
                    var label = (data.street ? data.street : data.ward) + ' ' + data.number;

                    if (data.city) {
                        label += ', ' + (data.zip_code ? data.zip_code + ' ' : '') + data.city;
                    }
                    if (data.country) {
                        label += ', ' + data.country;
                    }

                    return label;
                } else {
                    // otherwise use query label
                    return query.label;
                }
            };

            // formats coords into lon/lat WGS84 format
            this.formatCoords = function(coords) {
                var $coords = smapCoords(coords).toWGS84();
                return {
                    lon: $coords[0],
                    lat: $coords[1]
                };
            };
        }

        return function(wrapper) {
            return new NgxSmap(wrapper);
        };
    });

})(window.angular, window.jQuery, window);
