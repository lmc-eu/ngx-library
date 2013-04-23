/**
 * NGX - extension library for AngularJS
 * @version v0.2.2 - 2013-04-23
 * @link http://github.com/lmc-eu/ngx-library
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(angular) {
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
        'ngx.ui.confirm',
        'ngx.ui.dateInput',
        'ngx.ui.dialog',
        'ngx.ui.gallery',
        'ngx.ui.geomap',
        'ngx.ui.hashtagInput',
        'ngx.ui.imageupload',
        'ngx.ui.invalid',
        'ngx.ui.lightbox',
        'ngx.ui.rating',
        'ngx.ui.scrollTo',
        'ngx.ui.smap',
        'ngx.ui.tagsInput',
        'ngx.ui.textCurtain',
        'ngx.ui.timeInput',
        'ngx.ui.tooltip',
        'ngx.ui.translate',
        'ngx.ui.validate',
        'ngx.ui.wwwInput',
        'ngx.ui.wysiwyg'
    ]);

})(window.angular);

/**
 * Missing ECMAScript Array functions
 */
(function(Array) {
    'use strict';

    if (!Array.prototype.indexOf) {
        /**
         * Searches the array for the specified item and returns its position
         * @param search
         * @return {Number}
         */
        Array.prototype.indexOf = function(search) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === search) {
                    return i;
                }
            }
            return -1;
        };
    }
})(window.Array);
/**
 Head JS     The only script in your <HEAD>
 Copyright   Tero Piirainen (tipiirai)
 License     MIT / http://bit.ly/mit-license
 Version     0.96

 http://headjs.com
 */
