const webpack = require('webpack');
const path = require('path');

module.exports = {
	cache: true,
	debug: true,
	hot:false,
	output: {},
	entry: {},
	// *optional* babel options: isparta will use it as well as babel-loader
	babel: {
		presets: ['es2015']
	},
	isparta: {
		embedSource: true,
		noAutoWrap: true,
		// these babel options will be passed only to isparta and not to babel-loader
		babel: {
			presets: ['es2015']
		}
	},
	module: {

		loaders: [
			// Use imports loader to hack webpacking sinon.
			// https://github.com/webpack/webpack/issues/177
			{
				test: /sinon\.js/,
				loader: "imports?define=>false,require=>false"
			},
			// Perform babel transpiling on all non-source, test files.
			{
				test: /\.js$/,
				exclude: [
					path.resolve('node_modules/'),
					path.join(__dirname, '../src')

				],
				loader: 'babel-loader'
			},
			// This allows the test setup scripts to load `package.json`
			{
				test: /\.json$/,
				exclude: /node_modules/,
				loader: 'json-loader'
			},
			// Instrument source files with isparta-loader (will perform babel transpiling).
			{
				test: /\.js?$/,
				include: path.join(__dirname, '../src'),
				loader: 'isparta',
				query: {
					cacheDirectory: true
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js']
	},
	plugins: []
};
