(function (ctx) {

	function formatMsg(msg) {
		return isUselessString(msg) ? 'no additional information' : msg;
	}

	function formatDesc(desc) {
		return isUselessString(desc) ? 'Test fixture' : desc;
	}

	function isUselessString(s) {
		return !s || s.isWhitespace();
	}

	ctx.TestRunner = function (testFixture) {

		this.run = function (testEventHandler) {

			testEventHandler.handle(ctx.TestRunner.EVENT.START);

			var passes = 0, fails = 0;
			var desc = formatDesc(testFixture.getDescription());
			testEventHandler.handle(ctx.TestRunner.EVENT.DESC, desc);

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
						testEventHandler.handle(ctx.TestRunner.EVENT.PASS, testName);
						passes++;
					}
				}
				catch (e) {
					testEventHandler.handle(ctx.TestRunner.EVENT.FAIL, testName, formatMsg(e.message));
					fails++;
				}
			}

			testEventHandler.handle(ctx.TestRunner.EVENT.STATS, passes, fails);
			testEventHandler.handle(ctx.TestRunner.EVENT.END);

		}

	}

	ctx.TestRunner.EVENT = {
		START: 1,
		DESC: 2,
		PASS: 3,
		FAIL: 4,
		STATS: 5,
		END: 6,
	}

	ctx.BatchTestRunner = function (testFixtures) {

		this.run = function (testEventHandler) {
			for (var f in testFixtures)
				new ctx.TestRunner(testFixtures[f]).run(testEventHandler);
		}

	}

})(window.JTF = window.JTF || {});