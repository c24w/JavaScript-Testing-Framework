JTF.namespaceAtRoot(function (JTF) {

	JTF.TEST_EVENT = {
		FIXTURE: {
			START: 0,
			DESC: 1,
			STATS: 2,
			END: 3
		},
		TEST: {
			PASS: 4,
			FAIL: 5
		},
		BATCH: {
			START: 6,
			END: 7
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

	JTF.runToHtml = function (testFixtures, config) {
		new JTF.TestRunner(testFixtures).run(new JTF.HTML.TestHandler(config));
	};

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
						//if (testName != 'TEST_SETUP') { // comment line 61 (delete TEST_SETUP) if uncomment this
							tests[testName](JTF.TestCase);
							testEventHandler.handle(JTF.TEST_EVENT.TEST.PASS, testName);
							passes++;
						//}
					}
					catch (e) {
						testEventHandler.handle(JTF.TEST_EVENT.TEST.FAIL, testName, formatMsg(e.message));
						fails++;
					}
				}

				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.STATS, passes, fails);
				testEventHandler.handle(JTF.TEST_EVENT.FIXTURE.FIXTURE_END);
			}

			testEventHandler.handle(JTF.TEST_EVENT.BATCH.END);

		};
	};

});