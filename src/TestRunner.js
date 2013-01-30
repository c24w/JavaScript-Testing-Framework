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
			var sendEvent = function () { testEventHandler.handle.apply(testEventHandler, arguments); };

			function handleTestSetupError(e) { sendEvent(evt.TEST.SETUP.ERROR, testName, e); }

			function handleTestPass(event, testName) {
				sendEvent(event, testName);
				passes++;
			}

			function handleTestFail(failEvent, testName, failMessage) {
				sendEvent(failEvent, testName, formatMsg(failMessage));
				fails++;
			}

			function handleTestError(errorEvent, testName, e) {
				sendEvent(errorEvent, testName, e);
				testErrors++;
			}

			if (!testFixtures) testFixtures = [];
			else if (!(testFixtures instanceof Array)) testFixtures = [testFixtures];

			sendEvent(evt.BATCH.START);

			for (var i = 0; i < testFixtures.length; i++) {

				sendEvent(evt.FIXTURE.START);

				var testFixture = testFixtures[i];
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
					if (tests.hasOwnProperty(testName)) {
						runSetup(testSetup, handleTestSetupError);
						new SingleTestRunner(tests, testName)
							.pass(handleTestPass)
							.fail(handleTestFail)
							.error(handleTestError);
					}

				}
				sendEvent(evt.FIXTURE.STATS, passes, fails, testErrors);
				sendEvent(evt.FIXTURE.END);
			}

			sendEvent(evt.BATCH.END);

		};
	};

	(function (c24w) {

		function TryCatch(tryBlock) {
			var actual, errorHandled;
			try {
				tryBlock();
			}
			catch (e) {
				actual = e;
			}
			this['catch'] = function (expected, callback) {
				if (errorWasCaught() && !errorHandled) {
					if (isUndefined(callback)) {
						callback = expected;
						expected = undefined;
					}
					if (isUndefined(expected) || caughtErrorIsType(expected)) {
						callback(actual);
						errorHandled = true;
					}
				}
				return this;
			};
			this['finally'] = function (callback) {
				if(callback) callback();
				if (errorWasCaught() && !errorHandled) throw actual;
			};
			function isUndefined(subject) { return typeof subject === 'undefined'; }
			function errorWasCaught() { return !isUndefined(actual); }
			function caughtErrorIsType(expected) {
				return actual instanceof expected
					|| actual.constructor.name === expected.name;
			}
		}

		c24w['try'] = function (tryBlock) {
			return new TryCatch(tryBlock);
		};

	})(window.c24w = window.c24w || {});

	function SingleTestRunner(tests, testName) {
		var test = tests[testName];
		var result, resultCallback, resultData = [];
		var pass = evt.TEST.PASS, fail = evt.TEST.FAIL, error = evt.TEST.ERROR;

		c24w.try(function () {
			if(test.length !== 0) test(JTF.TestCase);
			else test();
			result = pass;
		})
		.catch(JTF.Assert.AssertException, function (e) {
			result = fail;
			resultData = e.message;
		})
		.catch(function (e) {
			result = error;
			resultData = e;
		});

		this.pass = function (callback) {
			ifResultUseCallback(pass, callback);
			return this;
		};
		this.fail = function (callback) {
			ifResultUseCallback(fail, callback);
			return this;
		};
		this.error = function (callback) {
			ifResultUseCallback(error, callback);
			return this;
		};
		function ifResultUseCallback(expectedResult, callback) {
			if (result === expectedResult) {
				callback.apply(callback, [result, testName, resultData]);
			}
		}
	}

	function runSetup(setup, errorCallback) {
		try {
			if (setup) setup();
		}
		catch (e) {
			errorCallback(e);
		}
	}

});