(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_CONFIRM: 'Are you sure you want to continue?'
        });
    }]);

})(window.angular);