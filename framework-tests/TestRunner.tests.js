JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestRunner = JTF.TestRunner, TestFixture = JTF.TestFixture, Assert = JTF.Assert;

		var MockTestFixture, MockTestHandler, trace;

		function addTrace(t) { trace[trace.length] = t }

		function dataLengthError(type) {
			return 'wrong amount of {0} data received'.format(type);
		}

		var fixtures = [

			new TestFixture('Events tests', {

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
						handle: function (handleType) {
							var args = Array.prototype.slice.call(arguments, 1);
							var evt = JTF.TEST_EVENT;
							switch (handleType) {
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

			new TestFixture('Sequence tests', {

				FIXTURE_SETUP: function () {
					trace = [];
					MockTestFixture = new TestFixture('Mock test fixture', {
						FIXTURE_SETUP: function () { addTrace('FIXTURE_SETUP') },
						TEST_SETUP: function () { addTrace('TEST_SETUP'); },
						'Test 1': function () { addTrace('Test 1'); },
						'Test 2': function () { addTrace('Test 2'); },
						'Test 3': function () { addTrace('Test 3'); }
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

				'Should execute test setup once before each case in a test case': function () {

				}

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