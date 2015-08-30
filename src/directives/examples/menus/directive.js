/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * menus directive.
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
        openOnHover: true,

        directiveNames: {
            cabinet: 'menus',
            drawerTrigger: 'menuTrigger',
            drawerContents: 'menuContents',
            drawerClass: 'menuClass'
        }
    });
};
