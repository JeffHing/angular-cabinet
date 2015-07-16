/*
 * Copyright 2015. Author: Jeffrey Hing. All Rights Reserved.
 *
 * MIT License
 *
 * Webpack base configurations.
 */
'use strict';

//-------------------------------------
// Module dependencies and variables
//-------------------------------------

var ip = require('ip');
var path = require('path');

// Set to true to expose development server.
var isServerPublic = false;

// Webpack loaders.
var loaders = {

    // Load CSS as javascript.
    css: {
        test: /\.css$/,
        loader: 'style!css!csslint?failOnError=false'
    },

    // Lint javascript.
    eslint: {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },

    // Load HTML as javascript.
    html: {
        test: /\.html$/,
        loader: 'html'
    }
};

// Library settings.
var library = {

    // GitHub project name.
    projectName: 'angular-cabinet-ui',

    // Name of library variable for non-module build environments.
    variable: 'cabinetDirective',

    // Filename of library.
    filename: 'cabinetDirective.js',

    // Filename of minimized library.
    minFilename: 'cabinetDirective.min.js',

    // Path to library source.
    sourceFile: './src/cabinetDirective/cabinetDirective.js',

    // Loaders to load the library source.
    sourceLoaders: [
        loaders.eslint
    ]
};

// Development configuration.
var devConfig = function() {

    var config = {

        devServer: {
            host: isServerPublic ? ip.address() : undefined,
            contentBase: 'src/',
            noInfo: true,
            inline: true
        },

        entry: './src/app.js',

        eslint: {
            failOnError: false
        },

        module: {
            loaders: [
                loaders.css,
                loaders.eslint,
                loaders.html
            ]
        },

        output: {},

        resolve: {
            alias: {}
        }
    };

    config.resolve.alias[library.projectName] =
        path.join(__dirname, library.sourceFile);

    return config;
};

// Distribution configuration.
var distConfig = function(outputName) {

    return {
        entry: library.sourceFile,

        eslint: {
            failOnError: true
        },

        module: {
            loaders: library.sourceLoaders
        },

        output: {
            filename: outputName,
            library: library.variable,
            libraryTarget: 'umd',
            path: 'dist/'
        }
    };
};

//-------------------------------------
// Module exports
//-------------------------------------

module.exports = {
    devConfig: devConfig,
    distConfig: distConfig,
    library: library
};
