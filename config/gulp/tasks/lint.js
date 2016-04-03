import gulp from 'gulp';
import eslint from 'gulp-eslint';
import beep from 'gulp-util';
import plumber from 'gulp-plumber';

// Lint a set of files
function lint(files) {
	return gulp.src(files)
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
		.on('error', () => {
			util.beep();
		});
}

// Lint our source code
gulp.task('lint:src', () => lint('src/**/*.js'));

// Lint our test code
gulp.task('lint:test', () => lint('src/**/*__tests__*/**/*.js'));

// Lint this file
gulp.task('lint:gulp', () => lint('gulpfile.babel.js'));

// Lint everything
gulp.task('lint', ['lint:src', 'lint:test']);
