/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Page object for drawerContents directive.
 */
'use strict';

//-------------------------------------
// Dependencies and variables
//-------------------------------------

var extend = require('extend-this');
var HasInput = require('HasInput');
var HasStyle = require('HasStyle');

// Private model name.
var MODEL = '_drawerContentsPageObject';

//-------------------------------------
// Exports
//-------------------------------------

module.exports = DrawerContentsPageObject;

//-------------------------------------
// Page object
//-------------------------------------

/*
 * @constructor
 *
 * @param {object} element The drawer contents element.
 */
function DrawerContentsPageObject(element) {
    var m = this[MODEL] = {};

    m.element = element;

    // Mixins
    extend(this)
        .withCall(HasInput, element)
        .withCall(HasStyle, element);
}

var proto = DrawerContentsPageObject.prototype;

/*
 * Indicates whether the element has the default class.
 *
 * @returns {boolean}
 */
proto.hasDefaultClass = function() {
    return this.hasClass('drawer-contents');
};

/*
 * Indicates whether the element has the open class.
 *
 * @returns {boolean}
 */
proto.isOpen = function() {
    return this.hasClass('drawer-contents-open');
};

// Mixins
extend(proto)
    .with(HasInput.prototype)
    .with(HasStyle.prototype);
