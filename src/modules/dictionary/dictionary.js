(function(angular) {
    'use strict';

    var module = angular.module('ngx.dictionary', ['ngx']);

    /**
     * Dictionary provider
     */
    module.provider('ngxDictionary', function() {
        var dictionary = {},
            currentLanguage = 'en';

        /**
         * Sets dictionary current language
         * @param language
         */
        this.setLanguage = function(language) {
            currentLanguage = language;
            return this;
        };

        /**
         * Adds items to dictionary
         * @param language
         * @param items
         */
        this.addItems = function(language, items) {
            if (angular.isUndefined(dictionary[language])) {
                dictionary[language] = {};
            }

            angular.extend(dictionary[language], items);
            return this;
        };

        /**
         * Factory function.
         * @return {Object}
         */
        this.$get = function() {
            /**
             * Returns items by current language
             * @param language
             */
            return function(key, language) {
                return dictionary[language ? language : currentLanguage][key];
            };
        };
    });

})(window.angular);

