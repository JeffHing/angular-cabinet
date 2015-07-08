/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for drawerClass directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var Cabinet = require('../CabinetPageObject');

var HTML =
    '<div cabinet>' +
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents drawer-class="' +
            '{open: openClass, closed: closedClass}">' +
        '</div>' +
    '</div>';

var HTML_MAPPING =
    '<div cabinet>' +
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents drawer-class="' +
            '{id: \'1\', open: openClass, closed: closedClass}">' +
        '</div>' +
        '<a drawer-trigger="1" href=""></a>' +
    '</div>';

//--------------------------------------
// Unit tests
//--------------------------------------

describe('drawerClass directive:', function() {

    var trigger, contents;

    beforeEach(function() {
        var cabinet = new Cabinet(HTML, {
            openClass: 'my-open',
            closedClass: 'my-closed'
        });
        trigger = cabinet.getTrigger(0);
        contents = cabinet.getContents(0);
    });

    describe('applying directive to the element', function() {

        it('should have the closed class', function() {
            expect(contents.hasClass('my-open')).toBe(false);
            expect(contents.hasClass('my-closed')).toBe(true);
        });
    });

    describe('clicking on trigger', function() {

        it('should have the opened class', function() {
            expect(contents.hasClass('my-open')).toBe(false);
            expect(contents.hasClass('my-closed')).toBe(true);
            trigger.mouseClick();
            expect(contents.hasClass('my-open')).toBe(true);
            expect(contents.hasClass('my-closed')).toBe(false);
        });
    });
});

describe('drawerClass directive mapping:', function() {

    var trigger0, trigger1, contents0;

    beforeEach(function() {
        var cabinet = new Cabinet(HTML_MAPPING, {
            openClass: 'my-open',
            closedClass: 'my-closed'
        });
        trigger0 = cabinet.getTrigger(0);
        trigger1 = cabinet.getTrigger(1);
        contents0 = cabinet.getContents(0);
    });

    describe('clicking on trigger 0', function() {

        it('should not change the the opened class', function() {
            expect(contents0.hasClass('my-open')).toBe(false);
            expect(contents0.hasClass('my-closed')).toBe(true);
            trigger0.mouseClick();
            expect(contents0.hasClass('my-open')).toBe(false);
            expect(contents0.hasClass('my-closed')).toBe(true);
        });
    });

    describe('clicking on trigger 1', function() {

        it('should change the the opened class', function() {
            expect(contents0.hasClass('my-open')).toBe(false);
            expect(contents0.hasClass('my-closed')).toBe(true);
            trigger1.mouseClick();
            expect(contents0.hasClass('my-open')).toBe(true);
            expect(contents0.hasClass('my-closed')).toBe(false);
        });
    });
});
