/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerHandler directive
 */
'use strict';

//--------------------------------------
// Module exports
//--------------------------------------

module.exports = drawerHandlerDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerHandlerDirective calls the user provided function
 * whenever the state of the drawer changes.
 *
 * @example
 *    <div drawer-handler="myHandler"></div>
 *    <div drawer-handler="{id: 'drawerId', handler: myHandler}"></div>
 *
 * @param {string} directiveNames.cabinet
 * @param {string} directiveNames.drawerHandler
 * @param {object} parse The angular parse service.
 * @return {object} directive
 */
function drawerHandlerDirective(directiveNames, parse) {

    return {
        link: {
            pre: prelink
        },
        require: '^' + directiveNames.cabinet
    };

    function prelink(scope, element, attrs, cabinetCtrl) {

        var handler = parse(attrs[directiveNames.drawerHandler])(scope);

        var id;

        if (typeof handler !== 'function') {
            id = handler.id;
            handler = handler.handler;
        }

        var drawerCtrl = cabinetCtrl.getDrawerController(id);

        // Listen for open changes.
        drawerCtrl.addOpenListener(function(isOpened) {

            // Replace the element's class.
            if (isOpened) {
                handler('open');
            } else {
                handler('closed');
            }
        });
    }
}
