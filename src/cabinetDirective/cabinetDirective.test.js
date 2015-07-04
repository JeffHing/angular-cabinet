/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for cabinet directive.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var Cabinet = require('./CabinetPageObject');

var HTML =
    '<div cabinet=options>' +
        '<a drawer-trigger="0" href=""></a>' +
        '<div drawer-contents></div>' +
        '<a drawer-trigger="1" href=""></a>' +
        '<div drawer-contents></div>' +
    '</div>';

var HTML_TABS =
    '<div tabs=options>' +
        '<a tab-trigger href=""></a>' +
        '<div tab-contents ' +
            'tab-class="{open: \'my-open\', closed: \'my-closed\'}">' +
        '</div>' +
        '<a tab-trigger href=""></a>' +
        '<div tab-contents></div>' +
    '</div>';

//-------------------------------------
// Unit tests
//-------------------------------------

describe('cabinet directive:', function() {

    describe('applying cabinet directive to element', function() {

        it('should have a default class', function() {
            var cabinet = new Cabinet(HTML);
            expect(cabinet.hasDefaultClass()).toBe(true);
        });
    });

    describe('enabling option to allow multiple open drawers', function() {

        var cabinet = new Cabinet(HTML, {
            options: {
                allowMultipleOpen: true
            }
        });

        it('should leave the other drawer open', function() {
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            // open drawer 0
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(true);

            // open drawer 1
            trigger1.mouseClick();
            expect(trigger1.isOpen()).toBe(true);

            // drawer0 should still be opened
            expect(trigger0.isOpen()).toBe(true);
        });
    });

    describe('disabling option to allow multiple open drawers', function() {

        var cabinet = new Cabinet(HTML, {
            options: {
                allowMultipleOpen: false
            }
        });

        it('should close the other drawer', function() {
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            // open drawer 0
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(true);

            // open drawer 1
            trigger1.mouseClick();
            expect(trigger1.isOpen()).toBe(true);

            // drawer0 should be closed
            expect(trigger0.isOpen()).toBe(false);
        });
    });

    describe('enabling the openStates option', function() {

        it('should open and close the correct drawers', function() {
            var cabinet = new Cabinet(HTML, {
                options: {
                    allowMultipleOpen: true,
                    openStates: {
                        '0': false,
                        '1': true
                    }
                }
            });

            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            expect(trigger0.isOpen()).toBe(false);
            expect(trigger1.isOpen()).toBe(true);
        });

        it('should open and close the correct drawers if the options change', function() {
            var options = {
                allowMultipleOpen: true,
                openStates: {
                    '0': true,
                    '1': false
                }
            };

            var cabinet = new Cabinet(HTML, {
                options: options
            });
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            expect(trigger0.isOpen()).toBe(true);
            expect(trigger1.isOpen()).toBe(false);

            options.openStates = {
                '0': false,
                '1': true
            };
            cabinet.digest();

            expect(trigger0.isOpen()).toBe(false);
            expect(trigger1.isOpen()).toBe(true);
        });
    });

    describe('enabling option to ensure one drawer is always open', function() {

        it('should open a drawer if none are open', function() {
            var cabinet = new Cabinet(HTML, {
                options: {
                    oneAlwaysOpen: true
                }
            });
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            expect(trigger0.isOpen()).toBe(true);
            expect(trigger1.isOpen()).toBe(false);
        });

        it('should prevent closing the last open drawer', function() {
            var cabinet = new Cabinet(HTML, {
                options: {
                    oneAlwaysOpen: true
                }
            });
            var trigger0 = cabinet.getTrigger(0);

            expect(trigger0.isOpen()).toBe(true);
            trigger0.mouseClick();
            expect(trigger0.isOpen()).toBe(true);
        });

        it('should not open a drawer if one is already open', function() {
            var cabinet = new Cabinet(HTML, {
                options: {
                    oneAlwaysOpen: true,
                    openStates: {
                        '1': true
                    }
                }
            });
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            expect(trigger0.isOpen()).toBe(false);
            expect(trigger1.isOpen()).toBe(true);
        });
    });

    describe('enabling the option to open drawer on hover', function() {

        var cabinet, trigger, contents;

        beforeEach(function() {
            cabinet = new Cabinet(HTML, {
                options: {
                    openOnHover: true
                }
            });
            trigger = cabinet.getTrigger(0);
            contents = cabinet.getContents(0);
        });

        it('should open drawer when hovering over handle', function() {
            expect(trigger.isOpen()).toBe(false);
            trigger.mouseEnter();
            expect(trigger.isOpen()).toBe(true);
        });

        it('should close drawer when not hovering over handle', function() {
            expect(trigger.isOpen()).toBe(false);
            trigger.mouseEnter();
            expect(trigger.isOpen()).toBe(true);
            trigger.mouseLeave();
            expect(trigger.isOpen()).toBe(false);
        });

        it('should leave drawer open when moving mouse to contents', function() {
            expect(trigger.isOpen()).toBe(false);

            trigger.mouseEnter();

            // Turn on the timer for this situation (which is the
            // natural state of the directive). When leaving the drawer
            // handle, the open state should still be true due to the
            // timer which prevents the mouseLeave closing the drawer.
            trigger.disableTimer(false);

            trigger.mouseLeave();
            expect(trigger.isOpen()).toBe(true);

            contents.mouseEnter();
            expect(trigger.isOpen()).toBe(true);
        });

        it('should close drawer when not hovering over contents', function() {
            contents.mouseEnter();
            expect(trigger.isOpen()).toBe(true);
            contents.mouseLeave();
            expect(trigger.isOpen()).toBe(false);
        });
    });
});

//-------------------------------------
// addToModule() unit tests
//-------------------------------------
describe('cabinet directive: addToModule:', function() {

    describe('renaming element classes', function() {

        var options = {
            elementClasses: {
                cabinet: 'menus',
                drawerTrigger: 'menu-handle',
                drawerContents: 'menu-contents'
            }
        };

        it('should have renamed element classes', function() {
            var cabinet = new Cabinet(HTML, null, options);
            var trigger = cabinet.getTrigger(0);
            var contents = cabinet.getContents(0);

            expect(cabinet.hasClass('menus')).toBe(true);
            expect(trigger.hasClass('menu-handle')).toBe(true);
            expect(contents.hasClass('menu-contents')).toBe(true);
        });
    });

    describe('renaming directives', function() {

        var options = {
            directiveNames: {
                cabinet: 'tabs',
                drawerTrigger: 'tabTrigger',
                drawerContents: 'tabContents',
                drawerClass: 'tabClass'
            }
        };

        var cabinet, trigger, contents;

        beforeEach(function() {
            cabinet = new Cabinet(HTML_TABS, null, options);
            trigger = cabinet.getTrigger(0);
            contents = cabinet.getContents(0);
        });

        it('should have renamed element classes', function() {
            expect(cabinet.hasClass('tabs')).toBe(true);
            expect(trigger.hasClass('tab-trigger')).toBe(true);
            expect(contents.hasClass('tab-contents')).toBe(true);
        });

        it('should not affect drawerClass functionality', function() {
            expect(contents.hasClass('my-closed')).toBe(true);
            trigger.mouseClick();
            expect(contents.hasClass('my-open')).toBe(true);
        });
    });
});
