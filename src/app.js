/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Application entry point.
 */
'use strict';

//-------------------------------------
// Initialize Angular
//-------------------------------------

require('angular');
require('ui-router');

angular.module('app', ['ui.router']);

//-------------------------------------
// Initialize core UI
//-------------------------------------

require('./app.css');

require('angular-cabinet-ui')('app');

require('./directives/examples/accordion/directive')('app');
require('./directives/examples/menus/directive')('app');
require('./directives/examples/sidebar/directive')('app');
require('./directives/examples/tabs/directive')('app');

//-------------------------------------
// Initialize routes
//-------------------------------------

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('shell', {
            url: '/',
            template: require('./views/shell/view.html')
        })
        .state('shell.accordion', {
            url: 'accordion',
            template: require('./views/examples/accordion/view.html')
        })
        .state('shell.menus', {
            url: 'menus',
            template: require('./views/examples/menus/view.html')
        })
        .state('shell.sidebar', {
            url: 'sidebar',
            template: require('./views/examples/sidebar/view.html')
        })
        .state('shell.tabs', {
            url: 'tabs',
            template: require('./views/examples/tabs/view.html')
        });
});
