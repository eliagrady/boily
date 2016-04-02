/*!
 * boily v3.1.1
 * (c) 2016 KFlash
 * Released under the MIT License.
 */
'use strict';

var boily = { foo: 123 };

// Correct version will be set with the 'rollup-replace plugin'
boily.version = 'VERSION';

// Flow example
function foo(one, two, three) {}

boily.flow = foo;

module.exports = boily;

//# sourceMappingURL=boily.cjs.js.map
