(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_CURTAINTEXT_SHOW: 'show more',
            NGX_UI_CURTAINTEXT_HIDE: 'hide'
        });
    }]);

})(window.angular);