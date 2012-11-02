(function(angular, Array) {
    'use strict';

    angular.module('ngx', [
        'ngx.config',
        'ngx.date',
        'ngx.dictionary',
        'ngx.loader',
        'ngx.smap',
        'ngx.utils',
        'ngx.ui.addressInput',
        'ngx.ui.checkboxlist',
        'ngx.ui.ckeditor',
        'ngx.ui.dateInput',
        'ngx.ui.dialog',
        'ngx.ui.gallery',
        'ngx.ui.geomap',
        'ngx.ui.hashtagInput',
        'ngx.ui.imageupload',
        'ngx.ui.invalid',
        'ngx.ui.lightbox',
        'ngx.ui.scrollTo',
        'ngx.ui.smap',
        'ngx.ui.tagsInput',
        'ngx.ui.timeInput',
        'ngx.ui.tooltip',
        'ngx.ui.translate',
        'ngx.ui.validate',
        'ngx.ui.wwwInput',
        'ngx.ui.wysiwyg'
    ]);

    // missing ECMAScript functions
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(search) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === search) {
                    return i;
                }
            }
            return -1;
        };
    }

})(window.angular, Array);
