global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-as-promised'));

if (!global.document || !global.window) {
	const jsdom = require('jsdom').jsdom;
	global.document = jsdom('<html><head><script></script></head><body><div id='testDiv'></div></body></html>');
	global.window = document.parentWindow;
}

require('./setup')();
