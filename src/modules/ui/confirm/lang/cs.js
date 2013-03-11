(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_CONFIRM: 'Jste si jisti, že chcete pokračovat?'
        });
    }]);

})(window.angular);