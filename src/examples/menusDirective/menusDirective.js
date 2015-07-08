/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Menus directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet-directive');

require('./menusDirective.css');

//--------------------------------------
// Module exports
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
