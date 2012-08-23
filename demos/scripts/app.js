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

    app.config(['$routeProvider', function($routeProvider) {
        angular.forEach(modules, function(name) {
            $routeProvider.when('/' + name, {
                templateUrl: 'templates/' + name + '.html',
                module: name
            });
        });
        $routeProvider.otherwise({
            redirectTo: '/' + modules[0]
        });
    }]);

    app.controller('ngxCtrl', ['$scope', '$route', '$location', function($scope, $route, $location) {
        $scope.modules = modules;
        $scope.$on('$routeChangeSuccess', function(event, route) {
            $scope.module = route.module;
        });
        $scope.load = function(m) {
            $location.path('/' + m);
        };

        $scope.checkboxlist = {
            items: {
                201600001: 'A',
                201600002: 'B',
                201600003: 'C',
                201600004: 'D'
            },
            selected: ['201600001', '201600003']
        };
        $scope.hashtag = '#test';
        $scope.www = 'lmc.eu';
        $scope.wysiwyg = '<p>lorem ipsum <strong>strong</strong></p>';
        $scope.tags = ['tag1', 'tag2', 'tag3'];
        $scope.coords = {
            lat: 50.1028650,
            lon: 14.4568872
        };
        $scope.addresses = [{
            "label": "Jankovcova 1569/2c, 170 00 Praha, Česká republika",
            "coords": {
                "lon": 14.456887168480652,
                "lat": 50.10286494790839
            }
        }, {
            "label": "Stračenská 616, 411 08 Štětí, Česká republika",
            "coords": {
                "lon": 14.381299871658682,
                "lat": 50.45214591776182
            }
        }];
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
    }]);

})(window.angular, window);