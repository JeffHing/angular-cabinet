/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Run build commmands.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var CommandQueue = require('command-queue');

// Clean distribution.
var cleanDistCmd = new CommandQueue().sync('rimraf dist', 'mkdir dist');

//
// Run tests
//

// Test source file.
var testCmd = 'karma start --single-run';

// Test source file and watch for changes.
var testWatchCmd = 'karma start';

// Test distribution file.
var testDistCmd = 'karma start karma.dist.conf.js --single-run';

// Test minimized distribution file.
var testDistMinCmd = 'karma start karma.distMin.conf.js --single-run';

//
// Compile
//

// Create distribution file.
var webpackDistCmd =
    'webpack --progress --config webpack.dist.config.js';

// Create minified distribution file.
var webpackDistMinCmd =
    'webpack -p --progress --config webpack.distMin.config.js';

// Run webpack dev server and watch for changes.
var webpackWatchCmd = 'webpack-dev-server --hot';


//-------------------------------------
// Run build commands
//-------------------------------------

process.env.PATH += ';node_modules/.bin';

var queue = new CommandQueue();

switch (process.argv[2]) {
    case 'dev':
        queue.async(webpackWatchCmd, testWatchCmd).run();
        break;
    case 'test':
        queue.sync(testCmd).run();
        break;
    case 'dist':
        queue.sync(
            cleanDistCmd, testCmd,
            webpackDistCmd, testDistCmd,
            webpackDistMinCmd, testDistMinCmd).run();
        break;
}
