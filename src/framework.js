requires('outputting.js');
requires('utils.js');
requires('formatting.js');

function testFixture(description, tests) {
	var desc = description;
	var tests = tests;
	this.getDescription = function () { return desc }
	this.getTests = function () { return tests }
	this.outputTo = function (testOutputter) { outputTestFixture(this, testOutputter) }
	this.outputToConsole = function () { this.output(testOutputters.console) }
	this.outputToHTML = function () { this.output(testOutputters.html) }
}

function autoRunTestFixture(description, outputter, tests) {
	new testFixture(description, tests).output(outputter);
}

function autoRunTestFixtureToHtml(description, tests) {
	new testFixture(description, tests).output(testOutputters.html);
}

function autoRunTestFixtureToConsole(description, tests) {
	new testFixture(description, tests).output(testOutputters.console);
}