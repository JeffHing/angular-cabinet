/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Application entry point.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

require('angular');
require('ui-router');

var cabinetDirective = require('angular-cabinet-directive');
var tabsDirective = require('./examples/tabsDirective/tabsDirective');

var examplesHtml = require('./examples/examples.html');

//-------------------------------------
// Entry point
//-------------------------------------

angular.module('app', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('examples', {
        url: '/',
        template: examplesHtml
    });
});

cabinetDirective('app');
tabsDirective('app');
