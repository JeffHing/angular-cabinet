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

// Lint javascript.
var ESLINT_LOADER = {
    test: /\.js$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
};

// Load HTML as javascript.
var HTML_LOADER = {
    test: /\.html$/,
    loader: 'html'
};

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = {

    ESLINT_LOADER: ESLINT_LOADER,

    HTML_LOADER: HTML_LOADER,

    distConfig: function(outputName) {

        return {
            entry: './src/cabinetDirective/cabinetDirective.js',

            eslint: {
                failOnError: true
            },

            module: {
                loaders: [
                    ESLINT_LOADER,
                    HTML_LOADER
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
