
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import glob from 'glob';
import path from 'path';
import { Instrumenter } from 'isparta';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import source from 'vinyl-source-stream';
import rollup from 'rollup-stream';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import buffer from 'vinyl-buffer';
import filesize from 'rollup-plugin-filesize';
import pack from './package.json';
import typescript from 'rollup-plugin-typescript';
import stub from 'rollup-plugin-stub';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';
import coveralls from 'gulp-coveralls';
import taskListing from 'gulp-task-listing';

// Load all of our Gulp plugins
const $ = loadPlugins();

const env = process.env;
const artifactName = 'boily';
const googModuleName = 'boily';
const karmaConfig = path.resolve('config/karma.conf.js');

/*
 * Banner
 **/
const copyright =
	'/*!\n' +
	' * ' + pack.name + ' v' + pack.version + '\n' +
	' * (c) ' + new Date().getFullYear() + ' ' + pack.author.name + '\n' +
	' * Released under the ' + pack.license + ' License.\n' +
	' */';

const mochaGlobals = {
	expect: true,
	mock: true,
	sandbox: true,
	spy: true,
	stub: true,
	useFakeServer: true,
	useFakeTimers: true,
	useFakeXMLHttpRequest: true
};

function clean() {
	return del(['dist/']);
}

// Lint a set of files
function lint(files) {
	return gulp.src(files)
		.pipe($.plumber())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failOnError())
		.on('error', () => {
			$.util.beep();
		});
}

// run server tests
function runServerTests() {
	require('babel-register');
	return gulp.src(['config/setup/node.js', './specs/**/*spec.server.js'], {
			read: false
		})
		.pipe($.mocha({
			reporter: 'spec',
			ui: 'bdd',
			timeout: 15000,
			globals: Object.keys(mochaGlobals),
			ignoreLeaks: false
		}));
}

function bundle(format) {
	return rollup({
		entry: path.resolve('src/index.js'),
		sourceMap: true,
		banner: copyright,
		plugins: [
			env.min === 'true' ? uglify({
				warnings: false,
				compress: {
					screw_ie8: true,
					dead_code: true,
					unused: true,
					keep_fargs: false,
					drop_debugger: true,
					booleans: true // various optimizations for boolean context, for example !!a ? b : c → a ? b : c
				},
				mangle: {
					screw_ie8: true
				}
			}) : {},
			babel({
				babelrc: false,
				presets: 'es2015-rollup',
				exclude: 'node_modules/**',
				plugins: env.NODE_ENV ? [
					'transform-flow-strip-types',
					'syntax-flow',
					'transform-remove-debugger',
					'transform-remove-console',
					'transform-undefined-to-void',
					'transform-inline-environment-variables'
				] : []
			}),
			eslint(), // add your own Eslint configuration here
			nodeResolve({
				jsnext: true,
				main: true
			}),
			stub(),
			typescript(),
			filesize(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				VERSION: pack.version
			})
		],
		format: format,
		moduleName: 'Boily',
		globals: {
			boily: 'Boily'
		}
	});
}

