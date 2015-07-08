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
        '<div drawer-contents="myHandler"></div>' +
    '</div>';

var HTML_MAPPING =
    '<div cabinet="{allowMultipleOpen: true}">' +
        '<a drawer-trigger="0" href=""></a>' +
        '<div drawer-contents="[1, myHandler]"></div>' +
        '<a drawer-trigger="1" href=""></a>' +
        '<div drawer-contents="0"></div>' +
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

    describe('clicking on trigger', function() {

        it('should have the open class', function() {
            expect(contents.isOpen()).toBe(false);
            trigger.mouseClick();
            expect(contents.isOpen()).toBe(true);
        });
    });

});

describe('drawerContents directive handler:', function() {

    describe('clicking on trigger', function() {

        it('should call the handler function with open', function() {
            // Need to add spy before compile.
            var scope = {
                myHandler: function() {}
            };
            spyOn(scope, 'myHandler');

            var cabinet = new Cabinet(HTML, scope);
            var trigger = cabinet.getTrigger(0);

            scope.myHandler.calls.reset();
            trigger.mouseClick();

            expect(scope.myHandler).toHaveBeenCalledWith('open');
        });

        it('should call the handler function with closed', function() {
            // Need to add spy before compile.
            var scope = {
                myHandler: function() {}
            };
            spyOn(scope, 'myHandler');

            var cabinet = new Cabinet(HTML, scope);
            var trigger = cabinet.getTrigger(0);

            scope.myHandler.calls.reset();
            trigger.mouseClick();
            trigger.mouseClick();
            expect(scope.myHandler).toHaveBeenCalledWith('closed');
        });
    });

    describe('returning false from handler', function() {
        it('should disallow closing the drawer', function() {
            // Need to add spy before compile.
            var scope = {
                myHandler: function() {
                    return false;
                }
            };
            spyOn(scope, 'myHandler').and.callThrough();

            var cabinet = new Cabinet(HTML, scope);
            var trigger = cabinet.getTrigger(0);
            var contents = cabinet.getContents(0);

            scope.myHandler.calls.reset();
            trigger.mouseClick();
            expect(scope.myHandler).toHaveBeenCalledWith('open');
            expect(contents.isOpen()).toBe(true);

            // It should still be open.
            scope.myHandler.calls.reset();
            trigger.mouseClick();
            expect(scope.myHandler).toHaveBeenCalledWith('closed');
            expect(contents.isOpen()).toBe(true);

            // It should not have been called with open to reset its state.
            expect(scope.myHandler).not.toHaveBeenCalledWith('open');
        });
    });
});

describe('drawerHandler directive mapping:', function() {

    describe('clicking on trigger 0', function() {

        it('should have the open class', function() {
            var cabinet = new Cabinet(HTML_MAPPING);
            var trigger = cabinet.getTrigger(0);
            var contents0 = cabinet.getContents(1);
            var contents1 = cabinet.getContents(0);

            expect(contents0.isOpen()).toBe(false);
            expect(contents1.isOpen()).toBe(false);
            trigger.mouseClick();
            expect(contents0.isOpen()).toBe(true);
            expect(contents1.isOpen()).toBe(false);
        });
    });

    describe('clicking on trigger 1', function() {

        it('should call the mapped handler', function() {
            // Need to add spy before compile.
            var scope = {
                myHandler: function() {}
            };
            spyOn(scope, 'myHandler');

            var cabinet = new Cabinet(HTML_MAPPING, scope);
            var trigger0 = cabinet.getTrigger(0);
            var trigger1 = cabinet.getTrigger(1);

            scope.myHandler.calls.reset();
            trigger0.mouseClick();
            expect(scope.myHandler).not.toHaveBeenCalled();

            trigger1.mouseClick();
            expect(scope.myHandler).toHaveBeenCalledWith('open');
        });
    });
});
