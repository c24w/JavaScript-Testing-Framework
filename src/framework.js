function testFixture(description, tests) {
	this.getDescription = function () { return description }
	this.getTests = function () { return tests }
	this.outputTo = function (testOutputter) {
		outputTestFixture(this, testOutputter);
	}
	this.outputToConsole = function () {
		var instance = this;
		loadResource('outputting.js', function () {
			instance.outputTo(testOutputters.console);
		});
	}
	this.outputToHtml = function () {
		var instance = this;
		loadResource('outputting.js', function () {
			instance.outputTo(testOutputters.html);
		});
	}
}

function autoRunTestFixture(description, outputter, tests) {
	new testFixture(description, tests).outputTo(outputter);
}

function autoRunTestFixtureToHtml(description, tests) {
	new testFixture(description, tests).outputToHtml();
}

function autoRunTestFixtureToConsole(description, tests) {
	new testFixture(description, tests).outputToConsole();
}