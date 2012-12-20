JTF.namespace('TestRunner', function (TestRunner) {

	TestRunner.EVENT = {
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
	};

	function formatMsg(msg) {
		return isUselessString(msg) ? 'no additional information' : msg;
	}

	function formatDesc(desc) {
		return isUselessString(desc) ? 'Test fixture' : desc;
	}

	function isUselessString(s) {
		return !s || s.isWhitespace();
	}

	function TestCase() {
		var cases = [];
		this.add = function () { cases[cases.length] = arguments };
		this.hasCases = function () { return cases.length > 0 };
		this.getCases = function () { return cases };
	}

	function TestFixtureRunner(testFixture) {

		this.run = function (testEventHandler) {

			testEventHandler.handle(TestRunner.EVENT.FIXTURE.START);

			var passes = 0, fails = 0;
			var desc = formatDesc(testFixture.getDescription());
			testEventHandler.handle(TestRunner.EVENT.FIXTURE.DESC, desc);

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
					tests[testName](JTF.TestCase);
					testEventHandler.handle(TestRunner.EVENT.FIXTURE.PASS, testName);
					passes++;
				}
				catch (e) {
					testEventHandler.handle(TestRunner.EVENT.FIXTURE.FAIL, testName, formatMsg(e.message));
					fails++;
				}
			}

			testEventHandler.handle(TestRunner.EVENT.FIXTURE.STATS, passes, fails);
			testEventHandler.handle(TestRunner.EVENT.FIXTURE.FIXTURE_END);

		}

	}

	TestRunner.Batch = function (testFixtures) {

		this.run = function (testEventHandler) {
			testEventHandler.handle(TestRunner.EVENT.BATCH.START);
			for (var f in testFixtures)
				new TestFixtureRunner(testFixtures[f]).run(testEventHandler);
			testEventHandler.handle(TestRunner.EVENT.BATCH.END);
		}

	}

	TestRunner.Single = function (testFixture) {

		this.run = function (testEventHandler) {
			testEventHandler.handle(TestRunner.EVENT.BATCH.START);
			new TestFixtureRunner(testFixture).run(testEventHandler);
			testEventHandler.handle(TestRunner.EVENT.BATCH.END);
		}

	}

});