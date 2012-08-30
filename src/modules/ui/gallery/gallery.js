(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.gallery', ['ngx.config', 'ngx.ui.lightbox']);

    /**
     * Gallery directive
     */
    module.directive('ngxGallery', ['$timeout', 'ngxConfig', function($timeout, ngxConfig) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: ngxConfig.templatesPath + 'ui/gallery/gallery.html',
            transclude: true,
            controller: ['$scope', function($scope) {
                if (!angular.isArray($scope.items)) {
                    $scope.items = [];
                }

                /**
                 * Adds new item into gallery
                 * @param type
                 * @param data
                 */
                this.add = function(type, data) {
                    data.type = type;
                    $scope.items.push(data);
                };
            }],
            scope: {
                items: '=ngxGallery'
            },
            link: function(scope, element) {
                /**
                 * Returns item src
                 * @param item
                 * @return {*}
                 */
                scope.src = function(item) {
                    return (item.thumbSrc ? item.thumbSrc : item.src);
                };

                // @hack remove transcluded content from DOM
                $(element).find('div[ng-transclude]').remove();

                // onlink event
                $timeout(function() {
                    element.triggerHandler('link', [element]);
                }, 0);
            }
        };
    }]);

    /**
     * Gallery item definition
     */
    module.directive('ngxGalleryItem', function() {
        return {
            restrict: 'EA',
            require: '^ngxGallery',
            replace: true,
            link: function(scope, element, attrs, ctrl) {
                var item = {};

                angular.forEach(['src', 'thumbSrc', 'title'], function(key) {
                    if (attrs[key]) {
                        item[key] = attrs[key];
                    }
                });

                ctrl.add(attrs.type ? attrs.type : 'image', item);
            }
        };
    });

    /**
     * Gallery toggle
     */
    module.directive('ngxGalleryToggle', function() {
        return {
            replace: true,
            template: '<a class="ngx-gallery-toggle" ng-click="toggle()" ng-transclude></a>',
            transclude: true,
            link: function(scope, element, attrs) {
                var gallery, toggleText;

                // when gallery is linked
                $(attrs.ngxGalleryToggle).bind('link', function(e, g) {
                    gallery = g.css('max-height', g.height()).addClass('collapsed');
                });

                /**
                 * Toggle gallery
                 */
                scope.toggle = function() {
                    gallery.toggleClass('collapsed');
                    toggleText = element.html();
                    element.html(attrs.toggleText);
                    attrs.$set('toggleText', toggleText);
                };
            }
        };
    });

})(window.angular, window.jQuery);
