(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.dialog', []);

    /**
     * Dialog
     * @todo init-handler support, for additional jQuery UI dialog configuration outside widget
     */
    module.directive('ngxDialog', ['$timeout', '$rootScope', function($timeout, $rootScope) {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', function($scope, $element) {
                /**
                 * Closes dialog
                 */
                this.close = function() {
                    $element.dialog('close');
                };
            }],
            link: function(scope, element, attrs, ctrl) {
                element.addClass('ngx-dialog').css('display', 'block').hide();

                // init jQueryUI dialog
                var options = {
                    autoOpen: false,
                    width: (attrs.width ? attrs.width : 'auto'),
                    height: (attrs.height ? attrs.height : 'auto'),
                    modal: (attrs.modal ? true : false),
                    title: attrs.title,
                    resizable: false
                };

                element.dialog(options);

                // init dialog trigger
                $(attrs.trigger).click(function(e) {
                    e.preventDefault();
                    element.dialog('open');
                    return false;
                });

                if (attrs.title === undefined) {
                    attrs.$observe('title', function (value) {
                        element.dialog('option', 'title', value);
                    });
                }

                // apply onClose handler
                if (attrs.onclose) {
                    element.dialog('option', 'close', function() {
                        $timeout(function() {
                            scope.$eval(attrs.onclose);
                        }, 0);
                    });
                }

                // close on route change
                $rootScope.$on('$routeChangeSuccess', function() {
                    ctrl.close();
                });
            }
        };
    }]);

    /**
     * Dialog button
     */
    module.directive('ngxDialogButton', ['$parse', function($parse) {
        return {
            require: '^ngxDialog',
            link: function(scope, element, attrs, dialogCtrl) {
                element.addClass('ngx-dialog-button');

                // bind scope method as onclick action
                var expression = attrs.ngxDialogButton;
                element.bind('click', function(e) {
                    // close dialog
                    if (expression === '@close') {
                        dialogCtrl.close();
                    } else {
                        scope.$apply(function() {
                            $parse(expression)(scope, {
                                $dialog: dialogCtrl
                            });
                        });
                    }

                    e.preventDefault();
                    return false;
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
