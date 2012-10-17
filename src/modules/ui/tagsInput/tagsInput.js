(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.tagsInput', ['ngx.config', 'ngx.loader']);

    /**
     * Tags input
     */
    module.directive('ngxTagsInput', ['$http', '$filter', '$timeout', 'ngxConfig', 'ngxLoader', function($http, $filter, $timeout, ngxConfig, ngxLoader) {
        var deps = [
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.js',
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.css'
        ];

        var counter = 0;

        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                // minimum/maximum allowed tags count
                var minCount = (attrs.min ? parseInt(attrs.min, 10) : null),
                    maxCount = (attrs.max ? parseInt(attrs.max, 10) : null);

                element = $(element);

                // tagsInput required "id" attribute
                if (!attrs.id) {
                    attrs.$set('id', 'tags_input_' + (counter++));
                }

                // autocomplete definition
                var autocomplete;
                if (attrs.autocompleteUrl || attrs.autocompleteSource) {
                    autocomplete = {
                        url: (attrs.autocompleteUrl ? attrs.autocompleteUrl : true),
                        data: (attrs.autocompleteSource ? scope.$eval(attrs.autocompleteSource) : undefined),
                        source: function(request, response) {
                            // load data
                            if (autocomplete.data === undefined) {
                                $http.get(autocomplete.url)
                                    .success(function(data) {
                                        autocomplete.data = data;
                                        response(autocomplete.filter(request.term));
                                    });
                            } else {
                                response(autocomplete.filter(request.term));
                            }
                        },
                        filter: function(term) {
                            return $filter('filter')(autocomplete.data, term);
                        }
                    };
                }

                ngxLoader(deps, function() {
                    // apply tagsInput plugin ... cannot be used in linking phase due to unexpected DOM transformations
                    element.tagsInput({
                        autocomplete_url: (autocomplete ? autocomplete.url : undefined),
                        autocomplete: (autocomplete ? {
                            source: autocomplete.source,
                            minLength: (attrs.autocompleteMinLength ? parseInt(attrs.autocompleteMinLength, 10) : 2)
                        } : undefined),
                        maxChars: 30,
                        maxCount: (maxCount ? maxCount : null),
                        width: null,
                        height: null,
                        defaultText: '',
                        onChange: function(tagsInput) {
                            var handler = element.data('ngx.tagsInput.onchange');
                            if (handler) {
                                handler($(tagsInput).val());
                            }
                        }
                    });

                    // trigger original input focus/blur event callbacks on plugin input element
                    var tagElement = $('#' + attrs.id + '_tag');
                    angular.forEach(['focus', 'blur'], function(event) {
                        tagElement.bind(event, function() {
                            element.triggerHandler(event, [this]);
                        });
                    });

                    // string view value <=> array model value
                    ctrl.$parsers.push(function(value) {
                        var values;

                        if (typeof(value) === 'string' && value.length) {
                            values = value.split(',');
                        }

                        // validate allowed tags count
                        if (minCount) {
                            ctrl.$setValidity('min', (values && values.length >= minCount));
                        }
                        if (maxCount) {
                            ctrl.$setValidity('max', (values ? values.length <= maxCount : true));
                        }
                        return values;
                    });

                    ctrl.$render = function() {
                        if (ctrl.$modelValue) {
                            element.importTags(ctrl.$modelValue.join(','));
                        }
                    };

                    element.data('ngx.tagsInput.onchange', function(value) {
                        $timeout(function() {
                            ctrl.$setViewValue(value);
                        }, 0);
                    });
                });
            }
        };
    }]);
})(window.angular, window.jQuery);