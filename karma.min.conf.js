/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Karma configuration for testing minimized version.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables.
//-------------------------------------

var common = require('./karma.common');
var commonWebpack = require('./webpack.common');

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = function(config) {
    config.set(
        common('dist/cabinetDirective.min.js', [commonWebpack.HTML_LOADER])
    );
};
