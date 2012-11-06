function testFixture(description, tests) {
	this.getDescription = function () { return description }
	this.getTests = function () { return tests }
}

function autoRunTestFixture(description, outputter, tests) {
	loadResource('outputting.js', function () {
		outputTestFixture(new testFixture(description, tests), outputter);
	});
}

function autoRunTestFixtureToHtml(description, tests) {
	loadResource('outputting.js', function () {
		outputTestFixtureToHtml(new testFixture(description, tests));
	});
}

function autoRunTestFixtureToConsole(description, tests) {
	loadResource('outputting.js', function () {
		outputTestFixtureToConsole(new testFixture(description, tests));
	});
}