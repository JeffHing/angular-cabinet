/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * cabinet directive
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = addToModule;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var CabinetConfig = require('./CabinetConfig');

var drawerClassDirective =
    require('./drawerClassDirective/drawerClassDirective');

var drawerContentsDirective =
    require('./drawerContentsDirective/drawerContentsDirective');

var drawerTriggerDirective =
    require('./drawerTriggerDirective/drawerTriggerDirective');

var DrawerController = require('./DrawerController');

// Private model name.
var MODEL = '_model';

//-------------------------------------
// factory method
//-------------------------------------

/*
 * Adds the cabinet directive and its child directives to the angular module.
 *
 * @example
 *    cabinetDirective('app', options);
 *
 * @param {object} module The angular module
 * @param {object} options
 */
function addToModule(moduleName, options) {

    var module = angular.module(moduleName);

    var config = new CabinetConfig(options);
    var directiveNames = config.directiveNames;

    module.directive(directiveNames.cabinet, function() {
        return cabinetDirective(config);
    });

    module.directive(directiveNames.drawerTrigger, function() {
        return drawerTriggerDirective(directiveNames,
            config.getElementClass('drawerTrigger'));
    });

    module.directive(directiveNames.drawerContents, function() {
        return drawerContentsDirective(directiveNames,
            config.getElementClass('drawerContents'));
    });

    module.directive(directiveNames.drawerClass, function($parse) {
        return drawerClassDirective(directiveNames, $parse);
    });
}

//-------------------------------------
// cabinet directive
//-------------------------------------

/*
 * The cabinetDirective identifies the element as a cabinet which contains
 * one or more drawer directives. It is responsible for determining which
 * drawers should be opened or closed based upon the drawer directive states
 * and the user specified policy options.
 *
 * @constructor
 *
 * @example
 *    <div cabinet>
 *        <a drawer-trigger href="">...<a>
 *        <div drawer-contents>...<div>
 *    </div>
 *
 * @param {CabinetConfig} config
 */
function cabinetDirective(config) {

    Controller.prototype = CabinetController.prototype;

    return {
        controller: Controller,
        link: link,
        require: config.directiveNames.cabinet,
        restrict: 'A'
    };

    function Controller($timeout) {
        // Need to pass config to CabinetController.
        CabinetController.call(this, new CabinetConfig(config), $timeout);
    }

    function link(scope, element, attrs, controller) {

        // Add default class
        element.addClass(config.getElementClass('cabinet'));

        controller.linkCompleted(scope, attrs);
    }
}

//-------------------------------------
// cabinet controller
//-------------------------------------

/*
 * @constructor
 */
function CabinetController(config, timeout) {
    this[MODEL] = new CabinetModel(this, config, timeout);
}

var controllerProto = CabinetController.prototype;

/*
 * Link completed. Finish initialization.
 *
 * @param {object} element The cabinet element.
 */
controllerProto.linkCompleted = function(scope, attrs) {
    var m = this[MODEL];

    m.watchOptions(scope, attrs);

    m.notifyOpenState();
};

/*
 * Returns the drawer controller for the drawer with the specified
 * id. If id is undefined, it returns the most recently created
 * drawer controller.
 *
 * @param {string} [id] The id of the drawer
 * @return {object} The drawer controller.
 */
controllerProto.getDrawerController = function(id) {
    var m = this[MODEL],
        controller;

    var drawer = m.getDrawerById(id);
    if (drawer) {
        controller = drawer.controller;
    } else {
        if (id) {
            controller = this.createDrawerController(id);
        } else {
            controller = m.drawers[m.drawers.length - 1].controller;
        }
    }
    return controller;
};

/*
 * Creates a drawer controller with the specified id if it has not
 * been created before. If no id is specified, it will create
 * a new drawer controller.
 *
 * @param {string} [id] The id of the drawer
 * @return {object} The drawer controller.
 */
controllerProto.createDrawerController = function(id) {
    var m = this[MODEL];

    var drawer = m.getDrawerById(id);
    if (!drawer) {
        drawer = {
            id: id,
            controller: new DrawerController(this, m.drawers.length, m.timeout),
            isOpen: false
        };
        m.drawers.push(drawer);
    }
    return drawer.controller;
};

/*
 * Handle request to open or close a drawer.
 *
 * @param {number} index The index of the drawer.
 * @param {boolean} isOpen True to open, false to close.
 */
