(function(angular) {
    var module = angular.module('ngx.ui.tagsInput', ['ngx.loader']);

    /**
     * Tags input
     */
    module.directive('ngxTagsInput', ['$http', '$filter', 'ngxConfig', 'ngxLoader', function($http, $filter, ngxConfig, ngxLoader) {
        ngxLoader([
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.js',
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.css'
        ]);

        var counter = 0;

        return {
            require: 'ngModel',
            compile: function(element, attrs) {
                // maximum allowed tags count
                var maxCount = parseInt(attrs.ngxTagsMaxCount ? attrs.ngxTagsMaxCount : attrs.ngxTags, 10);

                element = $(element);

                // tagsInput required "id" attribute
                if (!attrs.id) {
                    attrs.$set('id', 'tags_input_' + (counter++));
                }

                // autocomplete definition
                var autocomplete = (attrs.ngxTagsAutocompleteUrl ? {
                    url: attrs.ngxTagsAutocompleteUrl,
                    data: undefined,
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
                } : null);

                // apply tagsInput plugin ... cannot be used in linking phase due to unexpected DOM transformations
                element.tagsInput({
                    autocomplete_url: (autocomplete ? autocomplete.url : undefined),
                    autocomplete: (autocomplete && autocomplete.url ? { source: autocomplete.source, minLength: 2 } : undefined),
                    maxChars: 30,
                    maxCount: parseInt(maxCount, 10),
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

                return function(scope, element, attrs, ctrl) {
                    // string view value <=> array model value
                    ctrl.$parsers.push(function(value) {
                        if (typeof(value) === 'string' && value.length) {
                            var values = value.split(',');

                            // validate maximum allowed tags count
                            if (maxCount) {
                                ctrl.$setValidity('max_count', values.length <= maxCount);
                            }

                            return values;
                        } else {
                            return undefined;
                        }
                    });

                    ctrl.$formatters.push(function(value) {
                        return (angular.isArray(value) ? value.join(',') : '');
                    });

                    element.data('ngx.tagsInput.onchange', function(value) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(value);
                        });
                    });
                };
            }
        };
    }]);
})(angular);