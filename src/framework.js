requires('outputting.js');
requires('utils.js');
requires('formatting.js');

function testFixture(description, tests) {
	var desc = description;
	var tests = tests;
	this.getDescription = function () { return desc }
	this.getTests = function () { return tests }
	this.outputResults = function (testOutputter) {
		outputTestFixtureResults(this, testOutputter);
	}
}

function autoRunTestFixture(description, tests) {
	new testFixture(description, tests).outputResults(testOutputters.html);
}