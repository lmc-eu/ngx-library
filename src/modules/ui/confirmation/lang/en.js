(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirmation').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_CONFIRMATION: 'Are you sure you want to continue?'
        });
    }]);

})(window.angular);