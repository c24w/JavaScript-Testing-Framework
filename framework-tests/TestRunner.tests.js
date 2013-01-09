JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestRunner = JTF.TestRunner, TestFixture = JTF.TestFixture, Assert = JTF.Assert, evt = JTF.EVENT;

		var MockTestFixture, MockTestHandler, trace;

		function addTrace(t) { trace[trace.length] = t }

		function dataLengthError(type) {
			return 'wrong amount of {0} data received'.format(type);
		}

		var fixtures = [

			new TestFixture('Happy path events tests', {

				FIXTURE_SETUP: function () {
					MockTestFixture = new TestFixture('Mock test fixture', {
						'Passing test 1': function () { JTF.Assert.true(true) },
						'Passing test 2': function () { JTF.Assert.true(true) },
						'Passing test 3': function () { JTF.Assert.true(true) },
						'Failing test 1': function () { JTF.Assert.true(false) },
						'Failing test 2': function () { JTF.Assert.true(false) },
						'Failing test 3': function () { JTF.Assert.true(false) }
					});

					MockTestHandler = {
						fixtureEvents: { start: false, end: false },
						receivedData: { desc: [], passedTestNames: [], failedTestsNames: [], failedTestsMsgs: [], noPasses: null, noFails: null },
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.FIXTURE.START:
									this.fixtureEvents.start = true;
									break;
								case evt.FIXTURE.DESC:
									this.receivedData.desc = args;
									break;
								case evt.TEST.PASS:
									var index = this.receivedData.passedTestNames.length;
									this.receivedData.passedTestNames[index] = args[0];
									break;
								case evt.TEST.FAIL:
									var index = this.receivedData.failedTestsNames.length;
									this.receivedData.failedTestsNames[index] = args[0];
									this.receivedData.failedTestsMsgs[index] = args[1];
									break;
								case evt.FIXTURE.STATS:
									this.receivedData.noPasses = args[0];
									this.receivedData.noFails = args[1];
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
					JTF.Assert.true(MockTestHandler.fixtureEvents.start, 'start event was not received/processed in TestHandler');
				},

				'Should send fixture description event and data to the TestHandler': function () {
					var fixtureName = 'Mock test fixture';
					var data = MockTestHandler.receivedData.desc;
					Assert.equal(data.length, 1, dataLengthError('description'));
					Assert.equal(data[0], fixtureName);
				},

				'Should send all test pass events and data to the TestHandler': function () {
					var data = MockTestHandler.receivedData.passedTestNames;
					Assert.equal(data.length, 3, dataLengthError('passed test'));
					for (var i = 0; i < data.length;)
						Assert.equal(data[i], 'Passing test ' + (++i));
				},

				'Should send all test fail events and data to the TestHandler': function () {
					var testNames = MockTestHandler.receivedData.failedTestsNames;
					var testMsgs = MockTestHandler.receivedData.failedTestsMsgs;
					Assert.equal(testNames.length, 3, dataLengthError('failed test names'));
					Assert.equal(testMsgs.length, 3, dataLengthError('failed test messages'));
					for (var i = 0; i < 3; i++) {
						Assert.equal(testNames[i], 'Failing test ' + (i + 1));
						Assert.equal(testMsgs[i], Assert.DEFAULT_FAIL_MESSAGE);
					}
				},

				'Should send fixture stats event and data to the TestHandler': function () {
					Assert.equal(MockTestHandler.receivedData.noPasses, 3, dataLengthError('number of passes'));
					Assert.equal(MockTestHandler.receivedData.noFails, 3, dataLengthError('number of fails'));
				},

				'Should send fixture end event to the TestHandler': function () {
					JTF.Assert.true(MockTestHandler.fixtureEvents.end, 'end event was not received/processed in TestHandler');
				}

			}),

			new TestFixture('Error events tests', {

				'Should send fixture setup error event and data to the TestHandler': function () {
					var errorHandled = false, expectedError = new Error('Fixture setup fail error message'), actualError;

					MockTestFixture = new TestFixture('', {
						FIXTURE_SETUP: function () { throw expectedError; },
					});
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.FIXTURE.ERROR:
									errorHandled = true;
									actualError = args[0];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.true(errorHandled);
					Assert.equal(actualError, expectedError);
				},

				'Should send test setup event and data to the TestHandler': function () {
					var errorHandled = false,
						expectedError = new Error('Test setup fail error message'),
						expectedTestName = 'Failing test name',
						actualTestName, actualError;

					var tests = { TEST_SETUP: function () { throw expectedError; } };
					tests[expectedTestName] = function () { };

					MockTestFixture = new TestFixture('', tests);
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.TEST.SETUP.ERROR:
									errorHandled = true;
									actualTestName = args[0];
									actualError = args[1];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.true(errorHandled);
					Assert.equal(actualTestName, expectedTestName);
					Assert.equal(actualError, expectedError);
				},

				'Should send test error event and data to the TestHandler': function () {
					var errorHandled = false,
						expectedError = new Error('Test fail error message'),
						expectedTestName = 'Failing test name',
						actualTestName, actualError;

					tests[expectedTestName] = function () { throw expectedError; };

					MockTestFixture = new TestFixture('', tests);
					var handler = {
						handle: function (event) {
							var args = Array.prototype.slice.call(arguments, 1);
							switch (event) {
								case evt.TEST.ERROR:
									errorHandled = true;
									actualTestName = args[0];
									actualError = args[1];
							}
						}
					};
					new TestRunner(MockTestFixture).run(handler);

					Assert.true(errorHandled);
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