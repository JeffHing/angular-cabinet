/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Configuration object for cabinet directive.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var SNAKE_CASE_REGEXP = /[A-Z]/g;

//-------------------------------------
// Exports
//-------------------------------------

module.exports = CabinetConfig;

//-------------------------------------
// Configuration object
//-------------------------------------

/*
 * Manages the configuration options for the cabinet directive.
 *
 * @constructor
 * @param {object} [options]
 */
function CabinetConfig(options) {

    this.openOnHover = false;
    this.oneAlwaysOpen = false;
    this.allowMultipleOpen = false;
    this.openStates = {};

    // The directive classes should only be accessed through the
    // getDirectiveClass() function. They are initially derived from
    // the directive names using camelcase to snakecase conversion.
    this.directiveClasses = {};

    // The directive names should not be modified after
    // the directives are created.
    this.directiveNames = {
        cabinet: 'cabinet',
        drawerTrigger: 'drawerTrigger',
        drawerContents: 'drawerContents',
        drawerClass: 'drawerClass'
    };

    // Directive names are only valid when passed through constructor.
    if (options && options.directiveNames) {
        angular.extend(this.directiveNames, options.directiveNames);
    }

    // Get directive classes from directive names or options.
    var hasDirectiveClasses = options && options.directiveClasses;
    for (var key in this.directiveNames) {
        var directiveName = this.directiveNames[key];
        var directiveClass;

        if (hasDirectiveClasses && options.directiveClasses[key]) {
            directiveClass = options.directiveClasses[key];

        } else {
            directiveClass = this.snakeCase(directiveName);
        }
        this.directiveClasses[directiveName] = directiveClass;
    }

    if (options) {
        this.copyOptions(options);
    }
}

var proto = CabinetConfig.prototype;

/*
 * Copy valid options into config.
 *
 * @param {object} options
 */
proto.copyOptions = function(options) {
    var i, key;

    var booleanKeys = ['openOnHover', 'oneAlwaysOpen', 'allowMultipleOpen'];
    for (i = 0; i < booleanKeys.length; i++) {
        key = booleanKeys[i];
        if (options[key] !== undefined) {
            this[key] = options[key];
        }
    }

    if (options.openStates !== undefined) {
        this.openStates = angular.extend({}, options.openStates);
    }
};

/*
 * Returns the element class for the directive.
 *
 * @param {string} directiveName Use original directive names only.
 * @return {string}
 */
proto.getDirectiveClass = function(directiveName) {
    var optDirectiveName = this.directiveNames[directiveName];
    return this.directiveClasses[optDirectiveName];
};

/*
 * Converts name from camel case to snake case.
 *
 * Modified angular code snippet.
 * @param {string} name
 * @return {string}
 */
proto.snakeCase = function(name) {
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
        return (pos ? '-' : '') + letter.toLowerCase();
    });
};
