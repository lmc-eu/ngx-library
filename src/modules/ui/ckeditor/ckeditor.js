// initialize CKEditor base path global variable
window.CKEDITOR_BASEPATH = '';

(function(angular, window) {
    'use strict';

    var module = angular.module('ngx.ui.ckeditor', ['ngx.config', 'ngx.loader']);

    /**
     * WYSIWYG editor
     */
    module.directive('ngxCkeditor', ['$parse', 'ngxConfig', 'ngxLoader', function($parse, ngxConfig, ngxLoader) {
        window.CKEDITOR_BASEPATH = ngxConfig.libsPath + 'ckeditor/';
        var deps = [window.CKEDITOR_BASEPATH + 'ckeditor.js'];

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.hide();
                ngxLoader(deps, function() {
                    element.show();
                    // editor instance
                    var editor = window.CKEDITOR.replace(element[0], {
                        toolbar: [['Bold', 'BulletedList', 'Link']],
                        toolbarLocation: (attrs.toolbarLocation ? attrs.toolbarLocation : 'bottom'),
                        toolbarCanCollapse: false,
                        removePlugins: 'elementspath',
                        extraPlugins : 'autogrow',
                        autoGrow_onStartup: true,
                        autoGrow_minHeight: 150,
                        resize_enabled: false,
                        forcePasteAsPlainText: true,
                        linkShowAdvancedTab: false,
                        linkShowTargetTab: false,
                        entities: false
                    }, element.val());

                    editor.on('contentDom', function() {
                        // trigger original input focus/blur event callbacks on plugin input element
                        angular.forEach(['focus', 'blur'], function(event) {
                            editor.on(event, function() {
                                element.triggerHandler(event);
                            });
                        });

                        function update() {
                            var content = editor.getData().replace(/<p>\n\t/gi, '<p>').replace(/\n$/, '');       // cleanup CKEditor result
                            $parse(attrs.ngModel).assign(scope, content);
                            scope.$apply();
                        }
                        editor.document.on('keyup', update);
                        editor.on('focus', update);
                        editor.on('blur', update);
                        editor.on('afterCommandExec', update);
                    });

                    ctrl.$parsers.push(function(value) {
                        editor.setData(value);
                    });
                });
            }
        };
    }]);
})(window.angular, window);