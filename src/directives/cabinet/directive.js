/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * cabinet directive.
 */
'use strict';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = addToModule;

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var CabinetConfig = require('./directiveConfig');

var drawerTriggerDirective = require('./drawerTrigger/directive');
var drawerContentsDirective = require('./drawerContents/directive');
var drawerClassDirective = require('./drawerClass/directive');

var DrawerController = require('./drawerController');

// Private model name.
var MODEL = '_cabinetDirective';

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

    module.directive(directiveNames.drawerContents, ['$parse', function($parse) {
        return drawerContentsDirective(directiveNames,
            config.getElementClass('drawerContents'), $parse);
    }]);

    module.directive(directiveNames.drawerClass, ['$parse', function($parse) {
        return drawerClassDirective(directiveNames, $parse);
    }]);
}

//-------------------------------------
// cabinet directive
//-------------------------------------

/*
 * The cabinetDirective identifies the element as a cabinet which contains
 * one or more drawer directives. It is responsible for coordinating which
 * drawers should be opened or closed based upon the open states of the
 * drawers and the applied options. For applying CSS rules, it adds the
 * 'cabinet' class to the element.
 *
 * @constructor
 *
 * @example
 *    <div cabinet>
 *        <a drawer-trigger href="">...<a>
 *        <div drawer-contents>...<div>
 *        <div drawer-class="['openclass, 'closedclass']">...<div>
 *    </div>
 *
 * @example
 *    <div cabinet="{
 *        openOnHover: false,
 *        oneAlwaysOpen: false,
 *        allowMultipleOpen: false,
 *        openStates: {
 *            '1': true
 *        },
 *    }">
 *
 * @param {CabinetConfig} config
 */
function cabinetDirective(config) {

    Controller.prototype = CabinetController.prototype;

    return {
        controller: ['$timeout', Controller],
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
    this[MODEL] = new CabinetModel(config, timeout);
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
    } else if (id) {
        controller = this.createDrawerController(id);
    } else {
        controller = m.drawers[m.drawers.length - 1].controller;
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
    m.openDrawer(index, isOpen);
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
function CabinetModel(config, timeout) {

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

        var isFirstWatch = options === oldOptions;

        options = options ? options : {};
        oldOptions = oldOptions ? oldOptions : {};

        var openStatesChanged = isFirstWatch ||
            (options.openStates !== oldOptions.openStates);

        var oneAlwaysOpenChanged = isFirstWatch ||
            (options.oneAlwaysOpen !== oldOptions.oneAlwaysOpen);

        // Update config with new options.
        self.config.copyOptions(options);

        // Open/close the specified drawers.
        if (openStatesChanged) {
            self.openDrawersById(self.config.openStates, true);
        }

        // Ensure at least one drawer is opened.
        if (oneAlwaysOpenChanged) {
            if (self.config.oneAlwaysOpen) {
                if (self.openDrawerCount() === 0) {
                    self.openDrawer(0, true);
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
 * Handle request to open or close a drawer.
 *
 * @param {number} index The index of the drawer.
 * @param {boolean} isOpen True to open, false to close.
 */
modelProto.openDrawer = function(index, isOpen) {

    // Leave one drawer always open.
    if (!isOpen && this.config.oneAlwaysOpen) {
        if (this.openDrawerCount() <= 1) {
            return;
        }
    }

    // If opening drawer and only one drawer can be open
    // at a time, close the other drawers.
    if (isOpen && !this.config.allowMultipleOpen) {
        for (var i = 0; i < this.drawers.length; i++) {
            var drawer = this.drawers[i];
            if (i !== index) {
                if (!changeState(drawer, false)) {
                    // Closing drawer failed.
                    return;
                }
            }
        }
    }

    changeState(this.drawers[index], isOpen);

    // If closing drawer fails, revert open state.
    function changeState(draw, openState) {
        if (draw.isOpen !== openState) {
            draw.isOpen = openState;
            if (!draw.controller.open(draw.isOpen)) {
                draw.isOpen = true;
                return false;
            }
        }
        return true;
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
                this.openDrawer(i, isOpen);
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
