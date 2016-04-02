# v.3.0.3

- minor fixes
- 

# v.3.0.0

- major rewrite
- gulp added to handle coverage cross-browser. Karma + webpack had a major issue
- fixed issues where coverage lines was reported wrong
- fixed issues with mocha tests server side
- browser tests now require that you open the `test-runner.html` in your browser after you have run `npm run browser`
- added support for Google Closure
- added support for bundling till various formats - es6, commonjs, umd, and Google closure

# v.2.0.20

- improved Travis performance. PhantomJS now used by default
- minor cleanup

# v.2.0.19

- fixed minor webpack config issues
- updated depednencies
- updated readme

# v.2.0.14

- simplified webpack config
- enabled loose mode where available for testing purposes
- added eslint for Rollup bundles

# v.2.0.11

- fixed issues where coverage reported wrong line numbers

# v.2.1.0

- added a few babel minification helpers
   1. auto-remove debugger
   2. auto-remove console.log
   3. transform undefined to void 0
-

# v.2.0.11

- fixed couple of rewire issues ( brucek )
- fixed karma issues

# v.2.0.10

- fixed issue where older nodeJS are not supported anymore

# v.2.0.9

- Fixed issue where coverage reported wrong line numbes

# v.2.0.8

- improved the eslinnt configuration
- minor bug fixes

# v.2.0.7

- Added support for Promise testing with Chai
- Added option for stubbing modules during tests with Rollup

# v.2.0.6

- Fixed rewire issues

# v.2.0.4

- added support for Flow comments. Both parsing and transformation.
- added support for JSX. Only syntax parsing.
- a few bug fixes

# v.2.0.1

- supports stubs, spy, sandbox etc for browser testing (*port 8080*)
- added rewire. Enables options to mock modules for testing purposes
- added support for SinonJS with examples for test doubles
- Typescript support
- improved coverage report support
- added feature for setting environment variables across platforms
- major refactoring
- all dependencies up to date

# v.1.0.0

- stable version

# v.0.9.4

* major refactoring
* added UT testing services
* support for BrowserStack and sauceLab
* package upgrades
* improved how Rollup bundle
* added support for bundle down to ES6 format through
* *jsnext:main*
* improved unit tests the browser - *port 8080*
* improved linting
* use of latest technology
