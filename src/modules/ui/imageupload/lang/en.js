(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'preview',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Drag image here',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'or...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'choose from your disk',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maximum allowed dimensions are {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Submit',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Cancel',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Invalid image',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Error processing image or invalid image'
        });
    }]);

})(window.angular);

