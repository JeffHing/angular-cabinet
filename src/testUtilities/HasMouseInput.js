/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Provides convenience functions to emulate mouse input for a jquery
 * wrapped element.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = HasMouseInput;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

// Private model name.
var MODEL = '_hasMouseInput';

//-------------------------------------
// HasMouseInput class
//-------------------------------------

/*
 * @constructor
 */
function HasMouseInput(element) {
    var m = this[MODEL] = {};

    m.element = element;
}

var proto = HasMouseInput.prototype;

proto.mouseClick = function() {
    this.mouseDown();
    this.focus();
    this.mouseUp();
};

proto.mouseEnter = function() {
    var m = this[MODEL];
    m.element.trigger('mouseenter');
};

proto.mouseLeave = function() {
    var m = this[MODEL];
    m.element.trigger('mouseleave');
};

proto.mouseDown = function() {
    var m = this[MODEL];
    m.element.trigger('mousedown');
};

proto.mouseUp = function() {
    var m = this[MODEL];
    m.element.trigger('mouseup');
};

proto.focus = function() {
    var m = this[MODEL];
    m.element.triggerHandler('focus');
};