(function(doc, window) {
    'use strict';

    var head = doc.documentElement,
        isHeadReady,
        isDomReady,
        domWaiters = [],
        queue = [],        // waiters for the "head ready" event
        handlers = {},     // user functions waiting for events
        scripts = {},      // loadable scripts in different states
        isAsync = doc.createElement("script").async === true || "MozAppearance" in doc.documentElement.style || window.opera;


    /*** public API ***/
    var head_var = window.head_conf && window.head_conf.head || "head",
        api = window[head_var] = (window[head_var] || function() { api.ready.apply(null, arguments); });

    // states
    var PRELOADED = 1,
        PRELOADING = 2,
        LOADING = 3,
        LOADED = 4;


    // Method 1: simply load and let browser take care of ordering
    if (isAsync) {

        api.js = function() {

            var args = arguments,
                fn = args[args.length -1],
                els = {};

            if (!isFunc(fn)) { fn = null; }

            each(args, function(el, i) {

                if (el != fn) {
                    el = getScript(el);
                    els[el.name] = el;

                    load(el, fn && i == args.length -2 ? function() {
                        if (allLoaded(els)) { one(fn); }

                    } : null);
                }
            });

            return api;
        };


        // Method 2: preload with text/cache hack
    } else {

        api.js = function() {

            var args = arguments,
                rest = [].slice.call(args, 1),
                next = rest[0];

            // wait for a while. immediate execution causes some browsers to ignore caching
            if (!isHeadReady) {
                queue.push(function()  {
                    api.js.apply(null, args);
                });
                return api;
            }

            // multiple arguments
            if (next) {

                // load
                each(rest, function(el) {
                    if (!isFunc(el)) {
                        preload(getScript(el));
                    }
                });

                // execute
                load(getScript(args[0]), isFunc(next) ? next : function() {
                    api.js.apply(null, rest);
                });


                // single script
            } else {
                load(getScript(args[0]));
            }

            return api;
        };
    }

    api.ready = function(key, fn) {

        // DOM ready check: head.ready(document, function() { });
        if (key == doc) {
            if (isDomReady) { one(fn);  }
            else { domWaiters.push(fn); }
            return api;
        }

        // shift arguments
        if (isFunc(key)) {
            fn = key;
            key = "ALL";
        }

        // make sure arguments are sane
        if (typeof key != 'string' || !isFunc(fn)) { return api; }

        var script = scripts[key];

        // script already loaded --> execute and return
        if (script && script.state == LOADED || key == 'ALL' && allLoaded() && isDomReady) {
            one(fn);
            return api;
        }

        var arr = handlers[key];
        if (!arr) { arr = handlers[key] = [fn]; }
        else { arr.push(fn); }
        return api;
    };


    // perform this when DOM is ready
    api.ready(doc, function() {

        if (allLoaded()) {
            each(handlers.ALL, function(fn) {
                one(fn);
            });
        }

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });


    /*** private functions ***/


        // call function once
    function one(fn) {
        if (fn._done) { return; }
        fn();
        fn._done = 1;
    }


    function toLabel(url) {
        var els = url.split("/"),
            name = els[els.length -1],
            i = name.indexOf("?");

        return i != -1 ? name.substring(0, i) : name;
    }


    function getScript(url) {

        var script;

        if (typeof url == 'object') {
            for (var key in url) {
                if (url[key]) {
                    script = { name: key, url: url[key] };
                }
            }
        } else {
            script = { name: toLabel(url),  url: url };
        }

        var existing = scripts[script.name];
        if (existing && existing.url === script.url) { return existing; }

        scripts[script.name] = script;
        return script;
    }


    function each(arr, fn) {
        if (!arr) { return; }

        // arguments special type
        if (typeof arr == 'object') { arr = [].slice.call(arr); }

        // do the job
        for (var i = 0; i < arr.length; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    function isFunc(el) {
        return Object.prototype.toString.call(el) == '[object Function]';
    }

    function allLoaded(els) {

        els = els || scripts;

        var loaded;

        for (var name in els) {
            if (els.hasOwnProperty(name) && els[name].state != LOADED) { return false; }
            loaded = true;
        }

        return loaded;
    }


    function onPreload(script) {
        script.state = PRELOADED;

        each(script.onpreload, function(el) {
            el.call();
        });
    }

    function preload(script, callback) {

        if (script.state === undefined) {

            script.state = PRELOADING;
            script.onpreload = [];

            scriptTag({ src: script.url, type: 'cache'}, function()  {
                onPreload(script);
            });
        }
    }

    function load(script, callback) {

        if (script.state == LOADED) {
            return callback && callback();
        }

        if (script.state == LOADING) {
            return api.ready(script.name, callback);
        }

        if (script.state == PRELOADING) {
            return script.onpreload.push(function() {
                load(script, callback);
            });
        }

        script.state = LOADING;

        scriptTag(script.url, function() {

            script.state = LOADED;

            if (callback) { callback(); }

            // handlers for this script
            each(handlers[script.name], function(fn) {
                one(fn);
            });

            // everything ready
            if (allLoaded() && isDomReady) {
                each(handlers.ALL, function(fn) {
                    one(fn);
                });
            }
        });
    }


    function scriptTag(src, callback) {

        var s = doc.createElement('script');
        s.type = 'text/' + (src.type || 'javascript');
        s.src = src.src || src;
        s.async = false;

        s.onreadystatechange = s.onload = function() {

            var state = s.readyState;

            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };

        // use body if available. more safe in IE
        (doc.body || head).appendChild(s);
    }

    /*
     The much desired DOM ready check
     Thanks to jQuery and http://javascript.nwbox.com/IEContentLoaded/
     */

    function fireReady() {
        if (!isDomReady) {
            isDomReady = true;
            each(domWaiters, function(fn) {
                one(fn);
            });
        }
    }

    // W3C
    if (window.addEventListener) {
        doc.addEventListener("DOMContentLoaded", fireReady, false);

        // fallback. this is always called
        window.addEventListener("load", fireReady, false);

        // IE
    } else if (window.attachEvent) {

        // for iframes
        doc.attachEvent("onreadystatechange", function()  {
            if (doc.readyState === "complete" ) {
                fireReady();
            }
        });


        // avoid frames with different domains issue
        var frameElement = 1;

        try {
            frameElement = window.frameElement;

        } catch(e) {}


        if (!frameElement && head.doScroll) {

            (function() {
                try {
                    head.doScroll("left");
                    fireReady();

                } catch(e) {
                    var a = arguments;
                    window.setTimeout(a.callee, 1);
                    return;
                }
            })();
        }

        // fallback
        window.attachEvent("onload", fireReady);
    }


    // enable document.readyState for Firefox <= 3.5
    if (!doc.readyState && doc.addEventListener) {
        var handler;
        doc.readyState = "loading";
        doc.addEventListener("DOMContentLoaded", handler = function () {
            doc.removeEventListener("DOMContentLoaded", handler, false);
            doc.readyState = "complete";
        }, false);
    }

    /*
     We wait for 300 ms before script loading starts. for some reason this is needed
     to make sure scripts are cached. Not sure why this happens yet. A case study:

     https://github.com/headjs/headjs/issues/closed#issue/83
     */
    window.setTimeout(function() {
        isHeadReady = true;
        each(queue, function(fn) { fn(); });
    }, 300);

})(window.document, window);

(function(angular, document) {
    'use strict';

    // determine base path
    var basePath = null,
        re = /ngx(\.min)?\.js(.*)$/;

    angular.forEach(document.getElementsByTagName('script'), function(script) {
        if (script.src.match(re)) {
            basePath = script.src.replace(re, '');
        }
    });
    if (basePath === null) {
        throw new Error('ngx base path cannot be determined.');
    }

    var module = angular.module('ngx.config', []);

    /**
     * Configuration
     */
    module.value('ngxConfig', {
        basePath: basePath,
        libsPath: basePath + 'libs/',
        templatesPath: basePath + 'templates/',
        ui: {}
    });

})(window.angular, window.document);

/**
 * Date module
 * @todo avoid implementations from phpjs.org
 */
(function(angular) {
    'use strict';

    var ngxDate = {};

    /**
     * Date formatter
     * @param format
     * @param timestamp
     * @return {*}
     */
    ngxDate.format = function(format, timestamp) {
        // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
        // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
        // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
        // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
        // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
        // *     returns 1: '09:09:40 m is month'
        // *     example 2: date('F j, Y, g:i a', 1062462400);
        // *     returns 2: 'September 2, 2003, 2:26 am'
        // *     example 3: date('Y W o', 1062462400);
        // *     returns 3: '2003 36 2003'
        // *     example 4: x = date('Y m d', (new Date()).getTime()/1000);
        // *     example 4: (x+'').length == 10 // 2009 01 09
        // *     returns 4: true
        // *     example 5: date('W', 1104534000);
        // *     returns 5: '53'
        // *     example 6: date('B t', 1104534000);
        // *     returns 6: '999 31'
        // *     example 7: date('W U', 1293750000.82); // 2010-12-31
        // *     returns 7: '52 1293750000'
        // *     example 8: date('W', 1293836400); // 2011-01-01
        // *     returns 8: '52'
        // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
        // *     returns 9: '52 2011-01-02'
        var that = this,
            jsdate, f, formatChr = /\\?([a-z])/gi,
            formatChrCb,
        // Keep this here (works, but for code commented-out
        // below for file size reasons)
        //, tal= [],
            _pad = function (n, c) {
                if ((n = n + '').length < c) {
                    return new Array((++c) - n.length).join('0') + n;
                }
                return n;
            },
            txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        formatChrCb = function (t, s) {
            return f[t] ? f[t]() : s;
        };
        f = {
            // Day
            d: function () { // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function () { // Shorthand day name; Mon...Sun
                return f.l().slice(0, 3);
            },
            j: function () { // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function () { // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function () { // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                return j < 4 || j > 20 && ['st', 'nd', 'rd'][j%10 - 1] || 'th';
            },
            w: function () { // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function () { // Day of year; 0..365
                var a = new Date(f.Y(), f.n() - 1, f.j()),
                    b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5) + 1;
            },

            // Week
            W: function () { // ISO-8601 week number
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                    b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },

            // Month
            F: function () { // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function () { // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function () { // Shorthand month name; Jan...Dec
                return f.F().slice(0, 3);
            },
            n: function () { // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function () { // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0)).getDate();
            },

            // Year
            L: function () { // Is leap year?; 0 or 1
                var j = f.Y();
                return j%4===0 && j%100!==0 || j%400===0;
            },
            o: function () { // ISO-8601 year
                var n = f.n(),
                    W = f.W(),
                    Y = f.Y();
                return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
            },
            Y: function () { // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function () { // Last two digits of year; 00...99
                return (f.Y() + "").slice(-2);
            },

            // Time
            a: function () { // am or pm
                return jsdate.getHours() > 11 ? "pm" : "am";
            },
            A: function () { // AM or PM
                return f.a().toUpperCase();
            },
            B: function () { // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2,
                // Hours
                    i = jsdate.getUTCMinutes() * 60,
                // Minutes
                    s = jsdate.getUTCSeconds(); // Seconds
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function () { // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function () { // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function () { // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function () { // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function () { // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function () { // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function () { // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },

            // Timezone
            e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return this.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function () { // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = new Date(f.Y(), 0),
                // Jan 1
                    c = Date.UTC(f.Y(), 0),
                // Jan 1 UTC
                    b = new Date(f.Y(), 6),
                // Jul 1
                    d = Date.UTC(f.Y(), 6); // Jul 1 UTC
                return 0 + ((a - c) !== (b - d));
            },
            O: function () { // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset(),
                    a = Math.abs(tzo);
                return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function () { // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ":" + O.substr(3, 2));
            },
            T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
                // The following works, but requires inclusion of the very
                // large timezone_abbreviations_list() function.
                /*              var abbr = '', i = 0, os = 0, default = 0;
                 if (!tal.length) {
                 tal = that.timezone_abbreviations_list();
                 }
                 if (that.php_js && that.php_js.default_timezone) {
                 default = that.php_js.default_timezone;
                 for (abbr in tal) {
                 for (i=0; i < tal[abbr].length; i++) {
                 if (tal[abbr][i].timezone_id === default) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 }
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 os = -jsdate.getTimezoneOffset() * 60;
                 if (tal[abbr][i].offset === os) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 */
                return 'UTC';
            },
            Z: function () { // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },

            // Full Date/Time
            c: function () { // ISO-8601 date.
                return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function () { // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function () { // Seconds since UNIX epoch
                return parseInt(jsdate / 1000, 10);
            }
        };
        this.date = function (format, timestamp) {
            that = this;
            jsdate = (timestamp === null ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                    new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
    };

    /**
     * Date validator (from phpjs.org)
     * @param year
     * @param month
     * @param day
     * @return {Boolean}
     */
    ngxDate.check = function(year, month, day) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Pyerre
        // +   improved by: Theriault
        // *     example 1: checkdate(12, 31, 2000);
        // *     returns 1: true
        // *     example 2: checkdate(2, 29, 2001);
        // *     returns 2: false
        // *     example 3: checkdate(3, 31, 2008);
        // *     returns 3: true
        // *     example 4: checkdate(1, 390, 2000);
        // *     returns 4: false
        return (month > 0 && month < 13 && year > 0 && year < 32768 && day > 0 && day <= (new Date(year, month, 0)).getDate());
    };

    /**
     * Date parser
     * Accepts date in format DD.MM.YYYY or placeholder string "today" or relative number of days +1d / -1d
     * @param inputValue Date (DD.MM.YYYY) or relative date placeholder
     * @return {Date}
     */
    ngxDate.parse =  function(inputValue) {
        var r = new RegExp('^([0-9]{1,2}). ?([0-9]{1,2}). ?([0-9]{4})').exec(inputValue);
        var str = new RegExp('^([\\-|\\+]?)([0-9]+)d').exec(inputValue);
        var now = new Date();

        if (inputValue == 'today') {
            // just return today's date
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        } else if (r && ngxDate.check(r[3], r[2], r[1])) {
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

    angular.module('ngx.date', [])
       .value('ngxDate', ngxDate);

})(window.angular);

(function(angular) {
    'use strict';

    var module = angular.module('ngx.dictionary', []);

    /**
     * Dictionary provider
     */
    module.factory('ngxDictionary', function($locale) {
        var dictionary = {},
            currentLanguage = $locale.id.split('-')[0];

        /**
         * Returns items by current language
         * @param key
         * @param language
         * @param params array of string elements for replace %s, depends on order
         */
        function ngxDictionary(key, language, params) {
            var string = dictionary[language ? language : currentLanguage][key];
            if(params !== undefined) {
                var re = /%s/;
                angular.forEach(params, function(param) {
                    string = string.replace(re, param);
                });
            }
            return string;
        }

        /**
         * Sets dictionary current language
         * @param language
         */
        ngxDictionary.setLanguage = function(language) {
            currentLanguage = language;
            return this;
        };

        /**
         * Adds items to dictionary
         * @param language
         * @param items
         */
        ngxDictionary.addItems = function(language, items) {
            if (angular.isUndefined(dictionary[language])) {
                dictionary[language] = {};
            }

            angular.extend(dictionary[language], items);
            return this;
        };

        return ngxDictionary;
    });

})(window.angular);


(function(angular, head) {
    'use strict';

    var module = angular.module('ngx.loader', ['ngx.config']);

    module.factory('ngxLoader', ['ngxConfig', function(ngxConfig) {
        var loaded = [];

        /**
         * Loads external js/css files
         * @param files
         */
        return function(files, onload) {
            var queue = {
                js: [],
                css: []
            };

            // group files to load by type
            angular.forEach(typeof(files) === 'string' ? [files] : files, function(file) {
                var type,
                    force = false;

                // add base path
                if (!file.match(/^(\/|http)/)) {
                    file = ngxConfig.basePath + file;
                }

                if (file.match(/\.css$/i)) {
                    type = 'css';
                } else if (file.match(/\.js$/i)) {
                    type = 'js';
                    force = (onload ? true : false);
                } else {
                    throw new Error('File type not supported');
                }

                // already loaded
                if (loaded.indexOf(file) >= 0 && !force) {
                    return;
                }

                queue[type].push(file);
                loaded.push(file);
            });

            // process queue
            angular.forEach(queue, function(files, type) {
                if (!files.length) {
                    return;
                }
                switch (type) {
                    case 'js':
                        // handle onload callback with head.js
                        if (onload) {
                            files.push(onload);
                            onload = null;
                        }
                        head.js.apply(this, files);
                        break;

                    case 'css':
                        angular.forEach(files, function(file) {
                            angular.element('head').append(angular.element('<link rel="stylesheet" type="text/css" href="' + file + '"></link>'));
                        });
                        break;
                }
            });

            if (onload) {
                onload();
            }
        };
    }]);
})(window.angular, window.head);

(function(angular, $, window) {
    'use strict';

    var module = angular.module('ngx.smap', []);

    module.config(function() {
        // some Seznam library disables console debug mode :-/
        window.console.DEBUG = true;
    });

    /**
     * Seznam map service
     */
    module.factory('ngxSmap', function() {
        var SMap = window.SMap;

        if (SMap === undefined) {
            throw 'Seznam map API is not loaded, see http://api4.mapy.cz/view?page=instruction';
        }

        function NgxSmap(wrapper) {
            var smap, card, markerLayer, geocoder,
                self = this;

            // api cache
            var cache = {
                coords: {},
                query: {}
            };

            // SMap source code list
            var typeList = {
                'stre': 'street',
                'addr': 'number',
                'muni': 'city',
                'dist': 'district',
                'regi': 'region',
                'ward': 'ward',
                'coun': 'country',
                'base': 'base',
                'firm': 'firm'
            };

            // filter by source
            var typeFilter = {
                'street': '^ulice ',
                'number': '^č\\.p\\. ',
                'city': '^obec ',
                'district': '^okres ',
                'region': '^(kraj( Hlavní město)?|provincie) ',
                'ward': '^(čtvrť|část obce) '
            };

            function smapCoords(coords) {
                if (typeof(coords) === 'object') {
                    // convert into SMap.Coords
                    if (!coords.toWGS84) {
                        return SMap.Coords.fromWGS84(coords.lon !== undefined ? coords.lon : coords[0], coords.lon !== undefined ? coords.lat : coords[1]);
                    } else {
                        return coords;
                    }
                } else if (typeof(coords) === 'string') {
                    coords = coords.split(',');
                    return smapCoords({
                        lat: coords[0],
                        lon: coords[1]
                    });
                } else {
                    return undefined;
                }
            }

            // initialize map
            this.create = function(options) {
                smap = new SMap(wrapper);
                smap.addDefaultLayer(SMap.DEF_BASE).enable();

                if (!options) {
                    options = {};
                }

                if (options.controls !== 'off') {
                    smap.addDefaultControls();
                }

                // card
                card = new SMap.Card(230);
                $(card.getBody()).css('padding-right', '18px');

                // marker layer
                markerLayer = new SMap.Layer.Marker();
                smap.addLayer(markerLayer);
                markerLayer.enable();

                // bind map-click event on control click event
                smap.getSignals().addListener(window, 'map-click', function(signal) {
                    $(self).triggerHandler('click', [SMap.Coords.fromEvent(signal.data.event, smap)]);
                });
            };

            // geocode by query
            this.geocodeQuery = function(query, callback) {
                // cached
                if (cache.query[query]) {
                    callback(cache.query[query]);

                    // query api
                } else {
                    // abort previous request
                    if (geocoder) {
                        geocoder.abort();
                    }

                    geocoder = new SMap.Geocoder(query, function(geocoder) {
                        var results = geocoder.getResults();
                        results = (results[0] && results[0].results && results[0].results.length ? results[0].results : []);

                        angular.forEach(results, function(item, key) {
                            // append item type
                            results[key].type = typeList[item.source];

                            // format coords
                            results[key].coords = self.formatCoords(item.coords);
                        });

                        cache.query[query] = results;
                        callback(results);
                    });
                }
            };

            // (reverse) geocode by coords
            this.geocodeCoords = function(coords, callback) {
                coords = smapCoords(coords);

                // onfinish callbacks
                function callbacks(data) {
                    // trigger callback
                    if (callback) {
                        callback(data);
                    }

                    // trigger global 'geocodeCoords' event
                    $(self).triggerHandler('geocodeCoords', [data]);
                }

                // cached
                var ckey = coords.x + '-' + coords.y;
                if (cache.coords[ckey]) {
                    callbacks(cache.coords[ckey]);
                    return;
                }

                // reverse geocode
                var geocoder = new SMap.Geocoder.Reverse(coords, function(geocoder) {
                    var results = geocoder.getResults(),
                        coords = results.coords.toWGS84();

                    // result data
                    var data = {
                        coords: self.formatCoords(coords),
                        label: results.label,
                        meta: {}
                    };

                    // create address fields from items[]
                    var type, label;
                    angular.forEach(results.items, function(item) {
                        type = typeList[item.type];

                        if (!type) {
                            return;
                        }

                        label = item.name;

                        // apply filter by type
                        if (typeFilter[type]) {
                            label = label.replace(new RegExp(typeFilter[type], 'i'), '');
                        }

                        data[type] = label;

                        // include meta
                        data.meta[type] = {
                            id: item.id,
                            coords: self.formatCoords(item.coords)
                        };

                        switch (type) {
                            case 'number':
                                // parse land registry and house number
                                var parts = label.split('/');
                                data.registry_number = parts[0];
                                data.house_number = (parts[1] ? parts[1] : undefined);
                                break;

                            case 'city':
                                // zip code is not included in items, try parse it from city label
                                try {
                                    var match = new RegExp(', ([0-9]{3}) ([0-9]{2}) ' + label).exec(results.label);
                                    if (match) {
                                        data.zip_code = match[1] + ' ' + match[2];
                                    }
                                } catch (e) {}
                                break;
                        }
                    });

                    // if street field is empty, set ward name as street name
                    if (!data.street && data.ward) {
                        data.street = data.ward;
                    }

                    cache.coords[ckey] = data;
                    callbacks(data);
                });
            };

            // sets map center with additional actions (zoom, marker, card)
            this.setCenter = function(coords, options) {
                if (!coords) {
                    return;
                }

                coords = smapCoords(coords);

                // zoom into coords
                if (options.zoom) {
                    smap.setCenterZoom(coords, (options.zoom === true ? 15 : options.zoom));
                } else {
                    smap.setCenter(coords);
                }

                // add marker
                if (options.marker) {
                    markerLayer.removeAll();
                    markerLayer.addMarker(new SMap.Marker(coords, 'marker'));
                }

                // add card with label
                if (options.card) {
                    smap.addCard(card, coords);
                    card.getBody().innerHTML = options.card;
                }
            };

            // formats label by query and reverse geocoded data
            this.formatLabel = function(data, query) {
                // format only when firm or address
                if (query.source === 'firm' || query.source === 'addr') {
                    var label = (data.street ? data.street : data.ward) + ' ' + data.number;

                    if (data.city) {
                        label += ', ' + (data.zip_code ? data.zip_code + ' ' : '') + data.city;
                    }
                    if (data.country) {
                        label += ', ' + data.country;
                    }

                    return label;
                } else {
                    // otherwise use query label
                    return query.label;
                }
            };

            // formats coords into lon/lat WGS84 format
            this.formatCoords = function(coords) {
                var $coords = smapCoords(coords).toWGS84();
                return {
                    lon: $coords[0],
                    lat: $coords[1]
                };
            };
        }

        return function(wrapper) {
            return new NgxSmap(wrapper);
        };
    });

})(window.angular, window.jQuery, window);

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.addressInput', ['ngx.ui.smap', 'ngx.ui.geomap']);

    /**
     * Address input with autocomplete and reverse geocoding
     * @todo hacks cleanup
     */
    module.directive('ngxAddressInput', ['$timeout', '$window', 'ngxSmap', function($timeout, $window, ngxSmap) {
        return {
            require: 'ngModel',
            compile: function(element, attrs) {
                var hasGeomap = angular.isDefined(attrs.geomap);

                return function(scope, element, attrs, ctrl) {
                    var geomap,
                        allowedTypes = (attrs.allowedTypes ? attrs.allowedTypes.replace(/[ ]+/g, '').split(',') : []),
                        requiredTypes = (attrs.requiredTypes ? attrs.requiredTypes.replace(/[ ]+/g, '').split(',') : []);

                    // parse input value and set into model
                    ctrl.$parsers.push(function(data) {
                        var model;

                        if (angular.isObject(data)) {
                            model = data;

                            // exclude meta when not required
                            if (attrs.meta !== 'true') {
                                delete model.meta;
                            }

                            element.val(data.label);
                        } else if (angular.isString(data) || angular.isUndefined(data)) {
                            model = { label: data };
                        } else {
                            throw 'Invalid address data';
                        }

                        return model;
                    });

                    // set input value from model
                    ctrl.$formatters.push(function(value) {
                        if (angular.isObject(value)) {
                            if (value.coords) {
                                setCoords(value.coords);
                            }
                            return (angular.isString(value.label) ? value.label : '');
                        } else {
                            return '';
                        }
                    });

                    function found(count) {
                        ctrl.$setValidity('found', angular.isNumber(count) ? (count > 0) : count);
                    }

                    ctrl.loading = false;

                    function loading(status) {
                        ctrl.loading = status;
                    }

                    function setGeomap(map) {
                        geomap = map;

                        // when coords geocoding is finished
                        $(geomap).bind('geocodeCoords', function(event, data) {
                            $timeout(function() {
                                ctrl.$setViewValue(data);
                            }, 0);
                        });
                    }

                    function setCoords(coords, query) {
                        loading(true);

                        /** @hack */
                        if (angular.isUndefined(query)) {
                            query = { source: 'addr' };
                        }

                        geomap.geocodeCoords(coords, function(data) {
                            // format label
                            data.label = geomap.formatLabel(data, query);

                            // center map
                            if ($(attrs.geomap).is(':visible')) {
                                geomap.setCenter(data.coords, {
                                    zoom: true,
                                    card: data.label
                                });
                            }

                            loading(false);
                            found(true);

                            angular.forEach(requiredTypes, function (requiredType) {
                                ctrl.$setValidity(requiredType, data && data[requiredType]);
                            });
                        });
                    }

                    // use existing geomap element service if available
                    if (hasGeomap) {
                        attrs.$observe('geomap', function(value) {
                            setGeomap(angular.element(value).data('ngx.ui.geomap'));
                        });
                    } else {
                        // otherwise use Seznam geomap
                        setGeomap(ngxSmap());
                    }

                    // bind autocomplete
                    element.autocomplete({
                        delay: 500,
                        source: function(request, response) {
                            loading(true);
                            scope.$apply();

                            geomap.geocodeQuery(request.term, function(results) {
                                var $results = [];

                                angular.forEach(results, function(item) {
                                    // allow only address types defined in attribute
                                    if (!allowedTypes.length || allowedTypes.indexOf(item.type) > -1) {
                                        $results.push(item);
                                    }
                                });

                                found($results.length);

                                response($results);
                                loading(false);
                                scope.$apply();
                            });
                        },
                        select: function(event, ui) {
                            setCoords(ui.item.coords, ui.item);
                            scope.$apply();
                            return false;
                        }
                    });

                    $($window).click(function() {
                        element.autocomplete('close');
                    });
                };
            }
        };
    }]);
})(window.angular, window.jQuery, window);
(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.checkboxlist', []);

    /**
     * Checkbox list
     * @todo refactoring
     */
    module.directive('ngxCheckboxlist', ['$interpolate', function($interpolate) {
        var lists = {};
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                var id = attrs.ngModel,
                    required = angular.isDefined(attrs.required),
                    minCount = (attrs.min ? parseInt(attrs.min, 10) : null),
                    maxCount = (attrs.max ? parseInt(attrs.max, 10) : null);

                ctrl.value = $interpolate(element.val())(scope);

                if (!lists[id]) {
                    lists[id] = {
                        ctrl: [],
                        list: {}
                    };
                }
                lists[id].ctrl.push(ctrl);
                lists[id].list[ctrl.value] = attrs.title;
                ctrl.list = lists[id].list;

                function setValidity(values) {
                    ctrl.$setValidity('required', required ? values.length > 0 : true);
                    ctrl.$setValidity('min', angular.isNumber(minCount) ? values.length >= minCount : true);
                    ctrl.$setValidity('max', angular.isNumber(maxCount) ? values.length <= maxCount : true);
                }

                ctrl.$parsers.push(function() {
                    var values = [];

                    angular.forEach(lists[id].ctrl, function(ctrl) {
                        if (ctrl.$viewValue) {
                            values.push(ctrl.value);
                        }
                    });

                    setValidity(values);
                    return values;
                });

                ctrl.$formatters.push(function(values) {
                    if (!values) {
                        values = [];
                    }

                    setValidity(values);

                    for (var i = 0; i < values.length; i++) {
                        if (values[i] === ctrl.value) {
                            return true;
                        }
                    }

                    return false;
                });
            }
        };
    }]);

})(window.angular);

// initialize CKEditor base path global variable
window.CKEDITOR_BASEPATH = '';

(function(angular, window) {
    'use strict';

    var module = angular.module('ngx.ui.ckeditor', ['ngx.config', 'ngx.loader']);

    /**
     * WYSIWYG editor
     */
    module.directive('ngxCkeditor', ['$parse', 'ngxConfig', 'ngxLoader', function($parse, ngxConfig, ngxLoader) {
        window.CKEDITOR_BASEPATH = ngxConfig.libsPath + 'ckeditor/';
        var deps = [window.CKEDITOR_BASEPATH + 'ckeditor.js'];

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.hide();
                ngxLoader(deps, function() {
                    element.show();
                    var strokes = [
                        [ window.CKEDITOR.CTRL + 90 /*Z*/, 'undo'],
                        [ window.CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
                        [ window.CKEDITOR.CTRL + window.CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ]
                    ];
                    var items = attrs.toolbarItems.split(',');
                    angular.forEach(attrs.toolbarItems.split(','), function(item) {
                        if (item=="Bold") {
                            strokes.push([window.CKEDITOR.CTRL + 66 /*B*/, 'bold']);
                        }
                        if (item=="Link") {
                            strokes.push([window.CKEDITOR.CTRL + 76 /*B*/, 'link']);
                        }
                        if (item=="Italic") {
                            strokes.push([window.CKEDITOR.CTRL + 73 /*I*/, 'italic' ]);
                        }
                        if (item=="Underline") {
                            strokes.push([window.CKEDITOR.CTRL + 85 /*I*/, 'underline' ]);
                        }
                    });

                    window.CKEDITOR.config.keystrokes = strokes;
                    // editor instance
                    var editor = window.CKEDITOR.replace(element[0], {
                        toolbar: (attrs.toolbarItems ? [attrs.toolbarItems.split(',')] : [['Bold', 'BulletedList', 'Link']]),
                        toolbarLocation: (attrs.toolbarLocation ? attrs.toolbarLocation : 'bottom'),
                        toolbarCanCollapse: false,
                        removePlugins: 'elementspath',
                        extraPlugins : 'autogrow',
                        autoGrow_onStartup: true,
                        autoGrow_minHeight: 150,
                        resize_enabled: false,
                        forcePasteAsPlainText: true,
                        linkShowAdvancedTab: false,
                        linkShowTargetTab: false,
                        entities: false
                    }, element.val());

                    editor.on('contentDom', function() {
                        // trigger original input focus/blur event callbacks on plugin input element
                        angular.forEach(['focus', 'blur'], function(event) {
                            editor.on(event, function() {
                                element.triggerHandler(event);
                            });
                        });

                        function update() {
                            var content = editor.getData().replace(/<p>\n\t/gi, '<p>').replace(/\n$/, '');       // cleanup CKEditor result
                            $parse(attrs.ngModel).assign(scope, content);
                            scope.$apply();
                        }
                        editor.document.on('keyup', update);
                        editor.on('focus', update);
                        editor.on('blur', update);
                        editor.on('afterCommandExec', update);
                    });

                    ctrl.$parsers.push(function(value) {
                        editor.setData(value);
                    });
                });
            }
        };
    }]);
})(window.angular, window);

(function(angular, $window) {
    'use strict';

    var module = angular.module('ngx.ui.confirm', ['ngx.dictionary']);

    /**
     * On click confirmation
     */
    module.directive('ngxConfirm', ['ngxDictionary', function(ngxDictionary) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var message = attrs.ngxConfirm ? attrs.ngxConfirm : ngxDictionary('NGX_UI_CONFIRM');
                element.bind('click', function(event) {
                    if(!$window.confirm(message)) {
                        event.preventDefault();
                    }
                });
            }
        };
    }]);

})(window.angular, window);
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

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.geomap', ['ngx.ui.smap']);

    /**
     * Geomap directive
     */
    module.directive('ngxGeomap', ['$compile', function($compile) {
        return {
            link: function(scope, element, attrs) {
                attrs.$set('ngxGeomap', undefined);
                attrs.$set('ngxSmap', '');
                $compile(element)(scope);
            }
        };
    }]);
})(window.angular);

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.hashtagInput', []);

    /**
     * Hash tag (twitter)
     */
    module.directive('ngxHashtagInput', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                ctrl.$parsers.push(function(value) {
                    if (value === '' || value === '#' || typeof(value) !== 'string') {
                        value = '';
                    } else {
                        value = '#' + value.replace(/^([#]+)/, '');
                    }

                    element.val(value);

                    // validate
                    ctrl.$setValidity('hashtag', !(value && value.substring(1).match(/(\s|#)/)));

                    return value;
                });
            }
        };
    });

})(window.angular);

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
                function showSourceImage(sourceImage) {
                    var $sourceImage = $(sourceImage),
                        sourceWidth = ($sourceImage.data('width') ? $sourceImage.data('width') : sourceImage.width),
                        sourceHeight = ($sourceImage.data('height') ? $sourceImage.data('height') : sourceImage.height);

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
                                showSourceImage(this);
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

// IE8 support
document.createElement('ngx-invalid');

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.invalid', []);

    /**
     * Input/Form invalid status
     */
    module.directive('ngxInvalid', ['$window', function($window) {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                element.addClass('ngx-invalid');

                var parts = (attrs.ngxInvalid ? attrs.ngxInvalid.split(' ') : []),
                    input = (attrs.input ? attrs.input : parts[0]),
                    errors = (attrs.error ? attrs.error : parts[1]),
                    scrollable = (attrs.ngxScrollable !== undefined ? true : false),
                    watch = [];

                scope.elementOffset = 0;

                // error types
                if (errors) {
                    // can be comma-separated list
                    angular.forEach(errors.split(','), function(type) {
                        watch.push(input + '.$error.' + type);
                    });
                } else {
                    watch.push(input + '.$invalid');
                }

                watch = [watch.length > 1 ? '(' + watch.join(' || ') + ')' : watch[0]];

                if (attrs.ngShow) {
                    watch.push(attrs.ngShow);
                }
                if (attrs.expression) {
                    watch.push(attrs.expression);
                }

                scope.$watch('elementOffset', function(value, oldvalue) {
                    if(value !== oldvalue && value !== null) {
                        $window.scrollTo(0, value.top - 50);
                    }
                });

                scope.$watch(watch.join(' && '), function(value) {
                    element.toggle(value ? true : false);
                    if(value === true && scrollable) {
                        scope.elementOffset = $('.ngx-invalid:visible:eq(0)').offset();
                    }
                });
            }
        };
    }]);

})(window.angular, window.jQuery);

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.lightbox', ['ngx.config', 'ngx.loader']);

    /**
     * Lightbox directive
     */
    module.directive('ngxLightbox', ['ngxConfig', 'ngxLoader', function(ngxConfig, ngxLoader) {
        var deps = [
            ngxConfig.libsPath + 'jquery.fancybox/jquery.fancybox.js',
            ngxConfig.libsPath + 'jquery.fancybox/css/fancybox.css'
        ];

        return {
            link: function(scope, element, attrs) {
                // group tag
                if (attrs.ngxLightbox) {
                    element.attr('rel', attrs.ngxLightbox);
                }

                ngxLoader(deps, function() {
                    $(element).fancybox({
                        onStart: function(items, index, options) {
                            var arrowStyle = {
                                height: '100%',
                                bottom: 0
                            };

                            angular.extend(options, {
                                href: (attrs.href || attrs.src),
                                title: attrs.title,
                                titlePosition: 'inside',
                                speedIn: 150,
                                speedOut: 150
                            });

                            // autoset options by attributes
                            if (options.href.match(/youtube\.com/)) {
                                // youtube video
                                angular.extend(options, {
                                    type: 'swf',
                                    href: attrs.href + '?autoplay=1&fs=1',        // AS3 + autoplay + fullscreen
                                    width: 661,
                                    height: 481,
                                    swf: {
                                        wmode: 'transparent',
                                        allowfullscreen: true
                                    }
                                });
                                angular.extend(arrowStyle, {
                                    height: '40%',
                                    bottom: '30%'
                                });

                            } else if (options.href.match(/(jpg|png|gif|bmp)$/) || options.href.match(/^data:image\//)) {
                                // image
                                options.type = 'image';

                            } else {
                                // iframe
                                angular.extend(options, {
                                    type: 'iframe',
                                    width: '90%',
                                    height: '95%'
                                });
                            }

                            // override default options from attributes
                            angular.forEach(['width', 'height', 'title', 'type'], function(attr) {
                                if (attrs[attr]) {
                                    options[attr] = attrs[attr];
                                }
                            });

                            $('#fancybox-left').css(arrowStyle);
                            $('#fancybox-right').css(arrowStyle);

                            return options;
                        }
                    });
                });
            }
        };
    }]);

})(window.angular, window.jQuery);

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

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.scrollTo', []);

    /**
     * Scroll to on click
     */
    module.directive('ngxScrollTo', function() {
        return function(scope, element, attrs) {
            element.bind('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $(attrs.ngxScrollTo).offset().top + (attrs.offset ? parseInt(attrs.offset, 10) : 0) }, 600);
                return false;
            });
        };
    });

})(window.angular, window.jQuery);

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.smap', ['ngx.smap']);

    /**
     * SMap directive
     */
    module.directive('ngxSmap', ['ngxSmap', function(ngxSmap) {
        return {
            link: function(scope, element, attrs) {
                element.addClass('ngx-smap');

                // create map
                var map = ngxSmap(element[0]);
                map.create({
                    controls: attrs.controls
                });

                // assign to element data
                element.data('ngx.ui.geomap', map);

                function setCoords(coords) {
                    map.setCenter(coords, {
                        zoom: true,
                        marker: true
                    });
                }

                // coords supplied in attribute
                attrs.$observe('coords', function(coords) {
                    if (coords) {
                        setCoords(coords);
                    }
                });
            }
        };
    }]);

})(window.angular);

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.tagsInput', ['ngx.config', 'ngx.loader']);

    /**
     * Tags input
     */
    module.directive('ngxTagsInput', ['$http', '$filter', '$timeout', 'ngxConfig', 'ngxLoader', function($http, $filter, $timeout, ngxConfig, ngxLoader) {
        var deps = [
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.js',
            ngxConfig.libsPath + 'jquery.tagsinput/jquery.tagsinput.css'
        ];

        var counter = 0;

        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                // minimum/maximum allowed tags count
                var minCount = (attrs.min ? parseInt(attrs.min, 10) : null),
                    maxCount = (attrs.max ? parseInt(attrs.max, 10) : null);

                element = $(element);

                // tagsInput required "id" attribute
                if (!attrs.id) {
                    attrs.$set('id', 'tags_input_' + (counter++));
                }

                // autocomplete definition
                var autocomplete;
                if (attrs.autocompleteUrl || attrs.autocompleteSource) {
                    autocomplete = {
                        url: (attrs.autocompleteUrl ? attrs.autocompleteUrl : true),
                        data: (attrs.autocompleteSource ? scope.$eval(attrs.autocompleteSource) : undefined),
                        source: function(request, response) {
                            // load data
                            if (autocomplete.data === undefined) {
                                $http.get(autocomplete.url)
                                    .success(function(data) {
                                        autocomplete.data = data;
                                        response(autocomplete.filter(request.term));
                                    });
                            } else {
                                response(autocomplete.filter(request.term));
                            }
                        },
                        filter: function(term) {
                            return $filter('filter')(autocomplete.data, term);
                        }
                    };
                }

                ngxLoader(deps, function() {
                    // apply tagsInput plugin ... cannot be used in linking phase due to unexpected DOM transformations
                    element.tagsInput({
                        autocomplete_url: (autocomplete ? autocomplete.url : undefined),
                        autocomplete: (autocomplete ? {
                            source: autocomplete.source,
                            minLength: (attrs.autocompleteMinLength ? parseInt(attrs.autocompleteMinLength, 10) : 2)
                        } : undefined),
                        maxChars: 30,
                        maxCount: (maxCount ? maxCount : null),
                        width: null,
                        height: null,
                        defaultText: '',
                        onChange: function(tagsInput) {
                            var handler = element.data('ngx.tagsInput.onchange');
                            if (handler) {
                                handler($(tagsInput).val());
                            }
                        }
                    });

                    // trigger original input focus/blur event callbacks on plugin input element
                    var tagElement = $('#' + attrs.id + '_tag');
                    angular.forEach(['focus', 'blur'], function(event) {
                        tagElement.bind(event, function() {
                            element.triggerHandler(event, [this]);
                        });
                    });

                    // string view value <=> array model value
                    ctrl.$parsers.push(function(value) {
                        var values;

                        if (typeof(value) === 'string' && value.length) {
                            values = value.split(',');
                        }

                        // validate allowed tags count
                        if (minCount) {
                            ctrl.$setValidity('min', (values && values.length >= minCount));
                        }
                        if (maxCount) {
                            ctrl.$setValidity('max', (values ? values.length <= maxCount : true));
                        }
                        return values;
                    });

                    ctrl.$render = function() {
                        if (ctrl.$modelValue) {
                            element.importTags(ctrl.$modelValue.join(','));
                        }
                    };

                    element.data('ngx.tagsInput.onchange', function(value) {
                        $timeout(function() {
                            ctrl.$setViewValue(value);
                        }, 0);
                    });
                });
            }
        };
    }]);
})(window.angular, window.jQuery);
(function(angular, $) {
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
     */
    module.directive('ngxTextCurtain', ['ngxDictionary', function (ngxDictionary) {
        return {
            compile: function (element, attrs) {
                // vars from attrs
                var defaultTx = angular.isDefined(attrs.curtainText) ? attrs.curtainText : ngxDictionary('NGX_UI_CURTAINTEXT_SHOW');
                var defaultTxHide = angular.isDefined(attrs.curtainTextHide) ? attrs.curtainTextHide : ngxDictionary('NGX_UI_CURTAINTEXT_HIDE');
                var minHeight = angular.isDefined(attrs.curtainMinHeight) ? parseInt(attrs.curtainMinHeight, 10) : null;
                var minNumChars = angular.isDefined(attrs.curtainMinChars) ? attrs.curtainMinChars : 800;
                var cHeight = angular.isDefined(attrs.curtainHeight) ? attrs.curtainHeight : "100px";
                
                // fixed vars
                var button = $('<div class="show-more-desc"><span><a>' + defaultTx + '</a></span></div>');
                var bottomGradient = $('<div class="bottom-grad"></div>');
                var cMaxHeight;
                var bodyTopPosition;
                var elTopPosition;

                element.ready(function() {
                    cMaxHeight = element.height();
                    if((minHeight && cMaxHeight > minHeight) || (element.text().length > minNumChars)) {
                        element.addClass('short-desc');
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
                                    element.find('.bottom-grad').remove();
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
    }]);

})(window.angular, window.jQuery);
(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.timeInput', []);

    /**
     * Time input type
     */
    module.directive('ngxTimeInput', ['$parse', function($parse) {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                // related date input
                var dateInput;
                if (attrs.dateInput) {
                    dateInput = $parse(attrs.dateInput)(scope);
                    dateInput.timeInput = ctrl;    // back reference
                }

                // autocomplete
                var values = [];
                for (var h = 0; h <= 23; h++) {
                    for (var m = 0; m <= 59; m = m + 15) {
                        values.push((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m));
                    }
                }
                element.autocomplete({
                    source: values,
                    minLength: 0,
                    delay: 0,
                    open: function() {
                        element.autocomplete('widget').css('width', '60px');
                    },
                    select: function(event, ui) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(ui.item.value);
                        });
                    }
                }).focus(function() {
                        element.autocomplete('search', element.val());
                    });

                ctrl.$parsers.push(function(value) {
                    ctrl.hours = undefined;
                    ctrl.minutes = undefined;

                    // validation
                    var valid = true;
                    if (value && value.length) {
                        var re = new RegExp('([0-9]{1,2}):([0-9]{2})$').exec(value);
                        valid = (re && re[1] >= 0 && re[1] <= 23 && re[2] >= 0 && re[2] <= 59);
                        if (valid) {
                            ctrl.hours = parseInt(re[1], 10);
                            ctrl.minutes = parseInt(re[2], 10);
                        }
                    }

                    ctrl.$setValidity('time', valid);

                    if (dateInput) {
                        dateInput.$setViewValue(dateInput.$viewValue);
                    }

                    return value;
                });
            }
        };
    }]);

})(window.angular);

