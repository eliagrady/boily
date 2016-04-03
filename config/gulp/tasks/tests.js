import gulp from 'gulp';
import path from 'path';
import karma from 'karma';
import mocha from 'gulp-mocha';
import { mochaGlobals } from '../config';

const karmaConfig = path.resolve('config/karma.conf.js');

function startKarma(browser) {
	new karma.Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: [browser]
	}, function(resultCode) {}).start();
}

// Run all unit tests for server
gulp.task('test:server', () => {
	require('babel-register');
	return gulp.src(['config/setup/node.js', './specs/**/*spec.server.js'], {
			read: false
		})
		.pipe(mocha({
			reporter: 'spec',
			ui: 'bdd',
			timeout: 15000,
			globals: Object.keys(mochaGlobals),
			ignoreLeaks: false
		}));
});

// Run Karma with PhantomJS browser
gulp.task('karma:phantom', () => {
	process.env.NODE_ENV = 'test';
	startKarma('PhantomJS');
});

// Run Karma with Chrome browser
gulp.task('karma:chrome', () => {
	process.env.NODE_ENV = 'test';
	startKarma('Chrome');
});

// Run Karma with Firefox browser
gulp.task('karma:firefox', () => {
		process.env.NODE_ENV = 'test';
		startKarma('Firefox');
	}
);
