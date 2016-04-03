import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import coveralls from 'gulp-coveralls';
import { Instrumenter } from 'isparta';

import { mochaGlobals } from '../config';

// Set up coverage and run tests
gulp.task('coverage', (done) => {
		require('babel-register');
		gulp.src(['./src/**/*.js'])
			.pipe(istanbul({
				instrumenter: Instrumenter
			}))
			.pipe(istanbul.hookRequire())
			.pipe(coveralls())
			.on('finish', () => {
				return gulp.src(['config/setup/node.js', 'specs/**/*spec.browser.js'], {
						read: false
					})
					.pipe(mocha({
						reporter: 'spec',
						ui: 'bdd',
						timeout: 15000,
						globals: Object.keys(mochaGlobals),
						ignoreLeaks: false
					}))
					.pipe(istanbul.writeReports())
					.on('end', done);
			});
	}
);