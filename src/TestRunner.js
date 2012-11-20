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

	function SingleTestRunner(testFixture) {

		this.run = function (testEventHandler) {

			testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.START);

			var passes = 0, fails = 0;
			var desc = formatDesc(testFixture.getDescription());
			testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.DESC, desc);

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
						testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.PASS, testName);
						passes++;
					}
				}
				catch (e) {
					testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.FAIL, testName, formatMsg(e.message));
					fails++;
				}
			}

			testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.STATS, passes, fails);
			testEventHandler.handle(ctx.TestRunner.EVENT.FIXTURE.FIXTURE_END);

		}

	}

	ctx.BatchTestRunner = function (testFixtures) {

		this.run = function (testEventHandler) {
			for (var f in testFixtures)
				new SingleTestRunner(testFixtures[f]).run(testEventHandler);
			testEventHandler.handle(ctx.TestRunner.EVENT.BATCH.END);
		}

	}

	ctx.TestRunner = function (testFixtures) {

		this.run = function (testEventHandler) {
			new SingleTestRunner(testFixtures).run(testEventHandler);
			testEventHandler.handle(ctx.TestRunner.EVENT.BATCH.END);
		}

	}

	ctx.TestRunner.EVENT = {
		FIXTURE: {
			START: 0,
			DESC: 1,
			PASS: 2,
			FAIL: 3,
			STATS: 4,
			END: 5
		},
		BATCH: {
			END: 6
		}
	}

})(window.JTF = window.JTF || {});