(function(angular, $) {
    'use strict';

    var module = angular.module('ngx.ui.tooltip', []);

    /**
     * Tooltip
     * @todo attribute directive on element
     */
    module.directive('ngxTooltip', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="ngx-tooltip" ng-transclude><span class="arrow"><span></span></span></div>',
            link: function(scope, element, attrs) {
                /** @todo */
                if (attrs.ngxTooltip) {
                    return;
                }

                // bind focus/blur events to input elements
                (attrs.element ? $(attrs.element) : element.prevAll('input,select,textarea')).bind({
                    focus: function(event, trigger) {
                        if (trigger && $(trigger).is(':disabled')) {
                            return;
                        }
                        element.show();
                    },
                    blur: function() {
                        element.hide();
                    }
                });

                element.hide();
            }
        };
    });

})(window.angular, window.jQuery);

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.translate', ['ngx.dictionary']);

    var markupSymbol;

    module.config(['$interpolateProvider', function($interpolateProvider) {
        markupSymbol = $interpolateProvider.startSymbol();
    }]);

    module.directive('ngxTranslate', ['ngxDictionary', '$interpolate', '$log', function(ngxDictionary, $interpolate) {
        return {
            link: function(scope, element, attrs) {
                var key = (attrs.ngxTranslate ? attrs.ngxTranslate : element.html());
                if (key.length) {
                    var translated = ngxDictionary(key, attrs.language);

                    // handle bindings in translation
                    if (translated.indexOf(markupSymbol) !== -1) {
                        scope.$watch(function() {
                            return $interpolate(translated)(scope);
                        }, function(value) {
                            element.html(value);
                        });
                    }

                    element.html(translated);
                }
            }
        };
    }]);

})(window.angular);

