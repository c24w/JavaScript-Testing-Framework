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

			var sendEvent = function () { testEventHandler.handle.apply(testEventHandler, arguments); };
			sendEvent(evt.BATCH.START);

			for (var i = 0; i < testFixtures.length; i++) {
				var testFixture = testFixtures[i];

				sendEvent(evt.FIXTURE.START);

				var passes = 0, fails = 0, testErrors = 0;
				var desc = formatDesc(testFixture.getDescription());
				sendEvent(evt.FIXTURE.DESC, desc);

				var tests = testFixture.getTests();

				if (tests.FIXTURE_SETUP) {
					try {
						tests.FIXTURE_SETUP();
					}
					catch (e) {
						sendEvent(evt.FIXTURE.ERROR, e);
					}
					delete tests.FIXTURE_SETUP;
				}

				var testSetup = tests.TEST_SETUP;
				if (testSetup) delete tests.TEST_SETUP;

				for (var testName in tests) {
					runSetup(testSetup, sendEvent, testName);
					try {
						tests[testName](JTF.TestCase);
						sendEvent(evt.TEST.PASS, testName);
						passes++;
					}
					catch (e) {
						if (e instanceof JTF.Assert.AssertException) {
							sendEvent(evt.TEST.FAIL, testName, formatMsg(e.message));
							fails++;
						}
						else {
							sendEvent(evt.TEST.ERROR, testName, e);
							testErrors++;
						}
					}
				}
				sendEvent(evt.FIXTURE.STATS, passes, fails, testErrors);
				sendEvent(evt.FIXTURE.END);
			}

			sendEvent(evt.BATCH.END);

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