(function(angular, window) {
    'use strict';

    var modules = [
        'ngx.ui.invalid',
        'ngx.ui.scrollTo',
        'ngx.ui.wwwInput',
        'ngx.ui.dateInput',
        'ngx.ui.hashtagInput',
        'ngx.ui.checkboxlist',
        'ngx.ui.tagsInput',
        'ngx.ui.dialog',
        'ngx.ui.wysiwyg',
        'ngx.ui.imageupload',
        'ngx.ui.lightbox',
        'ngx.ui.geomap',
        'ngx.ui.addressInput'
    ];

    var app = angular.module('ngxDemoApp', modules.concat(['ngx.ui.timeInput']));

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

    app.run(function(ngxDictionary) {
        ngxDictionary.setLanguage('en');
    });

    app.controller('ngxCtrl', function($scope, $route, $location) {
        $scope.modules = modules;

        $scope.$on('$routeChangeSuccess', function(event, route) {
            $scope.module = route.module;
        });

        $scope.load = function(m) {
            $location.path('/' + m);
        };

        $scope.checkboxlist = {
            items: {
                'bb': 'Backbone',
                'gc': 'Google Closure',
                'jq': 'jQuery',
                'ng': 'AngularJS'
            },
            selected: ['ng', 'gc']
        };

        $scope.hashtag = '#test';
        $scope.www = 'lmc.eu';
        $scope.wysiwyg = '<p>lorem ipsum <strong>strong</strong></p>';
        $scope.tags = ['tag1', 'tag2', 'tag3'];

        $scope.coords = {
            lat: 50.1028650,
            lon: 14.4568872
        };

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

        $scope.getContentClass = function() {
            return ($scope.module ? $scope.module.replace(/\./g, '-') : '');
        };
    });

})(window.angular, window);