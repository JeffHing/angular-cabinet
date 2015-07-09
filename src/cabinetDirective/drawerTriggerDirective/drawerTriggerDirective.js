/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerTrigger directive.
 */
'use strict';

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = drawerTriggerDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerTrigger directive triggers the showing and hiding of the
 * drawer contents. It adds the 'drawer-trigger-open' class to the element
 * when the drawer is opened and event handlers to the element
 * so that it can inform the drawer controller of user input.
 *
 * @example
 *    <a drawer-trigger href="">I'm a drawer trigger</a>
 *
 * @example
 *    <a drawer-trigger="id" href="">I'm a drawer trigger</a>
 *
 * @param {string} directivNames.cabinet
 * @param {string} directivNames.drawerTrigger
 * @param {string} elementClass The default element class.
 */
function drawerTriggerDirective(directiveNames, elementClass) {

    return {
        controller: Controller,
        link: {
            pre: prelink
        },
        require: [
            directiveNames.drawerTrigger,
            '^' + directiveNames.cabinet
        ]
    };

    function Controller() {
        this.drawerCtrl = null;
    }

    function prelink(scope, element, attrs, controllers) {
        var controller = controllers[0];
        var cabinetCtrl = controllers[1];

        // Add default class
        element.addClass(elementClass);

        // Get drawer controller.
        var id = attrs[directiveNames.drawerTrigger];
        var drawerCtrl = cabinetCtrl.createDrawerController(id);

        // Change open class when open state changes.
        var openClass = elementClass + '-open';
        drawerCtrl.addOpenListener(function(isOpen) {
            if (isOpen) {
                element.addClass(openClass);
            } else {
                element.removeClass(openClass);
            }
        });

        // Save the drawerCtrl so we can access it for testing purposes.
        controller.drawerCtrl = drawerCtrl;

        //
        // Send events to drawer controller.
        //
        element.bind('mouseenter', function(event) {
            drawerCtrl.onMouseEnterTrigger(event);
        });

        element.bind('mouseleave', function(event) {
            drawerCtrl.onMouseLeaveTrigger(event);
        });

        element.bind('mousedown', function(event) {
            drawerCtrl.onMouseDownTrigger(event);
        });

        element.bind('mouseup', function(event) {
            drawerCtrl.onMouseUpTrigger(event);
        });

        element.bind('focus', function(event) {
            drawerCtrl.onFocusTrigger(event);
        });
    }
}
