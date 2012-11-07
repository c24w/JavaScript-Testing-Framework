function outputTestFixtureToConsole(testFixture) {
	loadResources('console-output.js', 'formatting.js', function () {
		outputTestFixture(true, testFixture, getConsoleOutputter());
	});
}

function outputTestFixtureToHtml(testFixture) {
	loadResources('html-output.js', 'style.css', function () {
		outputTestFixture(true, testFixture, getHtmlOutputter());
	});
}

function formatMsg(msg) {
	return isUselessString(msg) ? 'no additional information' : msg;
}

function formatDesc(desc) {
	return isUselessString(desc) ? 'Test fixture' : desc;
}

function isUselessString(s) {
	return !s || s.isWhitespace();
}

function outputTestFixture(outputPasses, testFixture, outputter) {
	var desc = formatDesc(testFixture.getDescription());
	outputter.descOutputter(desc);
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			outputter.testOutputter(outputPasses, true, test);
		}
		catch (e) {
			outputter.testOutputter(outputPasses, false, test, formatMsg(e.message));
		}
	}
	outputter.terminatorOutputter();
}