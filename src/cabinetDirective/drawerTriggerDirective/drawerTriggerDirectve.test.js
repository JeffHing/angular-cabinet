/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for drawerTrigger directive.
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
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents></div>' +
    '</div>';

var HTML_MAPPING =
    '<div cabinet>' +
        '<div drawer-contents="1"></div>' +
        '<a drawer-trigger="0" href=""></a>' +
        '<a drawer-trigger="1" href=""></a>' +
        '<div drawer-contents="0"></div>' +
    '</div>';

//-------------------------------------
// Unit tests
//-------------------------------------

describe('drawerTrigger directive:', function() {

    var trigger0, contents0, trigger1, contents1;

    beforeEach(function() {
        var cabinet = new Cabinet(HTML);
        trigger0 = cabinet.getTrigger(0);
        trigger1 = cabinet.getTrigger(1);
        contents0 = cabinet.getContents(0);
        contents1 = cabinet.getContents(1);
    });

    describe('applying directive to the element', function() {

        it('should have the default class', function() {
            expect(trigger0.hasDefaultClass()).toBe(true);
        });
    });

    describe('clicking on drawer trigger', function() {

        it('should open the drawer', function() {
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(true);
            expect(contents0.isOpen()).toBe(true);
        });

        it('should close the drawer', function() {
            trigger0.mouseClick();
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
        });

        it('should close the other drawer', function() {
            trigger1.mouseClick();
            expect(trigger1.isOpen()).toBe(true);
            expect(contents1.isOpen()).toBe(true);

            trigger0.mouseClick();
            expect(trigger1.isOpen()).toBe(false);
            expect(contents1.isOpen()).toBe(false);
        });
    });

    describe('Enter keypress on drawer trigger', function() {

        it('should open the drawer', function() {
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
            trigger0.keyPressEnter();
            expect(trigger0.isOpen()).toBe(true);
            expect(contents0.isOpen()).toBe(true);
        });

        it('should close the drawer', function() {
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
            trigger0.keyPressEnter();
            trigger0.keyPressEnter();
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
        });
    });
});

describe('drawerTrigger directive mapping:', function() {

    var trigger0, contents0, trigger1, contents1;

    beforeEach(function() {
        var cabinet = new Cabinet(HTML_MAPPING);
        trigger0 = cabinet.getTrigger(1);
        trigger1 = cabinet.getTrigger(0);
        contents0 = cabinet.getContents(0);
        contents1 = cabinet.getContents(1);
    });

    describe('clicking on drawer trigger 0', function() {

        it('should open drawer contents 0', function() {
            expect(trigger0.isOpen()).toBe(false);
            expect(contents0.isOpen()).toBe(false);
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(true);
            expect(contents0.isOpen()).toBe(true);
        });
    });

    describe('clicking on drawer trigger 1', function() {

        it('should open drawer contents 1', function() {
            expect(trigger1.isOpen()).toBe(false);
            expect(contents1.isOpen()).toBe(false);
            trigger1.mouseClick();
            expect(trigger1.isOpen()).toBe(true);
            expect(contents1.isOpen()).toBe(true);
        });
    });
});