(function(angular, console) {
    'use strict';

    var module = angular.module('ngx.ui.validate', []);

    /**
     * Validates input against scope function
     */
    module.directive('ngxValidate', function() {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function(scope, element, attrs, ctrl) {
                var validators = scope.$eval(attrs.ngxValidate ? attrs.ngxValidate : attrs.validators);

                if (!angular.isObject(validators)) {
                    validators = { validation: validators };
                }

                angular.forEach(validators, function(validator, key) {
                    var ctrls = (ctrl ? [ctrl] : []);

                    // array notation.. { key: [validator, ctrl, ctrl, ctrl] }
                    if (angular.isArray(validator)) {
                        angular.forEach(validator.slice(1), function(value) {
                            ctrls.push(value);
                        });
                        validator = validator[0];
                    }
                    if (!angular.isFunction(validator)) {
                        return;
                    }

                    function validate(value) {
                        var args = [],
                            valid;

                        if (ctrls.length > 1) {
                            angular.forEach(ctrls, function(ctrl) {
                                args.push(ctrl.$viewValue);
                            });
                        } else {
                            args.push(value);
                        }

                        valid = validator.apply(scope, args);
                        angular.forEach(ctrls, function(ctrl) {
                            ctrl.$setValidity(key, valid);
                        });

                        return (valid ? value : undefined);
                    }

                    angular.forEach(ctrls, function(ctrl) {
                        ctrl.$formatters.push(validate);
                        ctrl.$parsers.push(validate);
                    });
                });
            }
        };
    });
})(window.angular, window.console);

