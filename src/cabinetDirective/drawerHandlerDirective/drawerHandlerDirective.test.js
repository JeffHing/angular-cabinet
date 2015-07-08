/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Unit tests for drawerHandler directive.
 */
'use strict';

//--------------------------------------
// Module dependencies and variables
//--------------------------------------

var Cabinet = require('../CabinetPageObject');

var HTML =
    '<div cabinet>' +
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents drawer-handler="myHandler"></div>' +
    '</div>';

var HTML_MAPPING =
    '<div cabinet="{allowMultipleOpen: true}">' +
        '<a drawer-trigger href=""></a>' +
        '<div drawer-contents drawer-handler="' +
            '{id: \'1\', handler: myHandler}">' +
        '</div>' +
        '<a drawer-trigger="1" href=""></a>' +
    '</div>';

//--------------------------------------
// Unit tests
//--------------------------------------

describe('drawerHandler directive:', function() {

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
});

describe('drawerHandler directive mapping:', function() {

    describe('clicking on trigger', function() {

        it('should call the handler', function() {
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
