/*!
 * boily v4.0.8
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
	boily.version = 'VERSION';

	// Flow example
	function foo(one, two, three) {}

	boily.flow = foo;

	return boily;

}));

//# sourceMappingURL=boily.js.map
