/*!
 * boily v3.0.7
 * (c) 2016 Kenny F.
 * Released under the MIT License.
 */
var boily = { foo: 123 };

// Correct version will be set with the 'rollup-replace plugin'
boily.version = 'VERSION';

// Flow example
function foo(one, two, three) {}

boily.flow = foo;

// Only for development mode
if ('development' !== 'production') {
  boily.dev = '123';
}

export default boily;

//# sourceMappingURL=boily.es2015.js.map
