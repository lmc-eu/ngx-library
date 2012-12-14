(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_DATEINPUT_NOW: 'Now',
            NGX_UI_DATEINPUT_NEXT: 'Next',
            NGX_UI_DATEINPUT_PREV: 'Previous',
            NGX_UI_DATEINPUT_CLOSE: 'Close',
            NGX_UI_DATEINPUT_DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            NGX_UI_DATEINPUT_MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        });
    }]);

})(window.angular);