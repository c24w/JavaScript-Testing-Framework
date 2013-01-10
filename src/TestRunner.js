JTF.namespaceAtRoot(function (JTF) {

	var evt = JTF.EVENT = Object.freeze({
		FIXTURE: {
			START: 0,
			DESC: 1,
			STATS: 2,
			END: 3,
			ERROR: 4
		},
		TEST: {
			PASS: 5,
			FAIL: 6,
			ERROR: 7,
			SETUP: {
				ERROR: 8
			}
		},
		BATCH: {
			START: 9,
			END: 10
		}
	});

	function formatMsg(msg) {
		return isUselessString(msg) ? 'no additional information' : msg;
	}

	function formatDesc(desc) {
		return isUselessString(desc) ? 'Test fixture' : desc;
	}

	function isUselessString(s) {
		return !s || s.isWhitespace();
	}

	JTF.runToHtml = function (testFixtures, config) {
		new JTF.TestRunner(testFixtures).run(new JTF.HTML.TestHandler(config));
	};

	JTF.TestRunner = function (testFixtures) {
		this.run = function (testEventHandler) {

			if (!testFixtures) testFixtures = [];
			else if (!(testFixtures instanceof Array)) testFixtures = [testFixtures];

			var sendEvent = testEventHandler.handle;

			sendEvent(evt.BATCH.START);

			for (var i = 0; i < testFixtures.length; i++) {
				var testFixture = testFixtures[i];

				testEventHandler.handle(evt.FIXTURE.START);

				var passes = 0, fails = 0;
				var desc = formatDesc(testFixture.getDescription());
				testEventHandler.handle(evt.FIXTURE.DESC, desc);

				var tests = testFixture.getTests();

				if (tests.FIXTURE_SETUP) {
					try {
						tests.FIXTURE_SETUP();
					}
					catch (e) {
						testEventHandler.handle(evt.FIXTURE.ERROR, e);
					}
					delete tests.FIXTURE_SETUP;
				}

				var testSetup = tests.TEST_SETUP;
				if (testSetup) delete tests.TEST_SETUP;

				for (var testName in tests) {
					runSetup(testSetup, sendEvent, testName);
					try {
						tests[testName](JTF.TestCase);
						testEventHandler.handle(evt.TEST.PASS, testName);
						passes++;
					}
					catch (e) {
						if (e instanceof JTF.Assert.AssertException) {
							testEventHandler.handle(evt.TEST.FAIL, testName, formatMsg(e.message));
							fails++;
						}
						else testEventHandler.handle(evt.TEST.ERROR, testName, e);
					}
				}

				testEventHandler.handle(evt.FIXTURE.STATS, passes, fails);
				testEventHandler.handle(evt.FIXTURE.END);
			}

			testEventHandler.handle(evt.BATCH.END);

		};
	};

	function runSetup(setup, sendEvent, testName) {
		try {
			if (setup) setup();
		}
		catch (e) {
			sendEvent(evt.TEST.SETUP.ERROR, testName, e);
		}
	}

});