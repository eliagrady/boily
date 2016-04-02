import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import glob from 'glob';
import path from 'path';
import {Instrumenter} from 'isparta';
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
import karma from 'karma';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';
import coveralls from 'gulp-coveralls';

// Load all of our Gulp plugins
const $ = loadPlugins();

const env = process.env;
const entryFileName = 'src/index.js';
const artifactName = 'boily';
const googModuleName = 'boily';
const karmaConfig = path.resolve('config/karma.conf.js');

/*
 * Banner
 **/
const copyright =
	'/*!\n' +
	' * ' + pack.name + ' v' + pack.version + '\n' +
	' * (c) ' + new Date().getFullYear() + ' ' + pack.author + '\n' +
	' * Released under the ' + pack.license + ' License.\n' +
	' */';

function clean() {
	return del(['dist/']);
}

function cleanTmp(done) {
	del(['tmp']).then(() => done());
}

function onError() {
	$.util.beep();
}

// Lint a set of files
function lint(files) {
	return gulp.src(files)
		.pipe($.plumber())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failOnError())
		.on('error', onError);
}

function lintSrc() {
	return lint('src/**/*.js');
}

function lintTest() {
	return lint('src/**/*__tests__*/**/*.js');
}

function lintGulpfile() {
	return lint('gulpfile.babel.js');
}

function _mocha() {
	return gulp.src(['config/setup/node.js', 'src/**/*.js', './src/**/*__tests__*/**/*spec.server.js'], {read: false})
		.pipe($.mocha({
			reporter: 'spec',
			globals: Object.keys({
					'expect': true,
					'mock': true,
					'sandbox': true,
					'spy': true,
					'stub': true,
					'useFakeServer': true,
					'useFakeTimers': true,
					'useFakeXMLHttpRequest': true
				}
			),
			ignoreLeaks: false
		}));
}

function _registerBabel() {
	require('babel-register');
}

function test() {
	_registerBabel();
	return _mocha();
}

function coverage(done) {
	_registerBabel();
	gulp.src(['./src/**/*.js'])
		.pipe($.istanbul({ instrumenter: Instrumenter }))
		.pipe($.istanbul.hookRequire())
		.pipe(coveralls())
		.on('finish', () => {
			return test()
				.pipe($.istanbul.writeReports())
				.on('end', done);
		});
}

const watchFiles = ['src/**/*', './src/**/*__tests__*/**/*spec.browser.js', './src/**/*__tests__*/**/*spec.server.js', 'package.json', '**/.eslintrc'];

// Run the headless unit tests as you make changes.
function watch() {
	gulp.watch(watchFiles, ['test']);
}

function testBrowser() {
	// Our testing bundle is made up of our unit tests, which
	// should individually load up pieces of our application.
	// We also include the browser setup file.
	//const testFiles = glob.sync('./test/unit/**/*.js');
	const testFiles = glob.sync('./src/**/*__tests__*/**/*spec.browser.js')
		.concat(glob.sync('./src/**/*__tests__*/**/*spec.server.js'));
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
					// This is what allows us to author in future JavaScript
					{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
					// This allows the test setup scripts to load `package.json`
					{ test: /\.json$/, exclude: /node_modules/, loader: 'json-loader' }
				]
			},
			plugins: [
				// By default, webpack does `n=>n` compilation with entry files. This concatenates
				// them into a single chunk.
				new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
			],
			devtool: 'inline-source-map'
		}, null, function() {
			if (firstBuild) {
				$.livereload.listen({port: 35729, host: 'localhost', start: true});
				const watcher = gulp.watch(watchFiles, ['lint']);
			} else {
				$.livereload.reload('./tmp/__spec-build.js');
			}
			firstBuild = false;
		}))
		.pipe(gulp.dest('./tmp'));
}

const entry = path.resolve('src/index.js');

function bundle(format) {
	return rollup({
		entry: entry,
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
				plugins: env.NODE_ENV ?
					['transform-inline-environment-variables'] :
					[]
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
		.pipe(sourcemaps.init({loadMaps: true}))
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
		.pipe(sourcemaps.init({loadMaps: true}))
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
		.pipe(source(artifactName + '-closure.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
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
		.pipe(sourcemaps.init({loadMaps: true}))
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
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
}

function jsDist() {
	// These must be run serially: clean must complete before any of the js
	// targets run. The js and minify targets cannot run in parallel as they both
	// change process.env.NODE_ENV. The CommonJS target could run in parallel
	// with the js and minify targets, but currently is not.
	return clean()
		.then(jsCommonJS)
		.then(js)
		.then(minify);
}

function jsES2015Dist() {
	// These must be run serially: clean must complete before any of the js
	// targets run. The js and minify targets cannot run in parallel as they both
	// change process.env.NODE_ENV. The CommonJS target could run in parallel
	// with the js and minify targets, but currently is not.
	return clean()
		.then(jsES2015)
		.then(js)
		.then(minify);
}

function unit(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Chrome', 'Firefox']
	}, function(resultCode) {
	}).start();
}

function KarmaFirefox(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Firefox']
	}, function(resultCode) {
	}).start();
}


function KarmaChrome(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['Chrome']
	}, function(resultCode) {
	}).start();
}

function KarmaPhantomJS(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: ['PhantomJS']
	}, function(resultCode) {
	}).start();
}

function ChromeWatch(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['Chrome']
	}, function(resultCode) {
	}).start();
}

function FirefoxWatch(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['Firefox']
	}, function(resultCode) {
	}).start();
}

function PhantomWatch(done) {
	env.NODE_ENV = 'test';

	new karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: ['PhantomJS']
	}, function(resultCode) {
	}).start();
}

// Remove our temporary files
gulp.task('clean-tmp', cleanTmp);

// Lint our source code
gulp.task('lint-src', lintSrc);

// Lint our test code
gulp.task('lint-test', lintTest);

// Lint this file
gulp.task('lint-gulpfile', lintGulpfile);

// Lint everything
gulp.task('lint', ['lint-src', 'lint-test']);

// Build two versions of the library
//gulp.task('build', ['lint', 'clean'], js);

// Lint and run our tests
gulp.task('test', ['lint'], test);

// Set up coverage and run tests
gulp.task('coverage',coverage);

// Set up a livereload environment for our spec runner `test/runner.html`
gulp.task('browser', ['clean-tmp'], testBrowser);

// Run the headless unit tests as you make changes.
gulp.task('watch', watch);

// An alias of test
gulp.task('default', ['test']);

// clean
gulp.task('clean', clean);

// Run all unit tests for browser
gulp.task('unit', unit);

// Run all unit tests for server
gulp.task('test:server', test);

// Run all unit tests
gulp.task('test', ['unit'], test);

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

gulp.task('watch:server', watch);

// Build a production bundle
gulp.task('build:prod', minify);

// Build a development bundle
gulp.task('build:dev', build);

// Build a commonJS bundle
gulp.task('build:common', jsDist);

// Build a ES6 bundle
gulp.task('build:es6', jsES2015Dist);

// Build a closure bundle
gulp.task('build:closure', jsClosure);