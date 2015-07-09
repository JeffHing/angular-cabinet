/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Page object for drawerTrigger directive.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = DrawerTriggerPageObject;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var extend = require('extend-this');
var HasMouseInput = require('HasMouseInput');
var HasStyle = require('HasStyle');

// Private model name.
var MODEL = '_drawerHandlePageObject';

//-------------------------------------
// Page object
//-------------------------------------

/*
 * @constructor
 *
 * @param {object} element The drawer trigger element.
 */
function DrawerTriggerPageObject(element, directiveName) {
    var m = this[MODEL] = {};

    m.element = element;
    m.directiveName = directiveName;

    // Disable the timer by default for testing.
    this.disableTimer(true);

    // Mixins
    extend(this)
        .withCall(HasMouseInput, element)
        .withCall(HasStyle, element);
}

var proto = DrawerTriggerPageObject.prototype;

/*
 * Indicates whether the element has the default class.
 *
 * @returns {boolean}
 */
proto.hasDefaultClass = function() {
    return this.hasClass('drawer-trigger');
};

/*
 * Indicates whether the element has the open class.
 *
 * @returns {boolean}
 */
proto.isOpen = function() {
    return this.hasClass('drawer-trigger-open');
};

/*
 * Disables the trigger's timer.
 *
 * @param {boolean} isDisabled
 */
proto.disableTimer = function(isDisabled) {
    var m = this[MODEL];
    var controller = m.element.controller(m.directiveName);
    controller.drawerCtrl.disableTimer(isDisabled);
};

// Mixins
extend(proto)
    .with(HasMouseInput.prototype)
    .with(HasStyle.prototype);
