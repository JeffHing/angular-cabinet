/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Tabs directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet-directive');

require('./tabsDirective.css');

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = function(moduleName) {

    cabinetDirective(moduleName, {
        oneAlwaysOpen: true,

        directiveNames: {
            cabinet: 'tabs',
            drawerTrigger: 'tabTrigger',
            drawerContents: 'tabContents',
            drawerClass: 'tabClass'
        }
    });
};
