(function(angular) {
    'use strict';

    var module = angular.module('ngx.dictionary', []);

    /**
     * Dictionary provider
     */
    module.factory('ngxDictionary', function($locale) {
        var dictionary = {},
            currentLanguage = $locale.id.split('-')[0];

        /**
         * Returns items by current language
         * @param key
         * @param language
         * @param params array of string elements for replace %s, depends on order
         */
        function ngxDictionary(key, language, params) {
            var string = dictionary[language ? language : currentLanguage][key];
            if(params !== undefined) {
                var re = /%s/;
                angular.forEach(params, function(param) {
                    string = string.replace(re, param);
                });
            }
            return string;
        }

        /**
         * Sets dictionary current language
         * @param language
         */
        ngxDictionary.setLanguage = function(language) {
            currentLanguage = language;
            return this;
        };

        /**
         * Adds items to dictionary
         * @param language
         * @param items
         */
        ngxDictionary.addItems = function(language, items) {
            if (angular.isUndefined(dictionary[language])) {
                dictionary[language] = {};
            }

            angular.extend(dictionary[language], items);
            return this;
        };

        return ngxDictionary;
    });

})(window.angular);