controllerProto.openDrawer = function(index, isOpen) {
    var m = this[MODEL];

    // If closing drawer and there's only one drawer
    // open, leave it open.
    if (!isOpen && m.config.oneAlwaysOpen) {
        if (m.openDrawerCount() <= 1) {
            return;
        }
    }

    // If opening drawer and only one drawer can be open
    // at a time, close the other drawers.
    if (isOpen && !m.config.allowMultipleOpen) {
        angular.forEach(m.drawers, function(drawer, i) {
            if (i !== index) {
                drawer.isOpen = false;
                drawer.controller.open(drawer.isOpen);
            }
        });
    }
    m.drawers[index].isOpen = isOpen;
    m.drawers[index].controller.open(isOpen);
};

/*
 * Adds a listener which is notified when the configuration changes.
 *
 * @param {function} listener
 */
controllerProto.addConfigListener = function(listener) {
    var m = this[MODEL];
    m.configListeners.push(listener);
};

//-------------------------------------
// cabinet controller's private model
//-------------------------------------

/*
 * @constructor
 */
function CabinetModel(controller, config, timeout) {
    this.controller = controller;

    // Timeout service.
    this.timeout = timeout;

    // Current configuration.
    this.config = config;

    // Listeners to notify when options change.
    this.configListeners = [];

    // Registered drawers.
    this.drawers = [];
}

var modelProto = CabinetModel.prototype;

/*
 * Watch for option changes on the scope.
 */
modelProto.watchOptions = function(scope, attrs) {
    var self = this;
    var cabinetDirectiveName = self.config.directiveNames.cabinet;

    // If no options specified, apply the default options.
    if (!attrs[cabinetDirectiveName]) {
        processOptions(self.config, self.config);
        return;
    }

    // Watch if the options change.
    scope.$watchCollection(attrs[cabinetDirectiveName], processOptions);

    function processOptions(options, oldOptions) {

        if (!options) {
            return;
        }

        var isFirstWatch = options === oldOptions;

        var openStatesChanged = isFirstWatch ||
            (options.openStates !== oldOptions.openStates);

        var oneAlwaysOpenChanged = isFirstWatch ||
            (options.oneAlwaysOpen !== oldOptions.oneAlwaysOpen);

        // Ensure that these options are applied which may affect
        // how the next options are applied.
        self.config.copyOptions(options, true);

        // Open/close the specified drawers.
        if (openStatesChanged) {
            if (options.openStates) {
                self.openDrawersById(options.openStates, true);
            }
        }

        // Ensure at least one drawer is opened.
        if (oneAlwaysOpenChanged) {
            if (options.oneAlwaysOpen) {
                if (self.openDrawerCount() === 0) {
                    self.controller.openDrawer(0, true);
                }
            }
        }

        isFirstWatch = false;

        self.notifyConfigListeners();
    }
};

/*
 * Notify options listeners of the current options.
 */
modelProto.notifyConfigListeners = function() {
    for (var i = 0; i < this.configListeners.length; i++) {
        this.configListeners[i](this.config);
    }
};

/*
 * Notify each drawer of its current open state.
 */
modelProto.notifyOpenState = function() {
    for (var i = 0; i < this.drawers.length; i++) {
        var drawer = this.drawers[i];

        // Notify only if states are different.
        var isOpen = drawer.controller.isOpen();
        if (isOpen !== drawer.isOpen) {
            drawer.controller.open(drawer.isOpen);
        }
    }
};

/*
 * Set the open state of the drawers, where each drawer is identifed
 * by a key. If a key is a number, it is interpreted as the index of
 * the drawer. If a key is a string, it is interpreted as the element
 * class of the drawer.
 *
 * @param {object} openStates A mapping of drawer id to open state.
 */
modelProto.openDrawersById = function(openStates) {
    for (var i = 0; i < this.drawers.length; i++) {
        var drawer = this.drawers[i];
        if (drawer.id !== undefined) {
            var isOpen = openStates[drawer.id];
            if (isOpen !== undefined) {
                this.controller.openDrawer(i, isOpen);
            }
        }
    }
};

/*
 * Returns the drawer with the specified id.
 *
 * @param {string} id The id of the drawer
 * @return {object} The drawer or null if not found.
 */
modelProto.getDrawerById = function(id) {
    if (id) {
        for (var i = this.drawers.length - 1; i >= 0; i--) {
            if (this.drawers[i].id === id) {
                return this.drawers[i];
            }
        }
    }
    return null;
};

/*
 * Return the number of opened drawers.
 *
 * @return {number}
 */
modelProto.openDrawerCount = function() {
    var count = 0;

    for (var i = 0; i < this.drawers.length; i++) {
        if (this.drawers[i].isOpen) {
            count++;
        }
    }
    return count;
};
