(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.wysiwyg', ['ngx.ui.ckeditor']);

    /**
     * WYSIWYG editor
     */
    module.directive('ngxWysiwyg', ['$compile', function($compile) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs) {
                var toolbar = (attrs.location ? attrs.location : 'bottom');
                attrs.$set('ngxWysiwyg', undefined);
                attrs.$set('ngxCkeditor', '');
                attrs.$set('toolbarLocation', toolbar);
                $compile(element)(scope);
            }
        };
    }]);

})(window.angular);