(function(angular) {
    'use strict';

    var module = angular.module('ngx.ui.wwwInput', []);

    /**
     * Www input type
     * Similar to url, but with protocol prefix completion and only http|https protocols are allowed
     */
    module.directive('ngxWwwInput', function() {
        // regular expressions ... http://docs.jquery.com/Plugins/Validation/Methods/url
        var format = /https?:\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        var protocol = /^https?:\/\//;

        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                function parse(value) {
                    var result = (value !== undefined && value.length ? (!protocol.test(value) ? 'http://' + value : value) : undefined),
                        valid = !(result && result.length && !format.test(result));

                    // validation
                    ctrl.$setValidity('www', valid);
                    return (valid ? result : value);
                }

                ctrl.$parsers.push(parse);
                ctrl.$render = function() {
                    ctrl.$setViewValue(ctrl.$viewValue);
                    element.val(ctrl.$modelValue);
                };
            }
        };
    });

})(window.angular);

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
                attrs.$set('ngxWysiwyg', undefined);
                attrs.$set('ngxCkeditor', '');
                $compile(element)(scope);
            }
        };
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    var ngxUtils = {};

    /**
     * Recursive angular.extend
     * @param dst
     * @param src
     * @return {Object}
     */
    ngxUtils.extendRecursive = function(dst, src) {
        angular.forEach(arguments, function(obj, index) {
            if (index === 0) {
                return;
            }
            angular.forEach(obj, function(value, property) {
                if (angular.isObject(value) && angular.isObject(dst[property])) {
                    ngxUtils.extendRecursive(dst[property], value);
                } else {
                    dst[property] = value;
                }
            });
        });

        return dst;
    };

    /**
     * If value is undefined return defaultValue otherwise return value.
     * @param {*} value
     * @param {*} defaultValue
     * @returns {*}
     */
    ngxUtils.noUndefined = function (value, defaultValue) {
        if (value !== undefined) {
            return value;
        }

        return defaultValue;
    };

    angular.module('ngx.utils', [])
       .value('ngxUtils', ngxUtils);

})(window.angular);

