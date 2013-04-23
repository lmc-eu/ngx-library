(function (angular) {
    'use strict';

    angular.module('ngx.ui.rating').run(['ngxDictionary', function (ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_RATING_CLEAR: 'clear'
        });
    }]);
})(window.angular);
