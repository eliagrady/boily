// Karma configuration
module.exports = function(config, specificOptions) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'sinon-chai',
			'sinon',
			'chai-as-promised',
			'chai',
			'mocha'
		],
		// list of files / patterns to load in the browser
		files: [
			'../specs/**/*spec.browser.js',
			'../specs/**/*spec.server.js',
		],
		// list of files to exclude
		exclude: [],
		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'../specs/**/*spec.server.js': ['webpack', 'sourcemap'],
			'../specs/**/*spec.browser.js': ['webpack', 'sourcemap']
		},
		webpack: {
			cache: true,
			module: {
				loaders: [
					// Use imports loader to hack webpacking sinon.
					// https://github.com/webpack/webpack/issues/177
					{
						test: /sinon\.js/,
						loader: 'imports?define=>false,require=>false'
					},
					// Perform babel transpiling on all non-source, test files.
					{
						test: /\.js$/,
						exclude: /(src\/dist|.git|node_modules)/,
						loader: 'babel-loader',
						query: {
							cacheDirectory: true
						}
					}
				]
			}
		},
		webpackMiddleware: {
			noInfo: true
		},
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha'],
		// reporter options
		mochaReporter: {
			colors: {
				success: 'green',
				info: 'bgYellow',
				warning: 'cyan',
				error: 'bgRed'
			},
			divider: ''
		},

		browsers: ['PhantomJS'],
		browserDisconnectTimeout: 10000,
		browserDisconnectTolerance: 2,

		// Concurrency level
		// how many browser should be started simultaneous
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

		// Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
		config.browserNoActivityTimeout = 120000;

		if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
			// Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
			// for another build to finish) and so the `captureTimeout` typically kills
			// an in-queue-pending request, which makes no sense.
			config.captureTimeout = 0;
		}
	}
};