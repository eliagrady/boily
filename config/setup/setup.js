module.exports = function(runner) {
	runner = runner ? runner : global;
	runner.expect = runner.chai.expect;

	// First check if '$testDiv' can be found. If so, we are on server-side.
	const $testDiv = document.getElementById("testDiv") || false;

	// ...ok, this failed. We are on client-side.
	if (!$testDiv) {
		// Set up a $testDiv for client-side
		const test = document.createElement("div");
		test.id = "testDiv";
		document.body.appendChild(test);
		const $testDiv = document.getElementById("testDiv");
	}

	// Add fixtures
	function setFixtures(content) {
		$testDiv.innerHTML = content;
	}

	// clear fixutres after each 'run'
	function clearFixturesfunction() {
		$testDiv.innerHTML = "";
	}

	beforeEach(function() {
		runner.sandbox = runner.sinon.sandbox.create();
		runner.stub = runner.sandbox.stub.bind(runner.sandbox);
		runner.spy = runner.sandbox.spy.bind(runner.sandbox);
		runner.mock = runner.sandbox.mock.bind(runner.sandbox);
		runner.useFakeTimers = runner.sandbox.useFakeTimers.bind(runner.sandbox);
		runner.useFakeXMLHttpRequest = runner.sandbox.useFakeXMLHttpRequest.bind(runner.sandbox);
		runner.useFakeServer = runner.sandbox.useFakeServer.bind(runner.sandbox);
		runner.setFixtures = setFixtures;
		runner.clearFixtures = clearFixtures;
	});

	afterEach(function() {
		delete runner.stub;
		delete runner.spy;
		runner.sandbox.restore();
		clearFixtures();
	});
};
