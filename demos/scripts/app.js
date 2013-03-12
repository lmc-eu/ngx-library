(function(angular, window) {
    'use strict';

    /**
     * Demo modules
     * @type {Array}
     */
    var modules = [
        'ngx.ui.addressInput',
        'ngx.ui.checkboxlist',
        'ngx.ui.confirm',
        'ngx.ui.dateInput',
        'ngx.ui.dialog',
        'ngx.ui.geomap',
        'ngx.ui.hashtagInput',
        'ngx.ui.imageupload',
        'ngx.ui.invalid',
        'ngx.ui.lightbox',
        'ngx.ui.rating',
        'ngx.ui.scrollTo',
        'ngx.ui.tagsInput',
        'ngx.ui.textCurtain',
        'ngx.ui.validate',
        'ngx.ui.wwwInput',
        'ngx.ui.wysiwyg'
    ];

    /**
     * Initialize application module
     * @type {*}
     */
    var app = angular.module('ngxDemoApp', ['ngx']);

    /**
     * Setup routes
     */
    app.config(function($routeProvider) {
        angular.forEach(modules, function(name) {
            $routeProvider.when('/' + name, {
                templateUrl: 'templates/' + name + '.html',
                module: name
            });
        });
        $routeProvider.otherwise({
            redirectTo: '/' + modules[0]
        });
    });

    /**
     * Startup
     */
    app.run(function(ngxDictionary) {
        ngxDictionary.setLanguage('en');
    });

    /**
     * Main controller
     */
    app.controller('ngx', function($scope, $route, $location) {
        $scope.modules = modules;

        $scope.$on('$routeChangeSuccess', function(event, route) {
            $scope.module = route.module;
        });

        $scope.load = function(m) {
            $location.path('/' + m);
        };

        $scope.getContentClass = function() {
            return ($scope.module ? $scope.module.replace(/\./g, '-') : '');
        };
    });

    /**
     * ngx.ui.checkboxlist demo controller
     */
    app.controller('ngx.ui.checkboxlist', function($scope) {
        $scope.checkboxlist = {
            items: {
                'bb': 'Backbone',
                'gc': 'Google Closure',
                'jq': 'jQuery',
                'ng': 'AngularJS'
            },
            selected: ['ng', 'gc']
        };
    });

    /**
     * ngx.ui.hashtagInput demo controller
     */
    app.controller('ngx.ui.hashtagInput', function($scope) {
        $scope.hashtag = '#test';
    });

    /**
     * ngx.ui.wwwInput demo controller
     */
    app.controller('ngx.ui.wwwInput', function($scope) {
        $scope.www = 'lmc.eu';
    });

    /**
     * ngx.ui.wysiwyg demo controller
     */
    app.controller('ngx.ui.wysiwyg', function($scope) {
        $scope.wysiwyg = '<p>lorem ipsum <strong>strong</strong></p>';
    });

    /**
     * ngx.ui.tagsInput demo controller
     */
    app.controller('ngx.ui.tagsInput', function($scope) {
        $scope.tags = ['tag1', 'tag2', 'tag3'];
    });

    /**
     * ngx.ui.geomap demo controller
     */
    app.controller('ngx.ui.geomap', function($scope) {
        $scope.coords = {
            lat: 50.1028650,
            lon: 14.4568872
        };
    });

    /**
     * ngx.ui.dialog demo controller
     */
    app.controller('ngx.ui.dialog', function($scope) {
        $scope.dialog = {
            input: undefined,
            submit: function(inputValue, $dialog) {
                window.alert('submitted ' + (inputValue === undefined ? 'empty' : '"' + inputValue + '"'));
                $dialog.close();
            },
            onclose: function() {
                $scope.dialog.input = undefined;
            }
        };
    });

    /**
     * ngx.ui.validate demo controller
     */
    app.controller('ngx.ui.validate', function($scope) {
        $scope.validateEven = function(number) {
            return (!number || ((number % 2) === 0));
        };
        $scope.validatePassword = function(cpassword, password) {
            return (!password && !cpassword) || (password === cpassword);
        };
        $scope.validateFavorites = function(movie, actor, later) {
            return (later ? true : (movie && actor));
        };
    });

    /**
     * ngx.ui.rating demo controller
     */
    app.controller('ngx.ui.rating', function($scope) {
        $scope.ratingLevel = 3;
        $scope.ratingLevel2 = 2;
        $scope.ratingLevel3 = 7;
        $scope.ratingLevel4 = 3;
        $scope.ratingLevel5 = 3;
        $scope.ratingLevel6 = 3;
        $scope.ratingLog = 'ratingLevel6 log:<br>';
        $scope.$watch('ratingLevel6', function (level) {
            $scope.ratingLog += '&bull; level ' + level + ' selected<br>';
        })
    });

})(window.angular, window);
