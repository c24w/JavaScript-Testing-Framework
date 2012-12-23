JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestRunner = JTF.TestRunner;
		var TestFixture = JTF.TestFixture;
		var Assert = JTF.Assert;

		var MockTestFixture, MockTestHandler, trace;
		function addTrace(t) { trace[trace.length] = t }

		function dataLengthError(type) {
			return 'wrong amount of {0} data received'.format(type);
		}

		var fixture = new TestFixture('TestRunner tests', {

			FIXTURE_SETUP: function () {
				trace = [];
				MockTestFixture = new TestFixture('Mock test fixture', {
					FIXTURE_SETUP: function () { addTrace('FIXTURE_SETUP') },
					TEST_SETUP: function () { addTrace('TEST_SETUP'); },
					'Passing test 1': function () { addTrace('Test 1'); JTF.Assert.true(true) },
					'Passing test 2': function () { addTrace('Test 2'); JTF.Assert.true(true) },
					'Passing test 3': function () { addTrace('Test 3'); JTF.Assert.true(true) },
					'Failing test 1': function () { addTrace('Test 4'); JTF.Assert.true(false) },
					'Failing test 2': function () { addTrace('Test 5'); JTF.Assert.true(false) },
					'Failing test 3': function () { addTrace('Test 6'); JTF.Assert.true(false) }
				});

				MockTestHandler = {
					receivedEvents: { start: false, end: false },
					receivedData: { desc: [], passedTestNames: [], failedTestsNames: [], failedTestsMsgs: [], noPasses: null, noFails: null },
					handle: function (handleType) {
						var args = Array.prototype.slice.call(arguments, 1);
						switch (handleType) {
							case JTF.TEST_EVENT.FIXTURE.START:
								this.receivedEvents.start = true;
								break;
							case JTF.TEST_EVENT.FIXTURE.DESC:
								this.receivedData.desc = args;
								break;
							case JTF.TEST_EVENT.TEST.PASS:
								var index = this.receivedData.passedTestNames.length;
								this.receivedData.passedTestNames[index] = args[0];
								break;
							case JTF.TEST_EVENT.TEST.FAIL:
								var index = this.receivedData.failedTestsNames.length;
								this.receivedData.failedTestsNames[index] = args[0];
								this.receivedData.failedTestsMsgs[index] = args[1];
								break;
							case JTF.TEST_EVENT.FIXTURE.STATS:
								this.receivedData.noPasses = args[0];
								this.receivedData.noFails = args[1];
								break;
							case JTF.TEST_EVENT.FIXTURE.FIXTURE_END:
								this.receivedEvents.end = true;
								break;
						}
					}
				};

				new TestRunner(MockTestFixture).run(MockTestHandler);
			},

			'TestRunner should send start event to the TestHandler': function () {
				JTF.Assert.true(MockTestHandler.receivedEvents.start, 'start event was not received/processed in TestHandler');
			},

			'TestRunner should send description event and data to the TestHandler': function () {
				var fixtureName = 'Mock test fixture';
				var data = MockTestHandler.receivedData.desc;
				Assert.equal(data.length, 1, dataLengthError('description'));
				Assert.equal(data[0], fixtureName);
			},

			'TestRunner should send pass events and data to the TestHandler': function () {
				var data = MockTestHandler.receivedData.passedTestNames;
				Assert.equal(data.length, 3, dataLengthError('passed test'));
				for (var i = 0; i < data.length;)
					Assert.equal(data[i], 'Passing test ' + (++i));
			},

			'TestRunner should send test fail events and data to the TestHandler': function () {
				var testNames = MockTestHandler.receivedData.failedTestsNames;
				var testMsgs = MockTestHandler.receivedData.failedTestsMsgs;
				Assert.equal(testNames.length, 3, dataLengthError('failed test names'));
				Assert.equal(testMsgs.length, 3, dataLengthError('failed test messages'));
				for (var i = 0; i < 3; i++) {
					Assert.equal(testNames[i], 'Failing test ' + (i + 1));
					Assert.equal(testMsgs[i], Assert.DEFAULT_FAIL_MESSAGE);
				}
			},

			'TestRunner should send stats event and data to the TestHandler': function () {
				Assert.equal(MockTestHandler.receivedData.noPasses, 3, dataLengthError('number of passes'));
				Assert.equal(MockTestHandler.receivedData.noFails, 3, dataLengthError('number of fails'));
			},

			'TestRunner should send end event and data to the TestHandler': function () {
				Assert.true(MockTestHandler.receivedEvents.end, 'end event was not received/processed in TestHandler');
			},

			'TestRunner should call FIXTURE_SETUP once before any tests are run': function () {
				Assert.equal(trace[0], 'FIXTURE_SETUP');
				for (var i = 1; i < trace.length; i++)
					Assert.not.equal(trace[i], 'FIXTURE_SETUP');
			},

			'TestRunner should call TEST_SETUP once before each test is run': function () {
				for (var i = 0; i < trace.length; i++) {
					if (i % 2 !== 0) Assert.equal(trace[i], 'TEST_SETUP');
					else Assert.not.equal(trace[i], 'TEST_SETUP'); // breaking because .addSetup break sequence?
				}
			}

		});

		var handler = new JTF.HTML.TestHandler({
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPassedFixtures: true,
			notifyOnFail: false,
			runInterval: 10000
		});

		new TestRunner(fixture).run(handler);

	});
});