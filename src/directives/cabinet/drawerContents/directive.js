/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * drawerContents directive.
 */
'use strict';

//--------------------------------------
// Exports
//--------------------------------------

module.exports = drawerContentsDirective;

//--------------------------------------
// Directive
//--------------------------------------

/*
 * The drawerContents directive contains the contents of the
 * drawer. For applying CSS rules, it adds the 'drawer-contents'
 * class to the element. When the drawer is opened, it also adds
 * the 'drawer-contents-open' class to the element.
 *
 * If a handler is specified, the handler is called whenver the
 * drawer is opened or closed.
 *
 * @example
 *    <div drawer-contents>I'm the drawer contents</div>
 *
 * @example
 *    <div drawer-contents="id">I'm the drawer contents</div>
 *
 * @example
 *    <div drawer-contents="handler">I'm the drawer contents</div>
 *
 * @example
 *    <div drawer-contents="[id, handler]">I'm the drawer contents</div>
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

        // Convert id to string.
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
                    var ret = handler('closed');
                    if (typeof ret === 'boolean' && !ret) {
                        // Restore open class.
                        element.addClass(openClass);
                    }
                    return ret;
                }
            }
        });

        //
        // Send events to controller.
        //
        element.bind('mouseenter', function() {
            drawerCtrl.onMouseEnterContents();
        });

        element.bind('mouseleave', function() {
            drawerCtrl.onMouseLeaveContents();
        });
    }
}
