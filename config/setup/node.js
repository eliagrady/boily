global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-as-promised'));

if (!global.document || !global.window) {
	// Setup the jsdom environment
	// @see https://github.com/facebook/react/issues/5046
	const jsdom = require('jsdom').jsdom;
	global.document = jsdom('<!doctype html><html><body></body></html>');
	global.window = document.defaultView;
	global.navigator = global.window.navigator;
}

require('./setup')();
