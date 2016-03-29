const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

module.exports = {
	cache: true,
	debug: true,
	hot:false,
	output: {},
	entry: {},
	module: {
		postLoaders: [{
			test: /\.js?$/,
			exclude: /(src\/dist|packages|.git|node_modules|__tests__)/,
			include: path.resolve('src/'),
			loader: 'isparta',
		}],
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loaders: 'babel-loader',
			query: {
				plugins: [
					'transform-object-rest-spread',
					'transform-flow-strip-types',
					'syntax-flow',
					'babel-plugin-rewire']
			}

		}]
	},
	resolve: {
		extensions: ['', '.js']
	},
	plugins: []
};