(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_DATEINPUT_NOW: 'Teraz',
            NGX_UI_DATEINPUT_NEXT: 'Następny',
            NGX_UI_DATEINPUT_PREV: 'Poprzedni',
            NGX_UI_DATEINPUT_CLOSE: 'Koniec',
            NGX_UI_DATEINPUT_DAYS: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
            NGX_UI_DATEINPUT_MONTHS: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
        });
    }]);

})(window.angular);