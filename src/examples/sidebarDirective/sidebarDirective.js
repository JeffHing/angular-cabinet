/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * sidebar directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet');

require('./sidebarDirective.css');

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = function(moduleName) {

    cabinetDirective(moduleName, {
        directiveNames: {
            cabinet: 'sidebar',
            drawerTrigger: 'sidebarTrigger',
            drawerContents: 'sidebarContents',
            drawerClass: 'sidebarClass'
        }
    });
};
