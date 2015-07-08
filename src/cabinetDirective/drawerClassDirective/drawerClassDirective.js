/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerClass directive
 */
'use strict';

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = drawerClassDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerClassDirective dynamically updates the element's classes
 * whenever the state of the drawer changes.
 *
 * @example
 *    <div drawer-class='{open: "my-open" , closed: "my-closed"}'></div>
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
        var classes = parse(attrs[directiveNames.drawerClass])(scope);
        element.addClass(classes.closed);

        // Convert id to string.
        var id = classes.id;
        if (id !== undefined) {
            id = id.toString();
        }

        var drawerCtrl = cabinetCtrl.getDrawerController(id);

        // Listen for open changes.
        drawerCtrl.addOpenListener(function(isOpened) {

            // Replace the element's class.
            if (isOpened) {
                element.addClass(classes.open);
                element.removeClass(classes.closed);
            } else {
                element.removeClass(classes.open);
                element.addClass(classes.closed);
            }
        });
    }
}
