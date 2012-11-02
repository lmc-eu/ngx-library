(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.dateInput', ['ngx.date']);

    /**
     * Date input type
     * @todo range/time refactoring
     */
    module.directive('ngxDateInput', ['$parse', 'ngxDate', function($parse, ngxDate) {

        var parseInputDate =  function(inputValue) {
            var r = new RegExp('^([0-9]{1,2}). ?([0-9]{1,2}). ?([0-9]{4})').exec(inputValue);
            var str = new RegExp('^([\\-|\\+]?)([0-9]+)d').exec(inputValue);
            var now = new Date();

            if (inputValue == 'today') {
                // just return today's date
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            } else if (r && ngxDate.check(r[2], r[1], r[3])) {
                // parse exact date
                return new Date(r[3], r[2] - 1, r[1]);
            } else if (str) {
                // parse relative date
                var inc = str[2]*60*60*24*1000;
                var timestamp = now.getTime();

                if (str[1] == '-') {
                    timestamp -= inc;
                } else {
                    timestamp += inc;
                }

                return new Date(timestamp);
            }

            return undefined;
        };

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
                    closeText: 'Zavřít',
                    prevText: 'Předchozí',
                    nextText: 'Další',
                    currentText: 'Nyní',
                    monthNames: ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
                    dayNamesMin: ['Ne','Po','Út','St','Čt','Pá','So'],
                    onSelect: function(dateText) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(dateText);
                        });
                    }
                });

                // store element reference into widget scope for future datepicker update
                ctrl.element = element;

                var dateRangeMaxDays = attrs.dateRangeMaxdays ? attrs.dateRangeMaxdays : undefined;
                var dateInputMin = parseInputDate(attrs.dateInputMin);
                var dateInputMax = parseInputDate(attrs.dateInputMax);
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
                if (attrs.dateRangeInput) {
                    // range config
                    ctrl.range = {
                        type: 'max',
                        ctrl: $parse(attrs.dateRangeInput)(scope)
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
                    ctrl.$error.date = !valid;

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
