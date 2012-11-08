function TestFixture(description, tests) {
	this.getDescription = function () { return description }
	this.getTests = function () { return tests }
}
/*
function AutoRunTestFixture(description, outputter, tests) {
	loadResource('outputting.js', function () {
		outputTestFixture(new TestFixture(description, tests), outputter);
	});
}

function AutoRunTestFixtureToHtml(description, tests) {
	loadResource('outputting.js', function () {
		outputTestFixtureToHtml(new TestFixture(description, tests));
	});
}

function AutoRunTestFixtureToConsole(description, tests) {
	loadResource('outputting.js', function () {
		outputTestFixtureToConsole(new TestFixture(description, tests));
	});
}*/