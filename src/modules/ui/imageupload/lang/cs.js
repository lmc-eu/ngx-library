(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'náhled',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Sem přetáhněte obrázek',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'nebo můžete...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'vybrat z počítače',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maximální povolené rozměry obrázku jsou {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Nahrát',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Zrušit',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Neplatný obrázek',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Chyba při zpracování obrázku anebo neplatný obrázek'
        });
    }]);

})(window.angular);

