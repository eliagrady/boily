# v.4.2.6

- Added rollup-plugin-commonjs support in order to support statements such as:
  `import { render } from 'react-dom'` - Credit: [eliagrady](https://github.com/eliagrady)
- updated dependencies

# v.4.2.1

- add back "normal" Babel 2015 preset, and fixed issue with nodeJS 6

# v.4.1.6

- added support for nodeJS 6
- fixed issues with Travis.yml
- updated dependencies

# v.4.1.0

- refactored Karma
- fixed a few issues with Travis.yml
- updated dependencies

# v.4.0.7

- Travis.yml changed to use the newest Chrome browser by default due to issues ES2015 support in PhantomJS
- Travis now tests on Multiple Operating Systems
- Karma changed to use Chrome browser by default due to issues ES2015 support in PhantomJS
- Made boily NodeJS 6.0 ready

# v.4.0.2

- fixed issue where JSDOM didn't work for server tests
- server tests now runs from package.json. No gulp
- `coverage` changed to `server:cov`
- made babel support nodeJS 5.x 100%
- added new babel 2015 preset
- minor tweaks

# v.3.2.7

- simplified Travis

# v.3.2.4
- refactored jsdom configuration
- updated dependencies

# v.3.2.0

- Fixed a issue where jsDOM failed for React
- updated readme

# v.3.1.9

- Removed fixture support. Kept only jsDom

# v.3.1.8

- Fixed fixture issues

# v.3.1.7

- Fixed an issue where coverage wouldn't work on client side
- added jsdom support
- added fixtures. The fixtures can be used like this `this.setFixtures('<div></div>');` inside `beforeEach()`. They got teared down automatically

# v.3.1.5

- refactored some of the gulp tasks
- fixed a few gulp task issues


# v.3.1.3

- fixed gulp issues

# v.3.1.1

- fixed minor issues
- improved build process

# v.3.0.9
- fixed coverage report issues
- fixed and re-factored how tests works

# v.3.0.7
  
 - minor fixes
 - fixed issues where flow didn't work as expected
 - fixed bundle issues to cmd, es6 etc
 - updated readme
 - general cleanup
 
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
