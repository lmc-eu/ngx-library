(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_DATEINPUT_NOW: 'Nyní',
            NGX_UI_DATEINPUT_NEXT: 'Další',
            NGX_UI_DATEINPUT_PREV: 'Předchozí',
            NGX_UI_DATEINPUT_CLOSE: 'Zavřít',
            NGX_UI_DATEINPUT_DAYS: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
            NGX_UI_DATEINPUT_MONTHS: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
        });
    }]);

})(window.angular);