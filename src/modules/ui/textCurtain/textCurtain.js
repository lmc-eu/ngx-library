(function (angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.textCurtain', [
        'ngx.dictionary'
    ]);

    /**
     * Text curtain
     *
     * checks attr curtainMinHeight for minimal height
     * if don't exist checks attr curtainMinChars for minimal chars count
     * than shrinks element to curtainHeight
     *
     * @param curtainMinHeight min element height for collapse (number in px)
     * @param curtainMinChars chars count for collapse
     * @param curtainHeight height to collapse (with units)
     * @param curtainText
     * @param curtainTextHide
     * @param curtainHide hide text will be removed
     */
    module.directive('ngxTextCurtain', ['ngxDictionary', function (ngxDictionary) {
        return {
            compile: function (element, attrs) {
                // vars from attrs
                var defaultTx = angular.isDefined(attrs.curtainText) ? attrs.curtainText : ngxDictionary('NGX_UI_CURTAINTEXT_SHOW');
                var defaultTxHide = angular.isDefined(attrs.curtainTextHide) ? attrs.curtainTextHide : ngxDictionary('NGX_UI_CURTAINTEXT_HIDE');
                var minHeight = angular.isDefined(attrs.curtainMinHeight) ? parseInt(attrs.curtainMinHeight, 10) : null;
                var hideFalse = angular.isDefined(attrs.curtainHideFalse) ? true : false;
                var minNumChars = angular.isDefined(attrs.curtainMinChars) ? attrs.curtainMinChars : 800;
                var cHeight = angular.isDefined(attrs.curtainHeight) ? attrs.curtainHeight : "100px";

                // fixed vars
                var button = $('<div class="show-more-desc"><span><a>' + defaultTx + '</a></span></div>');
                var bottomGradient = $('<div class="bottom-grad"></div>');
                var cMaxHeight;
                var bodyTopPosition;
                var elTopPosition;

                element.ready(function () {
                    cMaxHeight = element.height();
                    if ((minHeight && cMaxHeight > minHeight) || (element.text().length > minNumChars)) {
                        element.addClass('short-desc');
                        element.css({
                            height: cHeight,
                            overflow: 'hidden'
                        });
                        element.prepend(bottomGradient);

                        button.find('a').click(function (e) {
                            if (element.css('overflow') == 'hidden') {
                                element.animate({height: cMaxHeight + 20}, 600, function () {
                                    element.css({
                                        overflow: 'visible'
                                    });
                                    element.find('.bottom-grad').remove();
                                    $(e.target).text(defaultTxHide);
                                    if (hideFalse) {
                                        element.next('.show-more-desc').remove();
                                    }
                                });
                            } else {
                                element.prepend(bottomGradient);

                                bodyTopPosition = $('html, body').offset().top * -1;
                                elTopPosition = element.offset().top;
                                if (bodyTopPosition > elTopPosition) {
                                    $('html, body').animate({
                                        scrollTop: (elTopPosition - 20)
                                    }, 'slow');
                                }

                                element.animate({height: cHeight}, 600, function () {
                                    element.css({
                                        overflow: 'hidden'
                                    });

                                    $(e.target).text(defaultTx);

                                });
                            }
                        });

                        element.after(button);
                        return true;
                    }
                });
            }
        };
    }]);

})(window.angular, window.jQuery);