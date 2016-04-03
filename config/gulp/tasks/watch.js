import gulp from 'gulp';
import path from 'path';
import karma from 'karma';
import { mochaGlobals } from '../config';

const karmaConfig = path.resolve('config/karma.conf.js');

function startKarma(browser) {
	new karma.Server({
		configFile: karmaConfig,
		singleRun: false,
		browsers: [browser]
	}, function(resultCode) {}).start();
}

// Run all unit tests for browser & watch files for changes with Chrome
gulp.task('watch:chrome', () => {
	process.env.NODE_ENV = 'test';
	startKarma('Chrome');
});

// Run all unit tests for browser & watch files for changes with PhantomJS
gulp.task('watch:phantom', () => {
	process.env.NODE_ENV = 'test';
	startKarma('PhantomJS');
});

// Run all unit tests for browser & watch files for changes with Firefox
gulp.task('watch:firefox', () => {
	process.env.NODE_ENV = 'test';
	startKarma('Firefox');
});

// Run the headless unit tests as you make changes.
gulp.task('watch:server',() => {
	gulp.watch(['src/**/*', './specs/**/*spec.browser.js', './specs/**/*spec.server.js', 'package.json', '**/.eslintrc'], ['test']);
});