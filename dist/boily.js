/*!
 * boily v2.0.11
 * (c) 2016 KFlash
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Boily = factory());
}(this, function () { 'use strict';

	var boily = { foo: 123 };

	// Correct version will be set with the 'rollup-replace plugin'
	boily.version = '2.0.11';

	// Flow example
	function foo(one, two, three) {}

	boily.flow = foo;

	return boily;

}));