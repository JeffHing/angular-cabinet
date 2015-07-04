/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for drawerContents directive.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var Cabinet = require('../CabinetPageObject');

var HTML =
    '<div cabinet>' +
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents></div>' +
    '</div>';

//-------------------------------------
// Unit tests
//-------------------------------------

describe('drawerContents directive:', function() {

    var trigger, contents;

    beforeEach(function() {
        var cabinet = new Cabinet(HTML);
        trigger = cabinet.getTrigger(0);
        contents = cabinet.getContents(0);
    });

    describe('applying directive to the element', function() {

        it('should have the default class', function() {
            expect(contents.hasDefaultClass()).toBe(true);
        });
    });

    describe('clicking on drawer trigger', function() {

        it('should have the open class', function() {
            expect(contents.isOpen()).toBe(false);
            trigger.mouseClick();
            expect(contents.isOpen()).toBe(true);
        });
    });

});
