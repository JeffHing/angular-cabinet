/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerClass directive.
 */
'use strict';

//--------------------------------------
// Exports
//--------------------------------------

module.exports = drawerClassDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerClass directive assigns a particular class to the element whenever
 * the open state of the drawer changes.
 *
 *
 * @example
 *    <div drawer-class='['my-open', 'my-closed']'></div>
 *
 * @example
 *    <div drawer-class="[0, 'my-open', 'my-closed']"></div>
 *
 * @param {string} directiveNames.cabinet
 * @param {string} directiveNames.drawerClass
 * @param {object} parse The angular parse service.
 * @return {object} directive
 */
function drawerClassDirective(directiveNames, parse) {

    return {
        link: {
            pre: prelink
        },
        require: '^' + directiveNames.cabinet
    };

    function prelink(scope, element, attrs, cabinetCtrl) {

        // Get classes and drawer id.
        var params = parse(attrs[directiveNames.drawerClass])(scope);

        var id, openClass, closedClass;
        if (params.length > 2) {
            id = params.shift();
        }
        openClass = params.shift();
        closedClass = params.shift();

        // Add default class to element.
        element.addClass(closedClass);

        // Convert id to string.
        if (id !== undefined) {
            id = id.toString();
        }

        var drawerCtrl = cabinetCtrl.getDrawerController(id);

        // Listen for open changes.
        drawerCtrl.addOpenListener(function(isOpened) {

            // Replace the element's class.
            if (isOpened) {
                element.addClass(openClass);
                element.removeClass(closedClass);
            } else {
                element.removeClass(openClass);
                element.addClass(closedClass);
            }
        });
    }
}
