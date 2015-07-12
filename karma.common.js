/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Common karma configuration values.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var path = require('path');
var karmaWebpackPlugin = require('karma-webpack');

// Additional functions needed for testing.
var TEST_UTILITIES_DIR = 'src/testUtilities';

//-------------------------------------
// Module exports
//-------------------------------------

/*
 * @param {string} sourceFile The source file to test
 * @param {array} loaders An array of loaders to apply to the source file.
 */
module.exports = function(sourceFile, loaders) {

    var testFilesPattern = path.join(TEST_UTILITIES_DIR, 'allTests.js');

    // Return a new instance each time.
    var conf = {

        browsers: ['PhantomJS'],

        files: [
            // https://github.com/webpack/style-loader/issues/31
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',

            testFilesPattern
        ],

        frameworks: ['jasmine'],

        plugins: [
            karmaWebpackPlugin,
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        preprocessors: {},

        reporters: [
            'dots'
        ],

        webpack: {
            module: {
                loaders: loaders
            },
            resolve: {
                alias: {
                    'angular-cabinet': path.join(
                        __dirname, sourceFile)
                },
                fallback: [
                    TEST_UTILITIES_DIR
                ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    };

    conf.preprocessors[testFilesPattern] = ['webpack'];

    return conf;
};
