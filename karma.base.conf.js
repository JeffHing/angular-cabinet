/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * A function which returns the karma configuration merged
 * with the provided options.
 *
 * @example
 *    var karmaBaseConf = require('./karma.base.conf.js);
 *    config.set(karmaBaseConf({...});
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var extend = require('extend');
var path = require('path');
var karmaWebpackPlugin = require('karma-webpack');

// Additional functions needed for testing.
var TEST_UTILITIES_DIR = 'src/testUtilities';

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = function(options) {

    var testFilesPattern = path.join(TEST_UTILITIES_DIR, 'allTests.js');

    // Return a new instance each time.
    var finalOptions = {

        browsers: ['PhantomJS'],

        frameworks: ['jasmine'],

        files: [
            // https://github.com/webpack/style-loader/issues/31
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',

            testFilesPattern
        ],

        webpack: {
            module: {
                loaders: [{
                    // Load HTML as javascript.
                    test: /\.html$/,
                    loader: 'html'
                }]
            },
            resolve: {
                alias: {},
                fallback: [
                    TEST_UTILITIES_DIR
                ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },

        plugins: [
            karmaWebpackPlugin,
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        preprocessors: {},

        reporters: ['progress']
    };

    finalOptions.preprocessors[testFilesPattern] = ['webpack'];

    extend(true, finalOptions, options);

    return finalOptions;
};
