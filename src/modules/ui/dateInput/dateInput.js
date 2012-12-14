(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.dateInput', [
        'ngx.date',
        'ngx.dictionary'
    ]);

    /**
     * Date input type
     * @todo range/time refactoring
     */
    module.directive('ngxDateInput', ['$parse', 'ngxDate', 'ngxDictionary', function($parse, ngxDate, ngxDictionary) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element = $(element);

                // apply jquery UI datepicker
                element.datepicker({
                    dateFormat: 'd.m.yy',
                    firstDay: 1,
                    showButtonPanel: false,
                    showMinute: false,
                    closeText: ngxDictionary('NGX_UI_DATEINPUT_CLOSE'),
                    prevText: ngxDictionary('NGX_UI_DATEINPUT_PREV'),
                    nextText: ngxDictionary('NGX_UI_DATEINPUT_NEXT'),
                    currentText: ngxDictionary('NGX_UI_DATEINPUT_NOW'),
                    monthNames: ngxDictionary('NGX_UI_DATEINPUT_MONTHS'),
                    dayNamesMin: ngxDictionary('NGX_UI_DATEINPUT_DAYS'),
                    onSelect: function(dateText) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(dateText);
                        });
                    }
                });

                // store element reference into widget scope for future datepicker update
                ctrl.element = element;

                var dateRangeMaxDays = attrs.rangeMaxdays ? attrs.rangeMaxdays : undefined;
                var dateInputMin = ngxDate.parse(attrs.min);
                var dateInputMax = ngxDate.parse(attrs.max);
                var dateInputMaxRange = null;

                // set initial minimum date
                if (dateInputMin) {
                    ctrl.element.datepicker('option', 'minDate', dateInputMin);
                }

                // set initial maximum date
                if (dateInputMax) {
                    ctrl.element.datepicker('option', 'maxDate', dateInputMax);
                }

                // related date range input (from-to)
                if (attrs.rangeInput) {
                    // range config
                    ctrl.range = {
                        type: 'max',
                        ctrl: $parse(attrs.rangeInput)(scope)
                    };
                    // back reference
                    ctrl.range.ctrl.range = {
                        type: 'min',
                        ctrl: ctrl
                    };
                } else {
                    ctrl.range = null;
                }

                // parse value, validate and set into model as timestamp
                ctrl.$parsers.push(function(viewValue) {
                    // datetime validation
                    var date,
                        valid = true;

                    if (viewValue && ctrl.$dirty) {
                        // parse and check date
                        var pd = new RegExp('^([0-9]{1,2}). ?([0-9]{1,2}). ?([0-9]{4})').exec(viewValue);
                        valid = (pd && ngxDate.check(pd[3], pd[2], pd[1]));

                        if (valid) {
                            date = new Date(pd[3], pd[2] - 1, pd[1]);

                            // check min input date
                            if (dateInputMin && date < dateInputMin) {
                                valid = false;
                            }

                            // check max input date
                            if (dateInputMax) {
                                if (date > dateInputMax) {
                                    valid = false;
                                }

                                // if max-days range is set, move max input to range end
                                if (dateRangeMaxDays) {
                                    dateInputMaxRange = new Date(date.getTime() + (60*60*24*dateRangeMaxDays*1000));

                                    if (ctrl.range.ctrl.timestampValue) {
                                        if (date.getTime() - (60*60*24*dateRangeMaxDays*1000) > (ctrl.range.ctrl.timestampValue * 1000)) {
                                            valid = false;
                                        }
                                    }
                                }
                            }

                            // apply related time input
                            if (ctrl.timeInput) {
                                if (ctrl.timeInput.$valid) {
                                    var hours = ctrl.timeInput.hours;
                                    var minutes = ctrl.timeInput.minutes;

                                    // when in range (as max) and has no time .. set time to 23:59
                                    if (ctrl.range && ctrl.range.type === 'max' && hours === undefined) {
                                        hours = 23;
                                        minutes = 59;
                                    }

                                    if (hours !== undefined) {
                                        date.setHours(hours);
                                        date.setMinutes(minutes);
                                    }
                                } else {
                                    valid = false;
                                }
                            }
                        }
                    }

                    // model contains ISO date
                    var modelValue = (date && valid ? ngxDate.format('Y-m-d', date) : undefined);

                    ctrl.timestampValue = (date && valid ? date.getTime() / 1000 : undefined);
                    ctrl.$setValidity('date', valid);

                    // date range
                    if (ctrl.range) {
                        // update related date picker min/max
                        if (!ctrl.$error.date) {

                            ctrl.range.ctrl.element.datepicker('option', ctrl.range.type + 'Date', viewValue);

                            if (ctrl.range.type == 'min' && dateInputMaxRange) {
                                ctrl.range.ctrl.element.datepicker('option', 'maxDate', dateInputMaxRange);
                            }
                        }

                        // range validation
                        var min = (ctrl.range.type === 'min' ? ctrl.timestampValue : ctrl.range.ctrl.timestampValue);
                        var max = (ctrl.range.type === 'max' ? ctrl.timestampValue : ctrl.range.ctrl.timestampValue);
                        valid = (min && max ? (min <= max) : true);
                        ctrl.$setValidity('range', valid);
                        ctrl.range.ctrl.$setValidity('range', valid);
                    }

                    return modelValue;
                });
            }
        };
    }]);

})(window.angular, window.jQuery);
