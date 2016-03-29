import * as p from 'path';
import * as fs from 'fs';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import pack from '../package.json';
import typescript from 'rollup-plugin-typescript';

/*
 * Banner
 **/
const copyright =
	'/*!\n' +
	' * ' + pack.name + ' v' + pack.version + '\n' +
	' * (c) ' + new Date().getFullYear() + ' ' + pack.author.name + '\n' +
	' * Released under the ' + pack.license + ' License.\n' +
	' */'

const entry = p.resolve('src/index.js');
const dest  = p.resolve(`dist/boily.${process.env.NODE_ENV === 'production' ? 'min.js' : 'js'}`);

const bundleConfig = {
	dest,
	format: 'umd',
	moduleName: 'Boily',
	globals: {
		boily: 'Boily'
	},
	banner: copyright,
	sourceMap: false // set to true to generate sourceMap
};

const plugins = [
	babel({
		babelrc: false,
		presets: 'es2015-rollup',
		plugins: ["transform-flow-strip-types"]
	}),
	nodeResolve({
		jsnext: true,
		main: true
	}),
	typescript(),
	filesize(),
	replace({
		'process.env.NODE_ENV': JSON.stringify('production'),
		VERSION: pack.version
	})
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(
		uglify({
			warnings: false,
			compress: {
				screw_ie8: true,
				dead_code: true,
				unused: true,
				drop_debugger: true, //
				booleans: true // various optimizations for boolean context, for example !!a ? b : c → a ? b : c
			},
			mangle: {
				screw_ie8: true
			}
		})
	);
}

Promise.resolve(rollup({entry, plugins}))
	.then(({write}) => write(bundleConfig));

process.on('unhandledRejection', (reason) => {throw reason;});