function outputTestFixtureToConsole(testFixture) {
	loadResources('console-outputter.js', function () {
		outputTestFixture(true, testFixture, new ConsoleOutputter());
	});
}

function outputTestFixtureToHtml(testFixture) {
	loadResources('html-outputter.js', 'style.css', function () {
		outputTestFixture(true, testFixture, new HtmlOutputter());
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
	var passed = 0, failed = 0;
	var desc = formatDesc(testFixture.getDescription());
	outputter.descOutputter(desc);
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			outputter.testOutputter(outputPasses, true, test);
			passed++;
		}
		catch (e) {
			outputter.testOutputter(outputPasses, false, test, formatMsg(e.message));
			failed++;
		}
	}
	outputter.resultOutputter();
	outputter.terminatorOutputter();
}