function build() {
	env.NODE_ENV = 'development';
	env.min = false;

	return bundle('umd')
		.pipe(source(artifactName + '.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

/*
 * Create a Google Closure bundle
 */
function minify() {
	env.NODE_ENV = 'production';
	env.min = true;

	return bundle('umd')
		.pipe(source(artifactName + '.min.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

/*
 * Create a Google Closure bundle
 */
function jsClosure(done) {
	env.NODE_ENV = undefined;
	env.min = false;
	const moduleDeclaration = 'goog.module(\'' + googModuleName + '\');';

	return bundle('cjs')
		.pipe(source(artifactName + '.closure.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(replace(/('|")use strict\1;/, moduleDeclaration))
		.pipe(replace("process.env.NODE_ENV !== 'production'", 'goog.DEBUG'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

/*
 * Create a CommonJS bundle
 */
function jsCommonJS() {
	env.NODE_ENV = undefined;
	env.min = false;

	return bundle('cjs')
		.pipe(source(artifactName + '.cjs.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

/*
 * Create a ES2015 bundle
 */
function jsES2015() {
	env.NODE_ENV = undefined;
	env.min = false;

	return bundle('es6')
		.pipe(source(artifactName + '.es2015.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

function jsES2015Dist() {
	return clean()
		.then(jsES2015)
}

// ------------------
// CI tests suites

function unit(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Chrome', 'Firefox']
	}, function(resultCode) {}).start();
}

function KarmaFirefox(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Firefox']
	}, function(resultCode) {}).start();
}

function KarmaChrome(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Chrome']
	}, function(resultCode) {}).start();
}

function KarmaPhantomJS(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['PhantomJS']
	}, function(resultCode) {}).start();
}

function ChromeWatch(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['Chrome']
	}, function(resultCode) {}).start();
}

function FirefoxWatch(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['Firefox']
	}, function(resultCode) {}).start();
}

function PhantomWatch(done) {
	env.NODE_ENV = 'test';

	new $.karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['PhantomJS']
	}, function(resultCode) {}).start();
}

function js() {

	return bundle('umd')
		.pipe(source(artifactName + '.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

// Build all
function buildAll() {

	env.NODE_ENV = 'development';
	env.min = false;

	return clean()
		.then(jsCommonJS)
		.then(jsES2015Dist)
		.then(jsClosure)
		.then(js)
		.then(minify);
}

// Remove our temporary files
gulp.task('clean:tmp', (done) => {
	del(['tmp']).then(() => done());
});

// Lint our source code
gulp.task('lint:src', () => lint('src/**/*.js'));

// Lint our test code
gulp.task('lint:test', () => lint('src/**/*__tests__*/**/*.js'));

// Lint this file
gulp.task('lint:gulp', () => lint('gulpfile.babel.js'));

// Lint everything
gulp.task('lint', ['lint-src', 'lint-test']);

// Lint and run our tests
gulp.task('test', ['lint'], runServerTests);

// Set up coverage and run tests
gulp.task('coverage', (done) => {
		require('babel-register');
		gulp.src(['./src/**/*.js'])
			.pipe($.istanbul({
				instrumenter: Instrumenter
			}))
			.pipe($.istanbul.hookRequire())
			.pipe(coveralls())
			.on('finish', () => {
				return gulp.src(['config/setup/node.js', 'specs/**/*spec.browser.js'], {
						read: false
					})
					.pipe($.mocha({
						reporter: 'spec',
						ui: 'bdd',
						timeout: 15000,
						globals: Object.keys(mochaGlobals),
						ignoreLeaks: false
					}))
					.pipe($.istanbul.writeReports())
					.on('end', done);
			});
	}
);

// Set up a livereload environment for our spec runner `test/runner.html`
gulp.task('browser', ['clean:tmp'], () => {
	// Our testing bundle is made up of our unit tests, which
	// should individually load up pieces of our application.
	// We also include the browser setup file.
	const testFiles = glob.sync('./specs/**/*spec.browser.js')
		.concat(glob.sync('./specs/**/*spec.server.js'));
	const allFiles = ['./config/setup/browser.js'].concat(testFiles);

	// Lets us differentiate between the first build and subsequent builds
	let firstBuild = true;

	// This empty stream might seem like a hack, but we need to specify all of our files through
	// the `entry` option of webpack. Otherwise, it ignores whatever file(s) are placed in here.
	return gulp.src('')
		.pipe($.plumber())
		.pipe(webpackStream({
			watch: true,
			entry: allFiles,
			output: {
				filename: '__spec-build.js'
			},
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
						exclude: /node_modules/,
						loader: 'babel-loader'
					},
					// This allows the test setup scripts to load `package.json`
					{
						test: /\.json$/,
						exclude: /node_modules/,
						loader: 'json-loader'
					}
				]
			},
			plugins: [
				// By default, webpack does `n=>n` compilation with entry files. This concatenates
				// them into a single chunk.
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 1
				})
			],
			devtool: 'inline-source-map'
		}, null, function() {
			if (firstBuild) {
				$.livereload.listen({
					port: 35729,
					host: 'localhost',
					start: true
				});
			} else {
				$.livereload.reload('./tmp/__spec-build.js');
			}
			firstBuild = false;
		}))
		.pipe(gulp.dest('./tmp'));
});

// Build development and minified bundle
gulp.task('default', ['build:dev'], minify);

// clean
gulp.task('clean', clean);

// Run all unit tests for server
gulp.task('test:server', runServerTests);

// Run Karma with PhantomJS browser
gulp.task('KarmaPhantomJS', KarmaPhantomJS);

// Run Karma with Chrome browser
gulp.task('KarmaChrome', KarmaChrome);

// Run Karma with Firefox browser
gulp.task('KarmaFirefox', KarmaFirefox);

// Run all unit tests for browser & watch files for changes with Chrome
gulp.task('watch:chrome', ChromeWatch);

// Run all unit tests for browser & watch files for changes with PhantomJS
gulp.task('watch:phantom', PhantomWatch);

// Run all unit tests for browser & watch files for changes with Firefox
gulp.task('watch:firefox', FirefoxWatch);

// Run the headless unit tests as you make changes.
gulp.task('watch:server',() => {
	gulp.watch(['src/**/*', './specs/**/*spec.browser.js', './specs/**/*spec.server.js', 'package.json', '**/.eslintrc'], ['test']);
});

// Build a production bundle
gulp.task('build:prod', minify);

// Build a development bundle
gulp.task('build:dev', build);

// Build a commonJS bundle
gulp.task('build:common', jsCommonJS);

// Build a ES6 bundle
gulp.task('build:es6', jsES2015Dist);

// Build a ES6 bundle
gulp.task('build:all', buildAll);

// Build a closure bundle
gulp.task('build:closure', jsClosure);

// List all tasks
gulp.task('help', taskListing.withFilters(/:/));