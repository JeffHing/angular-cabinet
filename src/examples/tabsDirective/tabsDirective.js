/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * tabs directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet');

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
