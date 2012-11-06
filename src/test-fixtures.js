function testFixture(description, tests) {
	this.getTests = function () { return tests }
}

function autoRunTestFixture(description, outputter, tests) {
	loadResource('outputting.js', function () {
		outputTests(new testFixture(description, tests), outputter);
	});
}

function autoRunTestFixtureToHtml(description, tests) {
	loadResource('outputting.js', function () {
		outputTestsToHtml(new testFixture(description, tests));
	});
}

function autoRunTestFixtureToConsole(description, tests) {
	loadResource('outputting.js', function () {
		outputTestsToConsole(new testFixture(description, tests));
	});
}