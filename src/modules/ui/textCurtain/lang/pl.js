(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_CURTAINTEXT_SHOW: 'pokaż więcej',
            NGX_UI_CURTAINTEXT_HIDE: 'schowaj'
        });
    }]);

})(window.angular);