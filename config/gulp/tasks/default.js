import gulp from 'gulp';

gulp.task('default', ['setWatch', 'build'], () => {
	gulp.start('server');
});