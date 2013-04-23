(function (angular) {
    'use strict';

    var module = angular.module('ngx.ui.rating', [
        'ngx.config', 'ngx.dictionary', 'ngx.utils'
    ]);

    /**
     * @param {number} level            only required param
     * @param {number=} max             default is 5
     * @param {string=} symbol          default is \u2605 - black star
     * @param {boolean=} readOnly       default is false
     * @param {boolean=} clearable      default is false
     * @param {string=} clearText       default is clear for "english" and "vynulovat" for czech
     * @param {boolean=} changeOnHover  default is false
     */
    module.directive('ngxRating', [
        'ngxConfig', 'ngxDictionary', 'ngxUtils',
        function (ngxConfig, ngxDictionary, ngxUtils) {
            var SELECTED_CLASS = 'ngx-rating-selected';
            var HOVER_CLASS = 'ngx-rating-hover';

            return {
                restrict: 'EA',
                templateUrl: ngxConfig.templatesPath + 'ui/rating/rating.html',
                replace: true,
                scope: {
                    level: '=',
                    max: '@',
                    symbol: '@',
                    readOnly: '@',
                    clearable: '@',
                    clearText: '@',
                    changeOnHover: '@'
                },
                link: function (scope, elem, attrs) {
                    scope.styles = [];
                    attrs.$observe('max', function (max) {
                        scope.max = parseInt(max || 5, 10);
                        for (var i = 0; i < scope.max; i++) {
                            var style = {};
                            style[SELECTED_CLASS] = false;
                            style[HOVER_CLASS] = false;
                            scope.styles.push(style);
                        }
                    });
                    attrs.$observe('symbol', function (symbol) {
                        scope.symbol = ngxUtils.noUndefined(symbol, '\u2605');  // black star
                    });
                    attrs.$observe('readOnly', function (readOnly) {
                        scope.readOnly = angular.isDefined(readOnly);
                    });
                    attrs.$observe('clearable', function (clearable) {
                        scope.clearable = angular.isDefined(clearable);
                    });
                    attrs.$observe('clearText', function (clearText) {
                        scope.clearText = ngxUtils.noUndefined(
                            clearText,
                            ngxDictionary('NGX_UI_RATING_CLEAR')
                        );
                    });
                    attrs.$observe('changeOnHover', function (changeOnHover) {
                        scope.changeOnHover = angular.isDefined(changeOnHover);
                    });

                    scope.$watch('level', function (level) {
                        if (scope.changeOnHover) {
                            scope.oldLevel = ngxUtils.noUndefined(
                                scope.oldLevel,
                                level
                            );
                        }

                        updateSelectedStyles(level - 1);
                    });

                    scope.enter = function (level) {
                        if (scope.readOnly) return;

                        if (scope.changeOnHover) {
                            scope.level = level + 1;
                        }

                        angular.forEach(scope.styles, function (style, i) {
                            style[HOVER_CLASS] = i <= level;
                        });
                    };

                    scope.leave = function () {
                        if (scope.readOnly) return;

                        if (scope.changeOnHover) {
                            scope.level = scope.oldLevel;
                        }

                        angular.forEach(scope.styles, function (style) {
                            style[HOVER_CLASS] = false;
                        });
                    };

                    scope.select = function (level) {
                        if (scope.readOnly) return;

                        if (level === null) {
                            level = -1;
                        }

                        scope.level = level + 1;
                        if (scope.changeOnHover) {
                            scope.oldLevel = scope.level;
                        }
                        updateSelectedStyles(level);
                    };


                    function updateSelectedStyles(level) {
                        angular.forEach(scope.styles, function (style, i) {
                            style[SELECTED_CLASS] = i <= level;
                        });
                    }
                }
            };
        }
    ]);
})(window.angular);
