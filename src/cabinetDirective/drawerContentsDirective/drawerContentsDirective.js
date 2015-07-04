/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerContents directive
 */
'use strict';

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = drawerContentsDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerContents directive contains the contents of the
 * drawer. It adds the 'drawer-contents-open' class to the element
 * when the drawer is opened. It also adds event handlers to the element
 * so that it can inform the drawer controller of user input.
 *
 * @example
 *    <div drawer-contents>I'm the drawer contents</div>
 *
 * @param {string} directiveNames.cabinet
 * @param {string} directiveNames.drawerContents
 * @param {string} elementClass The default element class
 */
function drawerContentsDirective(directiveNames, elementClass) {

    return {
        link: {
            pre: prelink
        },
        require: '^' + directiveNames.cabinet
    };

    function prelink(scope, element, attrs, cabinetCtrl) {

        // Add default class
        element.addClass(elementClass);

        // Get drawer controller.
        var group = attrs[directiveNames.drawerContents];
        var drawerCtrl = cabinetCtrl.getDrawerController(group);

        // Change open class when open state changes.
        var openClass = elementClass + '-open';
        drawerCtrl.addOpenListener(function(isOpen) {
            if (isOpen) {
                element.addClass(openClass);
            } else {
                element.removeClass(openClass);
            }
        });

        //
        // Send events to controller.
        //
        element.bind('mouseenter', function(event) {
            drawerCtrl.onMouseEnterContents(event);
        });

        element.bind('mouseleave', function(event) {
            drawerCtrl.onMouseLeaveContents(event);
        });
    }
}
