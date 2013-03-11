(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirmation').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_CONFIRMATION: 'Czy jesteś pewien, że chcesz kontynuować?'
        });
    }]);

})(window.angular);