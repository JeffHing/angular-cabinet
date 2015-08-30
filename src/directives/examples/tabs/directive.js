/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * tabs directive.
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
        oneAlwaysOpen: true,

        directiveNames: {
            cabinet: 'tabs',
            drawerTrigger: 'tabTrigger',
            drawerContents: 'tabContents',
            drawerClass: 'tabClass'
        }
    });
};
