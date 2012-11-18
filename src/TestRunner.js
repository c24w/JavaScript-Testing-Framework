var TEST_RUNNER_EVENT = {
	START: 1,
	DESC: 2,
	PASS: 3,
	FAIL: 4,
	STATS: 5,
	END: 6,
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

		var fixtureSetup = tests.FIXTURE_SETUP;
		var testSetup = tests.TEST_SETUP;

		if (fixtureSetup) {
			fixtureSetup();
			delete tests.FIXTURE_SETUP;
		}

		for (var testName in tests) {
			try {
				if (testName !== 'TEST_SETUP') {
					if (testSetup) testSetup();
					var test = tests[testName];
					test();
					testEventHandler.handle(TEST_RUNNER_EVENT.PASS, testName);
					passes++;
				}
			}
			catch (e) {
				testEventHandler.handle(TEST_RUNNER_EVENT.FAIL, testName, formatMsg(e.message));
				fails++;
			}
		}

		testEventHandler.handle(TEST_RUNNER_EVENT.STATS, passes, fails);
		testEventHandler.handle(TEST_RUNNER_EVENT.END);

	}

}

function BatchTestRunner(testFixtures) {

	this.run = function (testEventHandler) {
		for (var fixture in testFixtures)
			new TestRunner(testFixtures[fixture]).run(testEventHandler);
	}

}