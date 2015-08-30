/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerTrigger directive.
 */
'use strict';

//--------------------------------------
// Exports
//--------------------------------------

module.exports = drawerTriggerDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerTrigger directive toggles the opening and closing of the
 * drawer. It adds mouse and focus event handlers to the element
 * to know when the directive has been triggerred. For applying CSS rules,
 * it adds a 'drawer-trigger' class to the element and also adds a
 * 'drawer-trigger-open' class to the element when the drawer is opened.
 *
 * The drawerTrigger directive is usually applied to an anchor or button element
 * to ensure that keyboard navigation works properly, but it can be applied
 * to any element.
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
        element.bind('mouseenter', function() {
            drawerCtrl.onMouseEnterTrigger();
        });

        element.bind('mouseleave', function() {
            drawerCtrl.onMouseLeaveTrigger();
        });

        element.bind('click', function() {
            drawerCtrl.onMouseClick();
        });

        element.bind('keydown keypress', function(event) {
            if (event.which === 13) {
                drawerCtrl.onMouseClick();
            }
        });
    }
}
