import boily from './foo';

// Correct version will be set with the 'rollup-replace plugin'
boily.version = 'VERSION';

// Flow example
function foo(one: any, two: number, three?): string {}

// Only for development mode
if ( process.env.NODE_ENV !== 'production' ) {
	boily.dev = '123';
}

export default boily;