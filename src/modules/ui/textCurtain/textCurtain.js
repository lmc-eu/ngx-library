(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.textCurtain', []);

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
     */
    module.directive('ngxTextCurtain', function () {
        return {
            compile: function (element, attrs) {
                // vars from attrs
                var defaultTx = angular.isDefined(attrs.curtainText) ? attrs.curtainText : 'show more';
                var defaultTxHide = angular.isDefined(attrs.curtainTextHide) ? attrs.curtainTextHide : 'hide';
                var minHeight = angular.isDefined(attrs.curtainMinHeight) ? parseInt(attrs.curtainMinHeight, 10) : null;
                var minNumChars = angular.isDefined(attrs.curtainMinChars) ? attrs.curtainMinChars : 800;
                var cHeight = angular.isDefined(attrs.curtainHeight) ? attrs.curtainHeight : "100px";
                
                // fixed vars
                var button = $('<div class="showMoreDesc"><span><a>' + defaultTx + '</a></span></div>');
                var bottomGradient = $('<div class="bottomGrad"></div>');
                var cMaxHeight;
                var bodyTopPosition;
                var elTopPosition;

                element.ready(function() {
                    cMaxHeight = element.height();
                    if((minHeight && cMaxHeight > minHeight) || (element.text().length > minNumChars)) {
                        element.addClass('shortDesc');
                        element.css({
                            height: cHeight,
                            overflow: 'hidden'
                        });
                        element.prepend(bottomGradient);

                        button.find('a').click(function (e) {
                            if (element.css('overflow') == 'hidden') {
                                element.animate({height: cMaxHeight + 20}, 600, function() {
                                    element.css({
                                        overflow: 'visible'
                                    });
                                    element.find('.bottomGrad').remove();
                                    $(e.target).text(defaultTxHide);
                                });
                            } else {
                                element.prepend(bottomGradient);

                                bodyTopPosition = $('html, body').offset().top * -1;
                                elTopPosition = element.offset().top;
                                if(bodyTopPosition > elTopPosition) {
                                    $('html, body').animate({
                                        scrollTop: (elTopPosition - 20)
                                    }, 'slow');
                                }
                                
                                element.animate({height: cHeight}, 600, function() {
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
    });

})(window.angular, window.jQuery);