(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_CONFIRM: 'Jste si jisti, že chcete pokračovat?'
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_CONFIRM: 'Are you sure you want to continue?'
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.confirm').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_CONFIRM: 'Czy jesteś pewien, że chcesz kontynuować?'
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_DATEINPUT_NOW: 'Nyní',
            NGX_UI_DATEINPUT_NEXT: 'Další',
            NGX_UI_DATEINPUT_PREV: 'Předchozí',
            NGX_UI_DATEINPUT_CLOSE: 'Zavřít',
            NGX_UI_DATEINPUT_DAYS: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
            NGX_UI_DATEINPUT_MONTHS: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_DATEINPUT_NOW: 'Now',
            NGX_UI_DATEINPUT_NEXT: 'Next',
            NGX_UI_DATEINPUT_PREV: 'Previous',
            NGX_UI_DATEINPUT_CLOSE: 'Close',
            NGX_UI_DATEINPUT_DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            NGX_UI_DATEINPUT_MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.dateInput').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_DATEINPUT_NOW: 'Teraz',
            NGX_UI_DATEINPUT_NEXT: 'Następny',
            NGX_UI_DATEINPUT_PREV: 'Poprzedni',
            NGX_UI_DATEINPUT_CLOSE: 'Koniec',
            NGX_UI_DATEINPUT_DAYS: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
            NGX_UI_DATEINPUT_MONTHS: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'náhled',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Sem přetáhněte obrázek',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'nebo můžete...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'vybrat z počítače',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maximální povolené rozměry obrázku jsou {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Nahrát',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Zrušit',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Neplatný obrázek',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Chyba při zpracování obrázku anebo neplatný obrázek'
        });
    }]);

})(window.angular);


