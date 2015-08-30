/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * sidebar directive.
 */
'use strict';

//--------------------------------------
// Dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet-ui');

require('./directive.css');

//--------------------------------------
// Exports
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
