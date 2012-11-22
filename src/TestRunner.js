(function (ctx) {

	ctx.EVENT = {
		FIXTURE: {
			START: 0,
			DESC: 1,
			PASS: 2,
			FAIL: 3,
			STATS: 4,
			END: 5
		},
		BATCH: {
			START: 7,
			END: 6
		}
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

			testEventHandler.handle(ctx.EVENT.FIXTURE.START);

			var passes = 0, fails = 0;
			var desc = formatDesc(testFixture.getDescription());
			testEventHandler.handle(ctx.EVENT.FIXTURE.DESC, desc);

			var tests = testFixture.getTests();

			if (tests.FIXTURE_SETUP) {
				tests.FIXTURE_SETUP();
				delete tests.FIXTURE_SETUP;
			}

			var testSetup = tests.TEST_SETUP;
			if (testSetup) delete tests.TEST_SETUP;

			for (var testName in tests) {
				if (testSetup) testSetup();
				try {
					var test = tests[testName];
					test();
					testEventHandler.handle(ctx.EVENT.FIXTURE.PASS, testName);
					passes++;
				}
				catch (e) {
					testEventHandler.handle(ctx.EVENT.FIXTURE.FAIL, testName, formatMsg(e.message));
					fails++;
				}
			}

			testEventHandler.handle(ctx.EVENT.FIXTURE.STATS, passes, fails);
			testEventHandler.handle(ctx.EVENT.FIXTURE.FIXTURE_END);

		}

	}

	ctx.Batch = function (testFixtures) {

		this.run = function (testEventHandler) {
			testEventHandler.handle(ctx.EVENT.BATCH.START);
			for (var f in testFixtures)
				new TestRunner(testFixtures[f]).run(testEventHandler);
			testEventHandler.handle(ctx.EVENT.BATCH.END);
		}

	}

	ctx.Single = function (testFixture) {

		this.run = function (testEventHandler) {
			testEventHandler.handle(ctx.EVENT.BATCH.START);
			new TestRunner(testFixture).run(testEventHandler);
			testEventHandler.handle(ctx.EVENT.BATCH.END);
		}

	}

})(window.JTF.TestRunner = window.JTF.TestRunner || {});