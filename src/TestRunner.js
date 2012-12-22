JTF.namespaceAtRoot(function (JTF) {

	JTF.TEST_EVENT = {
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

	JTF.TestRunner = function (testFixtures) {
		this.run = function (testEventHandler) {

			if (!testFixtures) testFixtures = [];
			else if (!(testFixtures instanceof Array)) testFixtures = [testFixtures];

			testEventHandler.handle(JTF.TEST_EVENT.BATCH.START);

			for (var i = 0; i < testFixtures.length; i++) {
				var testFixture = testFixtures[i];

				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.START);

				var passes = 0, fails = 0;
				var desc = formatDesc(testFixture.getDescription());
				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.DESC, desc);

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
						testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.PASS, testName);
						passes++;
					}
					catch (e) {
						testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.FAIL, testName, formatMsg(e.message));
						fails++;
					}
				}

				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.STATS, passes, fails);
				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.FIXTURE_END);
			}

			testEventHandler.handle(JTF.TEST_EVENT.BATCH.END);

		}
	}

});