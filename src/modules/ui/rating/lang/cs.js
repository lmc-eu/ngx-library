(function (angular) {
    'use strict';

    angular.module('ngx.ui.rating').run(['ngxDictionary', function (ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_RATING_CLEAR: 'vynulovat'
        });
    }]);
})(window.angular);
