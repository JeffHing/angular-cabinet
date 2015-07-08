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
 * @param {object} parse The angular parse service.
 */
function drawerContentsDirective(directiveNames, elementClass, parse) {

    return {
        link: {
            pre: prelink
        },
        require: '^' + directiveNames.cabinet
    };

    function prelink(scope, element, attrs, cabinetCtrl) {

        // Add default class
        element.addClass(elementClass);

        // Get handler and drawer id if any.
        var id, handler;
        var params = parse(attrs[directiveNames.drawerContents])(scope);
        if (typeof params === 'function') {
            handler = params;
        } else if (typeof params === 'string' || typeof params === 'number') {
            id = params;
        } else if (typeof params === 'object') {
            id = params[0];
            handler = params[1];
        }

        // Convert numbers to strings.
        if (id !== undefined) {
            id = id.toString();
        }

        // Get drawer controller.
        var drawerCtrl = cabinetCtrl.getDrawerController(id);

        // Change open class when open state changes.
        var openClass = elementClass + '-open';
        drawerCtrl.addOpenListener(function(isOpen) {
            if (isOpen) {
                element.addClass(openClass);
                if (handler) {
                    handler('open');
                }
            } else {
                element.removeClass(openClass);
                if (handler) {
                    handler('closed');
                }
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
