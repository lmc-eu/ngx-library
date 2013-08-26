(function(angular, $, window) {
    'use strict';

    var module = angular.module('ngx.ui.imageupload', [
        'ngx.config',
        'ngx.loader',
        'ngx.dictionary',
        'ngx.ui.translate'
    ]);

    /**
     * Compute resize ratio by width/height
     * @param width
     * @param maxWidth
     * @param height
     * @param maxHeight
     * @return {Number}
     */
    function resizeRatio(width, maxWidth, height, maxHeight) {
        var ratio = [1];

        if (width > maxWidth) {
            ratio.push(maxWidth / width);
        }
        if (height > maxHeight) {
            ratio.push(maxHeight / height);
        }

        ratio.sort();
        return ratio[0];
    }

    /**
     * Image uploader
     */
    module.directive('ngxImageupload', ['$timeout', 'ngxConfig', 'ngxLoader', 'ngxDictionary', function($timeout, ngxConfig, ngxLoader, ngxDictionary) {
        var deps = [
            ngxConfig.libsPath + 'jquery.jcrop/jquery.Jcrop.js',
            ngxConfig.libsPath + 'jquery.jcrop/jquery.Jcrop.css',
            ngxConfig.libsPath + 'jquery.fileupload/jquery.fileupload.js',
            ngxConfig.libsPath + 'jquery.iframe-transport/jquery.iframe-transport.js'
        ];

        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            templateUrl: ngxConfig.templatesPath + 'ui/imageupload/imageupload.html',
            scope: {
                model: '=ngModel',
                config: '='
            },
            link: function(scope, element, attrs) {
                var sourceScale,
                    thumbScale,
                    thumbCanvas = $('<canvas/>')[0],    // thumb canvas
                    resultScale,
                    resultImage,
                    resultCanvas = $('<canvas/>')[0],   // result canvas for cropping
                    resultFixed,
                    checkMinSize,
                    resultMime;

                // HTML5 feature detection
                var features = {
                    crop: (resultCanvas.getContext ? true : false),
                    fileApi: (typeof window.FileReader !== 'undefined')
                };

                /**
                 * Resets state
                 */
                function reset() {
                    resultImage = undefined;
                    scope.isSource = false;
                }

                /**
                 * Image display handler (when image loaded)
                 * @param sourceImage
                 */
                function showSourceImage(sourceImage, strict) {
                    var $sourceImage = $(sourceImage),
                        sourceWidth = ($sourceImage.data('width') ? $sourceImage.data('width') : sourceImage.width),
                        sourceHeight = ($sourceImage.data('height') ? $sourceImage.data('height') : sourceImage.height),
                        imgNewWidth,
                        imgNewHeight;

                    if (strict && !(resultScale[0] < sourceWidth && resultScale[1] < sourceHeight)) {
                        window.alert(ngxDictionary('NGX_UI_IMAGEUPLOAD_INCORRECT_IMAGE_SIZE', undefined, [
                            resultScale[0],
                            resultScale[1]
                        ]));
                        return;
                    }

                    // set isSource flag
                    scope.isSource = (sourceImage ? true : false);

                    // set source image width/height
                    $sourceImage.css({
                        'max-width': sourceScale[0] + 'px',
                        'max-height': sourceScale[1] + 'px'
                    }).show();

                    if (features.crop) {
                        var cropRatio = resizeRatio(sourceWidth, sourceScale[0], sourceHeight, sourceScale[1]),
                            cropOptions = {
                                setSelect: [0, 0, resultScale[0], resultScale[1]],
                                bgColor: 'transparent',
                                onSelect: function(coords) {
                                    // apply source ratio to cropped content
                                    coords.x = Math.floor(coords.x / cropRatio);
                                    coords.y = Math.floor(coords.y / cropRatio);
                                    coords.w = Math.floor(coords.w / cropRatio);
                                    coords.h = Math.floor(coords.h / cropRatio);

                                    function createResult(canvas, width, height, image) {
                                        if (!resultFixed) {
                                            var ratio = resizeRatio(coords.w, width, coords.h, height);
                                            width = Math.floor(coords.w * ratio);
                                            height = Math.floor(coords.h * ratio);
                                        }

                                        canvas.width = width;
                                        canvas.height = height;

                                        if (image) {
                                            image.width = width;
                                            image.height = height;
                                        }

                                        //canvas.getContext('2d').scale(scale, scale);

                                        // draw result image into canvas
                                        canvas.getContext('2d').drawImage(
                                            sourceImage,
                                            coords.x, coords.y,
                                            coords.w - 2, coords.h - 2,
                                            0, 0, width, height
                                        );

                                        return canvas.toDataURL(resultMime, 0.9);
                                    }

                                    // result image data
                                    resultImage = {};
                                    resultImage.src = createResult(resultCanvas, resultScale[0], resultScale[1], resultImage);

                                    // generate thumbnail
                                    if (thumbScale) {
                                        resultImage.thumbSrc = createResult(thumbCanvas, thumbScale[0], thumbScale[1]);
                                    }

                                    // set result image
                                    $('[data-imageupload-rel=result]').attr(resultImage);
                                }
                            };

                        if (resultFixed) {
                            cropOptions.aspectRatio = (resultScale[0] / resultScale[1]);
                        }

                        if (checkMinSize) {
                            imgNewWidth = sourceWidth;
                            imgNewHeight = sourceHeight;
                            if((sourceWidth > sourceScale[0]) || (sourceHeight > sourceScale[1])) {
                                if(sourceWidth > sourceHeight) {
                                    imgNewWidth = sourceScale[0];
                                    imgNewHeight = sourceHeight / (sourceWidth / sourceScale[0]);
                                } else {
                                    imgNewWidth = sourceWidth / (sourceHeight / sourceScale[1]);
                                    imgNewHeight = sourceScale[1];
                                }
                            }

                            var widthScale = resultScale[0] / (sourceWidth / imgNewWidth),
                                heightScale = resultScale[1] / (sourceHeight / imgNewHeight);

                            cropOptions.minSize = [widthScale, heightScale];
                        }

                        // destroy previously created Jcrop
                        var jcrop = $sourceImage.data('Jcrop');
                        if (jcrop) {
                            jcrop.destroy();
                        }

                        // initialize Jcrop
                        $sourceImage.Jcrop(cropOptions, function() {
                            // fire cropHandler on start (plugin does not do it)
                            cropOptions.onSelect(this.tellSelect());
                        });
                    } else {
                        // result image = source image
                        resultImage = {
                            width: sourceWidth,
                            height: sourceHeight,
                            'src': $sourceImage.attr('src')
                        };
                    }
                }

                /**
                 * Setup imageupload
                 */
                function setup() {
                    var $element = $(element);

                    var config = angular.extend({}, ngxConfig.ui.imageupload, scope.config, attrs);
                    sourceScale = (config.sourceScale || '400x400').split('x');
                    resultScale = (config.resultScale || '215x125').split('x');
                    resultFixed = !angular.isUndefined(config.resultFixed);
                    checkMinSize = !angular.isUndefined(config.checkMinSize);
                    resultMime = 'image/' + ((config.resultFormat || '').match(/^jpe?g$/) ? 'jpeg' : 'png');
                    thumbScale = (config.resultThumbScale || undefined);

                    if (thumbScale) {
                        thumbScale = thumbScale.split('x');
                    }

                    scope.resultWidth = resultScale[0];
                    scope.resultHeight = resultScale[1];

                    reset();

                    // setup preview containers
                    $element.find('.source').css({
                        width: sourceScale[0] + 'px',
                        height: sourceScale[1] + 'px'
                    });
                    $element.find('.result').css({
                        width: resultScale[0] + 'px',
                        height: resultScale[1] + 'px'
                    });

                    // HTML5 features into scope
                    scope.features = features;
                    scope.featureClass = [];
                    angular.forEach(['crop', 'fileApi'], function(feature) {
                        scope.featureClass.push(features[feature] ? feature : 'no-' + feature.toLowerCase());
                    });
                    scope.featureClass = scope.featureClass.join(' ');

                    // in dialog?
                    if (config.dialogTrigger) {
                        // bind dialog trigger
                        $(config.dialogTrigger).click(function(e) {
                            e.preventDefault();
                            $element.dialog('open');
                            return false;
                        });

                        // initialize dialog
                        $element.dialog({
                            autoOpen: false,
                            minWidth: parseInt(sourceScale[0], 10) + parseInt(resultScale[0], 10) + 70,
                            minHeight: parseInt(sourceScale[1] > resultScale[1] ? sourceScale[1] : resultScale[1], 10) + 50,
                            resizable: false,
                            modal: (angular.isDefined(attrs.dialogModal) && attrs.dialogModal !== "false"),
                            title: config.dialogTitle,
                            buttons: [
                                {
                                    text: ngxDictionary('NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT'),
                                    click: function() {
                                        scope.model = (config.resultMode === 'simple' ? resultImage.src : resultImage);
                                        $(this).dialog('close');
                                    }
                                },
                                {
                                    text: ngxDictionary('NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL'),
                                    click: function() {
                                        $(this).dialog('close');
                                    }
                                }
                            ],
                            close: function() {
                                reset();
                                scope.$apply();
                            }
                        });
                    }

                    // initialize fileupload
                    $element.fileupload({
                        url: config.sourceContentUrl,
                        fileInput: $element.find('input[type=file]'),
                        dropZone: $('[data-imageupload-rel=dragdrop]'),
                        dataType: 'json',
                        replaceFileInput: true,
                        formData: {
                            crop: (features.crop ? 'true' : 'false')
                        },

                        // when file added
                        add: function(e, data) {
                            var file = data.files[0],
                                image = $('[data-imageupload-rel=source]')[0];

                            $(image).hide();

                            image.onload = function() {
                                showSourceImage(this, $element.attr('source-strict'));
                                scope.$apply();
                            };
                            image.onerror = function() {
                                window.alert(ngxDictionary('NGX_UI_IMAGEUPLOAD_INVALID_IMAGE'));
                            };

                            // try read file with FileAPI
                            if (features.fileApi) {
                                var fileReader = new window.FileReader();
                                fileReader.onload = function(e) {
                                    image.src = e.target.result;
                                };
                                fileReader.readAsDataURL(file);

                            } else {
                                // upload file to server and get content.. IE8 :-|
                                data.submit()
                                    .success(function(result) {
                                        $(image).data('width', result.width).data('height', result.height);
                                        image.src = result.src;
                                    }).error(function() {
                                        window.alert(ngxDictionary('NGX_UI_IMAGEUPLOAD_PROCESS_ERROR'));
                                    });
                            }
                        }
                    });
                }

                element.hide();

                // load libraries
                ngxLoader(deps, function() {
                    element.show();
                    $timeout(setup, 0);
                });
            }
        };
    }]);

})(window.angular, window.jQuery, window);
