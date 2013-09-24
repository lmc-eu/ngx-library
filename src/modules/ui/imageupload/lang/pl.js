(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'podgląd',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Upuścić obraz',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'lub możecie...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'wybrać z komputera',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maksymalne wymiary obrazu są {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Wgraj',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Anulować',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Nieprawidłowy obraz',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Błąd przy przetwarzaniu obrazu lub nieprawidłowy obraz',
            NGX_UI_IMAGEUPLOAD_INCORRECT_IMAGE_SIZE: 'Obraz nie spełnia minimalne wymiary. Minimalne wymiary: %sx%s.'
        });
    }]);

})(window.angular);