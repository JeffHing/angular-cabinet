(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cabinetDirective"] = factory();
	else
		root["cabinetDirective"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
	 *
	 * MIT License
	 *
	 * cabinet directive.
	 */
	'use strict';

	//-------------------------------------
	// Dependencies and variables
	//-------------------------------------

	var CabinetConfig = __webpack_require__(1);

	var drawerTriggerDirective = __webpack_require__(2);
	var drawerContentsDirective = __webpack_require__(3);
	var drawerClassDirective = __webpack_require__(4);

	var DrawerController = __webpack_require__(5);

	// Private model name.
	var MODEL = '_cabinetDirective';

	//-------------------------------------
	// Exports
	//-------------------------------------

	module.exports = addToModule;

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
	            config.getDirectiveClass('drawerTrigger'));
	    });

	    module.directive(directiveNames.drawerContents, ['$parse', function($parse) {
	        return drawerContentsDirective(directiveNames,
	            config.getDirectiveClass('drawerContents'), $parse);
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
	        element.addClass(config.getDirectiveClass('cabinet'));

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
	 *
	 * MIT License
	 *
	 * Configuration object for cabinet directive.
	 */
	'use strict';

	//-------------------------------------
	// Dependencies and variables
	//-------------------------------------

	var SNAKE_CASE_REGEXP = /[A-Z]/g;

	//-------------------------------------
	// Exports
	//-------------------------------------

	module.exports = CabinetConfig;

	//-------------------------------------
	// Configuration object
	//-------------------------------------

	/*
	 * Manages the configuration options for the cabinet directive.
	 *
	 * @constructor
	 * @param {object} [options]
	 */
	function CabinetConfig(options) {

	    this.openOnHover = false;
	    this.oneAlwaysOpen = false;
	    this.allowMultipleOpen = false;
	    this.openStates = {};

	    // The directive classes should only be accessed through the
	    // getDirectiveClass() function. They are initially derived from
	    // the directive names using camelcase to snakecase conversion.
	    this.directiveClasses = {};

	    // The directive names should not be modified after
	    // the directives are created.
	    this.directiveNames = {
	        cabinet: 'cabinet',
	        drawerTrigger: 'drawerTrigger',
	        drawerContents: 'drawerContents',
	        drawerClass: 'drawerClass'
	    };

	    // Directive names are only valid when passed through constructor.
	    if (options && options.directiveNames) {
	        angular.extend(this.directiveNames, options.directiveNames);
	    }

	    // Get directive classes from directive names or options.
	    var hasDirectiveClasses = options && options.directiveClasses;
	    for (var key in this.directiveNames) {
	        var directiveName = this.directiveNames[key];
	        var directiveClass;

	        if (hasDirectiveClasses && options.directiveClasses[key]) {
	            directiveClass = options.directiveClasses[key];

	        } else {
	            directiveClass = this.snakeCase(directiveName);
	        }
	        this.directiveClasses[directiveName] = directiveClass;
	    }

	    if (options) {
	        this.copyOptions(options);
	    }
	}

	var proto = CabinetConfig.prototype;

	/*
	 * Copy valid options into config.
	 *
	 * @param {object} options
	 */
	proto.copyOptions = function(options) {
	    var i, key;

	    var booleanKeys = ['openOnHover', 'oneAlwaysOpen', 'allowMultipleOpen'];
	    for (i = 0; i < booleanKeys.length; i++) {
	        key = booleanKeys[i];
	        if (options[key] !== undefined) {
	            this[key] = options[key];
	        }
	    }

	    if (options.openStates !== undefined) {
	        this.openStates = angular.extend({}, options.openStates);
	    }
	};

	/*
	 * Returns the element class for the directive.
	 *
	 * @param {string} directiveName Use original directive names only.
	 * @return {string}
	 */
	proto.getDirectiveClass = function(directiveName) {
	    var optDirectiveName = this.directiveNames[directiveName];
	    return this.directiveClasses[optDirectiveName];
	};

	/*
	 * Converts name from camel case to snake case.
	 *
	 * Modified angular code snippet.
	 * @param {string} name
	 * @return {string}
	 */
	proto.snakeCase = function(name) {
	    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
	        return (pos ? '-' : '') + letter.toLowerCase();
	    });
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
	 *
	 * MIT License
	 *
	 * Drawer controller.
	 */
	'use strict';

	//-------------------------------------
	// Dependencies and variables
	//-------------------------------------

	// Private model name.
	var MODEL = '_drawerController';

	//-------------------------------------
	// Exports
	//-------------------------------------

	module.exports = DrawerController;

	//-------------------------------------
	// Controller
	//-------------------------------------

	/*
	 * Manages the user events from the drawerTrigger directive and the
	 * drawerContents directive to determine when to make a request to
	 * the cabinet controller to open or close the drawer.
	 *
	 * @constructor
	 *
	 * @param {object} cabinetCtrl The cabinet controller.
	 * @param {number} index The index of this drawer controller.
	 * @param {object} $timeout The angular timeout service
	 */
	function DrawerController(cabinetCtrl, index, $timeout) {
	    this[MODEL] = new DrawerModel(cabinetCtrl, index, $timeout);
	}

	var controllerProto = DrawerController.prototype;

	/*
	 * Opens or closes the drawer.
	 *
	 * @param {boolean} [isOpen]
	 * @return {boolean} False if close failed
	 */
	controllerProto.open = function(isOpen) {
	    var m = this[MODEL];
	    m.isOpen = isOpen;
	    if (!m.notifyOpenListeners(m.isOpen)) {
	        m.isOpen = true;
	        return false;
	    }
	    return true;
	};

	/*
	 * Indicates whether the drawer is currently open.
	 *
	 * @return {boolean} The current open state.
	 */
	controllerProto.isOpen = function() {
	    var m = this[MODEL];
	    return m.isOpen;
	};

	/*
	 * Adds a listener which is notified when the drawer's open state changes.
	 *
	 * @param {function} listener
	 */
	controllerProto.addOpenListener = function(listener) {
	    var m = this[MODEL];
	    m.openListeners.push(listener);
	};

	/*
	 * Disables the timer. Used for testing only.
	 *
	 * @param {boolean} isDisabled
	 */
	controllerProto.disableTimer = function(isDisabled) {
	    var m = this[MODEL];
	    m.isTimerDisabled = isDisabled;
	};

	//
	// Handle events from trigger directive.
	//
	controllerProto.onMouseClick = function() {
	    var m = this[MODEL];
	    m.requestOpen(!m.isOpen);
	};

	controllerProto.onMouseEnterTrigger = function() {
	    var m = this[MODEL];
	    if (m.config.openOnHover) {
	        m.requestOpen(true);
	    }
	};

	controllerProto.onMouseLeaveTrigger = function() {
	    var m = this[MODEL];
	    if (m.config.openOnHover) {
	        m.requestOpen(false);
	    }
	};

	//
	// Handle events from contents directive.
	//
	controllerProto.onMouseEnterContents = function() {
	    this.onMouseEnterTrigger();
	};

	controllerProto.onMouseLeaveContents = function() {
	    this.onMouseLeaveTrigger();
	};

	//-------------------------------------
	// Controller's model.
	//-------------------------------------

	/*
	 * @constructor
	 *
	 * @param {object} cabinetCtrl The cabinet controller.
	 * @param {number} index The index of this drawer controller.
	 * @param {object} $timeout The angular timeout service
	 */
	function DrawerModel(cabinetCtrl, index, timeout) {
	    var self = this;

	    // The index of this controller.
	    self.index = index;

	    // Cabinet controller.
	    self.cabinetCtrl = cabinetCtrl;

	    // Current configuration. Read-only.
	    self.config = {};

	    // Current open state of drawer.
	    self.isOpen = false;

	    // Listeners to notify when the open state changes.
	    self.openListeners = [];

	    // Handle spurious open state changes.
	    self.timeout = timeout;
	    self.openTimeoutTask = undefined;
	    self.requestedOpenState = null;

	    // For unit testing. Angular timer mock inconvenient to use.
	    self.isTimerDisabled = false;

	    // Listen for config changes.
	    cabinetCtrl.addConfigListener(function(config) {
	        self.config = config;
	    });
	}

	var modelProto = DrawerModel.prototype;

	/*
	 * Notifies the listeners that the open state has changed.
	 *
	 * @param {boolean} isOpen
	 * @returns {boolean} False if closed failed.
	 */
	modelProto.notifyOpenListeners = function(isOpen) {
	    for (var i = 0; i < this.openListeners.length; i++) {
	        var ret = this.openListeners[i](isOpen);
	        if (!isOpen && typeof ret === 'boolean' && !ret) {
	            // Restore open for previous listeners.
	            for (var j = 0; j < i; j++) {
	                this.openListeners[j](true);
	            }
	            return false;
	        }
	    }
	    return true;
	};

	/*
	 * Requests the cabinet controller to open this drawer.
	 *
	 * Handles spurious open state changes when hovering between
	 * drawer trigger and drawer contents by delaying setting of open state
	 * by 5ms. If open state changes before then, timer is reset with
	 * new value.
	 *
	 * @param {boolean} isOpen
	 */
	modelProto.requestOpen = function(isOpen) {
	    var self = this;

	    // Return immediately if the request is for the same state.
	    if (self.requestedOpenState !== null) {
	        if (self.requestedOpenState === isOpen) {
	            return;
	        }
	    } else if (self.isOpen === isOpen) {
	        return;
	    }

	    self.requestedOpenState = isOpen;

	    // For unit testing.
	    if (self.isTimerDisabled) {
	        openDrawer();
	        return;
	    }

	    if (self.openTimeoutTask) {
	        self.timeout.cancel(self.openTimeoutTask);
	    }
	    self.openTimeoutTask = self.timeout(function() {}, 5);
	    self.openTimeoutTask.then(
	        openDrawer
	    );

	    function openDrawer() {
	        self.cabinetCtrl.openDrawer(self.index, self.requestedOpenState);
	        self.requestedOpenState = null;
	    }
	};


/***/ }
/******/ ])
});
;
