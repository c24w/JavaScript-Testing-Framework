function outputTestFixtureToConsole(testFixture) {
	loadResources('console-output.js', 'formatting.js', function () {
		outputTestFixture(true, testFixture, consoleDescWriter, consoleTestWriter, consoleTerminatorWriter);
	});
}

function outputTestFixtureToHtml(testFixture) {
	loadResources('html-output.js', 'style.css', function () {
		outputTestFixture(true, testFixture, htmlDescWriter, htmlTestWriter, htmlTerminatorWriter);
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

function outputTestFixture(outputPasses, testFixture, descOutputter, testOutputter, terminatorOutputter) {
	var desc = formatDesc(testFixture.getDescription());
	descOutputter(desc);
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			testOutputter(outputPasses, true, test);
		}
		catch (e) {
			testOutputter(outputPasses, false, test, formatMsg(e.message));
		}
	}
	if (terminatorOutputter)
		terminatorOutputter();
}