# ngx-library

Simple extension library for [AngularJS] used in LMC projects. Mostly UI components, inspired by [Angular-UI] project.

[![Build Status](https://secure.travis-ci.org/lmc-eu/ngx-library.png?branch=master)](http://travis-ci.org/lmc-eu/ngx-library)


## Prerequisites

- [Node.js]
- [NPM]


## Installation

````bash
npm install -g grunt

# in your local ngx folder
npm install
grunt
````

... and try demos


## Requirements

- AngularJS v1.0+
- jQuery, jQuery UI - for some directives

## Licence

- MIT

## To do

This is an initial open-sourced version of this library, more to come soon.

- ngx.ui.imageupload with flash upload for browsers without File API (IE8)
- more global configuration via ngxConfig
- separate modules which use external libraries (ngx.ui.fancybox, ngx.ui.jqDialog, ngx.ui.twDialog) with configurable usage in ngx.ui.wysiwyg/lightbox/dialog
- more demos
- documentation
- tests
- dependency map
- custom build
- lots of refactoring

[AngularJS]: http://angularjs.org/
[Angular-UI]: https://github.com/angular-ui/angular-ui
[Node.js]: http://nodejs.org/
[NPM]: http://npmjs.org/
