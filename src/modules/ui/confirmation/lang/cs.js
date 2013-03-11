(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirmation').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_CONFIRMATION: 'Jste si jisti, že chcete pokračovat?'
        });
    }]);

})(window.angular);