(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'preview',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Drag image here',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'or...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'choose from your disk',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maximum allowed dimensions are {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Submit',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Cancel',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Invalid image',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Error processing image or invalid image'
        });
    }]);

})(window.angular);


(function(angular) {
    'use strict';

    angular.module('ngx.ui.imageupload').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_IMAGEUPLOAD_PREVIEW: 'podgląd',
            NGX_UI_IMAGEUPLOAD_INPUT_DRAG: 'Upuścić obraz',
            NGX_UI_IMAGEUPLOAD_INPUT_OR: 'lub możecie...',
            NGX_UI_IMAGEUPLOAD_INPUT_BROWSE: 'wybrać z komputera',
            NGX_UI_IMAGEUPLOAD_SCALE_INFO: 'maksymalne wymiary obrazu są {{resultWidth}} x {{resultHeight}}',
            NGX_UI_IMAGEUPLOAD_DIALOG_SUBMIT: 'Wgraj',
            NGX_UI_IMAGEUPLOAD_DIALOG_CANCEL: 'Anulować',
            NGX_UI_IMAGEUPLOAD_INVALID_IMAGE: 'Nieprawidłowy obraz',
            NGX_UI_IMAGEUPLOAD_PROCESS_ERROR: 'Błąd przy przetwarzaniu obrazu lub nieprawidłowy obraz'
        });
    }]);

})(window.angular);
(function (angular) {
    'use strict';

    angular.module('ngx.ui.rating').run(['ngxDictionary', function (ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_RATING_CLEAR: 'vynulovat'
        });
    }]);
})(window.angular);

(function (angular) {
    'use strict';

    angular.module('ngx.ui.rating').run(['ngxDictionary', function (ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_RATING_CLEAR: 'clear'
        });
    }]);
})(window.angular);

(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('cs', {
            NGX_UI_CURTAINTEXT_SHOW: 'zobrazit více',
            NGX_UI_CURTAINTEXT_HIDE: 'zobrazit méně'
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('en', {
            NGX_UI_CURTAINTEXT_SHOW: 'show more',
            NGX_UI_CURTAINTEXT_HIDE: 'hide'
        });
    }]);

})(window.angular);
(function(angular) {
    'use strict';

    angular.module('ngx.ui.textCurtain').run(['ngxDictionary', function(ngxDictionary) {
        ngxDictionary.addItems('pl', {
            NGX_UI_CURTAINTEXT_SHOW: 'pokaż więcej',
            NGX_UI_CURTAINTEXT_HIDE: 'schowaj'
        });
    }]);

})(window.angular);