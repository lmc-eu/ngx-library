(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_CURTAINTEXT_SHOW: 'zobrazit více',
            NGX_UI_CURTAINTEXT_HIDE: 'zobrazit méně'
        });
    }]);

})(window.angular);