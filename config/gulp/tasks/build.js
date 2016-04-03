import gulp from 'gulp';
import path from 'path';
import del from 'del';
import source from 'vinyl-source-stream';
import rollup from 'rollup-stream';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import buffer from 'vinyl-buffer';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript';
import stub from 'rollup-plugin-stub';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';
import pack from '../../../package.json';

const env = process.env;
const artifactName = 'boily';
const googModuleName = 'boily';

/*
 * Banner
 **/
const copyright =
	'/*!\n' +
	' * ' + pack.name + ' v' + pack.version + '\n' +
	' * (c) ' + new Date().getFullYear() + ' ' + pack.author.name + '\n' +
	' * Released under the ' + pack.license + ' License.\n' +
	' */';

function clean() {
	return del(['dist/']);
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


// Build a production bundle
gulp.task('build:prod', () => {
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
});

// Build a development bundle
gulp.task('build:dev', () => {
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
);

// Build a commonJS bundle
gulp.task('build:common', () => {
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
});

// Build a ES6 bundle
gulp.task('build:es6', () => {
		return clean()
			.then(() => {
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
			})
	}
);

// Build a closure bundle
gulp.task('build:closure', () => {
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
});