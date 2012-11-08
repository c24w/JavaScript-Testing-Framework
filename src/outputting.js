var TEST_RUNNER_EVENT = {
	START: 1,
	DESC: 2,
	PASS: 3,
	FAIL: 4,
	STATS: 5,
	END: 6,
}

function outputTestFixtureToConsole(testFixture) {
	loadResources('console-test-handler.js', function () {
		outputTestFixture(true, testFixture, new ConsoleOutputter());
	});
}

function outputTestFixtureToHtml(testFixture) {
	loadResources('html-test-handler.js', 'style.css', function () {
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

function TestRunner(testFixture) {

	this.run = function (testEventHandler) {

		testEventHandler.handle(TEST_RUNNER_EVENT.START);

		var passes = 0, fails = 0;
		var desc = formatDesc(testFixture.getDescription());
		testEventHandler.handle(TEST_RUNNER_EVENT.DESC, desc);

		var tests = testFixture.getTests();
		for (var test in tests) {
			try {
				tests[test]();
				testEventHandler.handle(TEST_RUNNER_EVENT.PASS, test);
				passes++;
			}
			catch (e) {
				testEventHandler.handle(TEST_RUNNER_EVENT.FAIL, test, formatMsg(e.message));
				fails++;
			}
		}

		testEventHandler.handle(TEST_RUNNER_EVENT.STATS, passes, fails);
		testEventHandler.handle(TEST_RUNNER_EVENT.END);

	}

}