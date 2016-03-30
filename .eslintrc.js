const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
	parser: 'babel-eslint',

	plugins: [],

	'globals': {
		'document': true,
		'window': true,
		'spy': true,
		'mocha': true,
		'stub': true,
		'beforeEach': true,
		'useFakeTimers': true,
		'useFakeXMLHttpRequest': true,
		'useFakeServer': true
	},
	'ecmaFeatures': {
		'jsx': true,
		'modules': true,
		'es6': true
	},
	'env': {
		'browser': true,
		'es6': true,
		'mocha': true,
		'node': true
	},

	// We're stricter than the default config, mostly. We'll override a few rules
	// and then enable some React specific ones.
	rules: {
		'accessor-pairs': OFF,
		'brace-style': [ERROR, '1tbs'],
		'comma-dangle': [ERROR],
		'consistent-return': ERROR,
		'dot-location': [ERROR, 'property'],
		'dot-notation': ERROR,
		'eqeqeq': [ERROR, 'allow-null'],
		"indent": [2, "tab", {
			"SwitchCase": 1
		}],
		'jsx-quotes': [ERROR, 'prefer-double'],
		'no-cond-assign': [ERROR, 'except-parens'],
		'no-console': 0,
		'no-constant-condition': ERROR,
		'no-debugger': WARNING,
		'no-bitwise': OFF,
		'no-multi-spaces': ERROR,
		'no-restricted-syntax': [ERROR, 'WithStatement'],
		'no-shadow': ERROR,
		'no-unused-vars': [ERROR, {args: 'none'}],
		'no-dupe-keys': ERROR,
		'no-duplicate-case': ERROR,
		'no-empty-character-class': ERROR,
		'no-ex-assign': ERROR,
		'no-extra-semi': ERROR,
		'no-func-assign': ERROR,
		'no-inner-declarations': [ERROR, 'both'],
		'no-invalid-regexp': ERROR,
		'no-irregular-whitespace': ERROR,
		'no-negated-in-lhs': ERROR,
		'no-obj-calls': ERROR,
		'no-regex-spaces': ERROR,
		'no-sparse-arrays': ERROR,
		'no-unreachable': ERROR,
		'no-div-regex': ERROR,
		'no-eq-null': ERROR,
		'no-eval': ERROR,
		'no-return-assign': ERROR,
		'quotes': [ERROR, 'single', 'avoid-escape'],
		'semi-spacing': [ERROR, {
			'after': true
		}],
		'semi': [ERROR, 'always'],
		'space-before-blocks': ERROR,
		'space-before-function-paren': [ERROR, {anonymous: 'never', named: 'never'}],
		'strict': [ERROR, 'global'],
		'keyword-spacing': ERROR,
		'space-infix-ops': ERROR,
		'space-unary-ops': [ERROR, {
			'words': true
		}],
		'spaced-comment': [ERROR, 'always', {
			'exceptions': ['*']
		}],
		'wrap-regex': ERROR,
		'constructor-super': ERROR,
		'no-class-assign': ERROR,
		'no-const-assign': ERROR,
		'no-this-before-super': ERROR,
		'no-var': ERROR,
		'prefer-spread': ERROR
	}
};