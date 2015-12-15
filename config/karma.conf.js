module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // list of files to exclude
        exclude: [],
        // list of files / patterns to load in the browser
        // list of files / patterns to load in the browser
        files: [
            '../test/browser/**/*.js',
            '../test/shared/**/*.js'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai'],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '../test/browser/**/*.js': ['webpack'],
            '../test/shared/**/*.js': ['webpack']
        },
        // test results reporter to use
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            // specify a common output directory 
            dir: 'build/reports/coverage',
            reporters: [
                // reporters not supporting the `file` property 
                {
                    type: 'text',
                    subdir: 'report-text'
                }, {
                    type: 'lcov',
                    subdir: 'report-lcov'
                },
                // reporters supporting the `file` property, use `subdir` to directly 
                // output them in the `dir` directory 
                {
                    type: 'cobertura',
                    subdir: '.',
                    file: 'cobertura.txt'
                }, {
                    type: 'lcovonly',
                    subdir: '.',
                    file: 'report-lcovonly.txt'
                }, {
                    type: 'teamcity',
                    subdir: '.',
                    file: 'teamcity.txt'
                }, {
                    type: 'text',
                    subdir: '.',
                    file: 'text.txt'
                }, {
                    type: 'text-summary',
                    subdir: '.',
                    file: 'text-summary.txt'
                },
            ]
        },
        webpack: {
            devtool: 'source-map',
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules\/dist/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }],
                postLoaders: [{
                    test: /\.json$/,
                    loader: 'json'
                }, {
                    test: /\.js$/,
                    exclude: /test|node_modules\/dist/,
                    loader: 'istanbul-instrumenter'
                }]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },
        browsers: ['Chrome'],
        // custom launchers
        customLaunchers: {
            Chrome_for_Travis_CI: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        // concurrency level how many browser should be started simultaneously
        concurrency: 4,
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 100000,
        browserNoActivityTimeout: 30000,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });

    if (process.env.TRAVIS) {

        // Use Chrome as default browser for Travis CI         
        config.browsers = ['Chrome_for_Travis_CI'];
        // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
        config.browserNoActivityTimeout = 120000;
    }
};