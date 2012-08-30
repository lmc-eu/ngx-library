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
         * @param language
         */
        function ngxDictionary(key, language) {
            return dictionary[language ? language : currentLanguage][key];
        }

        /**
         * Sets/gets dictionary current language
         * @param [language]
         */
        ngxDictionary.language = function(language) {
            if (language) {
                currentLanguage = language;
            }
            return currentLanguage;
        };

        /**
         * Sets/gets items to/from dictionary
         * @param language
         * @param [items]
         */
        ngxDictionary.items = function(language, items) {
            if (items) {
                if (angular.isUndefined(dictionary[language])) {
                    dictionary[language] = {};
                }
                angular.extend(dictionary[language], items);
            }
            return dictionary[language];
        };

        return ngxDictionary;
    });

})(window.angular);

