JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestRunner = JTF.TestRunner, TestFixture = JTF.TestFixture, Assert = JTF.Assert, evt = JTF.EVENT;

		var MockTestFixture, MockTestHandler, trace;

		function addTrace(t) { trace[trace.length] = t }

		function assertDataLength(desc, act, exp) {
			Assert.equal(act, exp, '{0} - expected: {2}, found: {1}'.format(desc, act, exp));
		}

		var fixtures = [

			new TestFixture('Happy path events tests', {

				FIXTURE_SETUP: function () {
					MockTestFixture = new TestFixture('Mock test fixture', {
						'Passing test 1': function () { JTF.Assert.true(true); },
						'Passing test 2': function () { JTF.Assert.true(true); },
						'Passing test 3': function () { JTF.Assert.true(true); },
						'Failing test 1': function () { JTF.Assert.true(false); },
						'Failing test 2': function () { JTF.Assert.true(false); },
						'Failing test 3': function () { JTF.Assert.true(false); },
						'Erroneous test 1': function () { throw new Error('failing test 1'); },
						'Erroneous test 2': function () { throw new Error('failing test 2'); }
					});

					MockTestHandler = {
						fixtureEvents: { start: false, end: false },
						receivedData: { desc: null, passedTestNames: [], failedTestsNames: [], failedTestsMsgs: [], erroneousTestsNames: [], erroneousTestsErrors: [], numPasses: null, numFails: null, numTestErrors: null },
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							var recData = this.receivedData;
							switch (event) {
								case evt.FIXTURE.START:
									this.fixtureEvents.start = true;
									break;
								case evt.FIXTURE.DESC:
									recData.desc = args[0];
									break;
								case evt.TEST.PASS: 
									var passedTests = recData.passedTestNames;
									var index = passedTests.length;
									passedTests[index] = args[0];
									break;
								case evt.TEST.FAIL:
									var failedTests = recData.failedTestsNames;
									var index = failedTests.length;
									failedTests[index] = args[0];
									recData.failedTestsMsgs[index] = args[1];
									break;
								case evt.TEST.ERROR:
									var errorTestNames = recData.erroneousTestsNames;
									var index = errorTestNames.length;
									errorTestNames[index] = args[0];
									recData.erroneousTestsErrors[index] = args[1];
									break;
								case evt.FIXTURE.STATS:
									recData.numPasses = args[0];
									recData.numFails = args[1];
									recData.numTestErrors = args[2];
									break;
								case evt.FIXTURE.END:
									this.fixtureEvents.end = true;
									break;
							}
						}
					};

					new TestRunner(MockTestFixture).run(MockTestHandler);
				},

				'Should send fixture start event to the TestHandler': function () {
					Assert.true(MockTestHandler.fixtureEvents.start, 'start event was not received/processed in TestHandler');
				},

				'Should send fixture description event and data to the TestHandler': function () {
					Assert.equal(MockTestHandler.receivedData.desc, 'Mock test fixture');
				},

				'Should send all test pass events and data to the TestHandler': function () {
					var data = MockTestHandler.receivedData.passedTestNames;
					assertDataLength('number of passed tests', data.length, 3);
					for (var i = 0; i < data.length;)
						Assert.equal(data[i], 'Passing test ' + (++i));
				},

				'Should send all test fail events and data to the TestHandler': function () {
					var testNames = MockTestHandler.receivedData.failedTestsNames;
					var testMsgs = MockTestHandler.receivedData.failedTestsMsgs;
					assertDataLength('number of failed test names', testNames.length, 3);
					assertDataLength('number of failed test messages', testMsgs.length, 3);
					for (var i = 0; i < 3; i++) {
						Assert.equal(testNames[i], 'Failing test ' + (i + 1));
						Assert.equal(testMsgs[i], Assert.DEFAULT_FAIL_MESSAGE);
					}
				},

				'Should send fixture stats event and data to the TestHandler': function () {
					assertDataLength('number of passes', MockTestHandler.receivedData.numPasses, 3);
					assertDataLength('number of fails', MockTestHandler.receivedData.numFails, 3);
					assertDataLength('number of test errors', MockTestHandler.receivedData.numTestErrors, 2);
				},

				'Should send fixture end event to the TestHandler': function () {
					Assert.true(MockTestHandler.fixtureEvents.end, 'end event was not received/processed in TestHandler');
				}

			}),

			new TestFixture('Error events tests', {

				'Should send fixture setup error event and data to the TestHandler': function () {
					var expectedError = new Error('Fixture setup fail error message'), actualError;

					MockTestFixture = new TestFixture('', {
						FIXTURE_SETUP: function () { throw expectedError; },
					});
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.FIXTURE.ERROR:
									actualError = args[0];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.equal(actualError, expectedError);
				},

				'Should send test setup error event and data to the TestHandler': function () {
					var expectedError = new Error('Test setup fail error message'),
						expectedTestName = 'Test preceded by setup',
						actualTestName, actualError;

					var tests = { TEST_SETUP: function () { throw expectedError; } };
					tests[expectedTestName] = function () { };

					MockTestFixture = new TestFixture('', tests);
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.TEST.SETUP.ERROR:
									actualTestName = args[0];
									actualError = args[1];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.equal(actualTestName, expectedTestName);
					Assert.equal(actualError, expectedError);
				},

				'Should send test error event and data to the TestHandler': function () {
					var expectedError = new Error('Test fail error message'),
						expectedTestName = 'Failing test name',
						actualTestName, actualError;

					var tests = {};
					tests[expectedTestName] = function () { throw expectedError; };

					MockTestFixture = new TestFixture('', tests);
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.TEST.ERROR:
									actualTestName = args[0];
									actualError = args[1];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.equal(actualTestName, expectedTestName);
					Assert.equal(actualError, expectedError);
				}

			}),

			new TestFixture('Sequence tests', {

				FIXTURE_SETUP: function () {
					trace = [];
					MockTestFixture = new TestFixture('Mock test fixture', {
						FIXTURE_SETUP: function () { addTrace('FIXTURE_SETUP') },
						TEST_SETUP: function () { addTrace('TEST_SETUP'); },
						'Test 1': function () { addTrace('Test 1'); },
						'Test 2': function () { addTrace('Test 2'); },
						'Test 3': function () { addTrace('Test 3'); },
						/*	'Test case': function (TestCase) {
								TestCase(addTrace)
								.addCase('Test case 1')
								.addCase('Test case 2');
							}*/
					});

					new TestRunner(MockTestFixture).run({ handle: function () { } });
				},

				'Should execute fixture setup before anything else in the fixture': function () {
					Assert.equal(trace[0], 'FIXTURE_SETUP');
					for (var i = 1; i < trace.length; i++)
						Assert.not.equal(trace[i], 'FIXTURE_SETUP');
				},

				'Should execute test setup once before each test in the fixture': function () {
					for (var i = 0; i < trace.length; i++) {
						if (i % 2 !== 0) Assert.equal(trace[i], 'TEST_SETUP');
						else Assert.not.equal(trace[i], 'TEST_SETUP');
					}
				},

				/*	'Should execute test setup once before each case in a test case': function () {console.log(trace)
						//for (var i = trace.length - ; i < trace.length; i++) {
							Assert.equal(trace[trace.length - 1], 'Test case');
					}*/

			})

		];



		var config = {
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPassedFixtures: true,
			notifyOnFail: false,
			runInterval: 10000
		};

		JTF.runToHtml(fixtures, config);

	});
});