/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Common webpack configuration values.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var extend = require('extend');

var common = {

    CABINET_DIRECTIVE_SOURCE: './src/cabinetDirective/cabinetDirective.js',

    // Lint javascript.
    ESLINT_LOADER: {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },

    // Load HTML as javascript.
    HTML_LOADER: {
        test: /\.html$/,
        loader: 'html'
    },

    // Load CSS as javascript.
    CSS_LOADER: {
        test: /\.css$/,
        loader: 'style!css!csslint?failOnError=false'
    }
};

var distConfig = {

    // Configuration for a distribution.
    distConfig: function(outputName) {

        return {
            entry: common.CABINET_DIRECTIVE_SOURCE,

            eslint: {
                failOnError: true
            },

            module: {
                loaders: [
                    common.ESLINT_LOADER
                ]
            },

            output: {
                filename: outputName,
                library: 'cabinetDirective',
                libraryTarget: 'umd',
                path: 'dist/'
            }
        };
    }
};

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = extend({}, distConfig, common);
