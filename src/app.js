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
require('./app.css');

var cabinetDirective = require('angular-cabinet-ui');

var examplesHtml = require('./examples/examples.html');
var accordionDirective = require('./examples/accordionDirective/accordionDirective');
var accordionHtml = require('./examples/accordionDirective/accordion.html');
var menusDirective = require('./examples/menusDirective/menusDirective');
var menusHtml = require('./examples/menusDirective/menus.html');
var sidebarDirective = require('./examples/sidebarDirective/sidebarDirective');
var sidebarHtml = require('./examples/sidebarDirective/sidebar.html');
var tabsDirective = require('./examples/tabsDirective/tabsDirective');
var tabsHtml = require('./examples/tabsDirective/tabs.html');

//-------------------------------------
// Entry point
//-------------------------------------

angular.module('app', ['ui.router'])

// Configure router.
.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('examples', {
            url: '/',
            template: examplesHtml
        })
        .state('examples.accordion', {
            url: 'accordion',
            template: accordionHtml
        })
        .state('examples.menus', {
            url: 'menus',
            template: menusHtml
        })
        .state('examples.sidebar', {
            url: 'sidebar',
            template: sidebarHtml
        })
        .state('examples.tabs', {
            url: 'tabs',
            template: tabsHtml
        });
});

// Add directives to module.
cabinetDirective('app');
accordionDirective('app');
menusDirective('app');
sidebarDirective('app');
tabsDirective('app');
