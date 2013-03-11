(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_CONFIRM: 'Czy jesteś pewien, że chcesz kontynuować?'
        });
    }]);

})(window.angular);