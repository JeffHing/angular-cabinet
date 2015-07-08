/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Accordion directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var cabinetDirective = require('angular-cabinet-directive');

require('./accordionDirective.css');

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = function(moduleName) {

    cabinetDirective(moduleName, {
        directiveNames: {
            cabinet: 'accordion',
            drawerTrigger: 'accordionTrigger',
            drawerContents: 'accordionContents',
            drawerClass: 'accordionClass',
            drawerHandler: 'accordionHandler'
        }
    });
};
