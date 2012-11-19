JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var MockTestFixture, MockTestHandler, trace;
		function addTrace(t) { trace[trace.length] = t }

		new TestRunner(new TestFixture('TestRunner tests', {

			FIXTURE_SETUP: function () {
				trace = [];

				MockTestFixture = new TestFixture('Mock test fixture', {
					FIXTURE_SETUP: function () { addTrace('FIXTURE_SETUP') },
					TEST_SETUP: function () { addTrace('TEST_SETUP') },
					'Passing test 1': function () { addTrace('Test 1'); JTF.Assert.true(true) },
					'Passing test 2': function () { addTrace('Test 2'); JTF.Assert.true(true) },
					'Passing test 3': function () { addTrace('Test 3'); JTF.Assert.true(true) },
					'Failing test 1': function () { addTrace('Test 4'); JTF.Assert.true(false) },
					'Failing test 2': function () { addTrace('Test 5'); JTF.Assert.true(false) },
					'Failing test 3': function () { addTrace('Test 6'); JTF.Assert.true(false) }
				});

				MockTestHandler = {
					receivedEvents: { start: false, end: false },
					receivedData: { desc: [], passedTests: [], failedTests: [], noPasses: [], noFails: [] },
					handle: function (handleType) {
						var args = Array.prototype.slice.call(arguments, 1);
						switch (handleType) {
							case TEST_RUNNER_EVENT.START:
								this.receivedEvents.start = true;
								break;
							case TEST_RUNNER_EVENT.DESC:
								this.receivedData.desc = args;
								break;
							case TEST_RUNNER_EVENT.PASS:
								var index = this.receivedData.passedTests.length;
								this.receivedData.passedTests[index] = args[0];
								break;
							case TEST_RUNNER_EVENT.FAIL:
								var index = this.receivedData.failedTests.length;
								this.receivedData.failedTests[index] = args[0];
								break;
							case TEST_RUNNER_EVENT.STATS:
								this.receivedData.noPasses = args[0];
								this.receivedData.noFails = args[1];
								break;
							case TEST_RUNNER_EVENT.END:
								this.receivedEvents.end = true;
								break;
						}
					}
				};

				new TestRunner(MockTestFixture).run(MockTestHandler);
			},

			'TestRunner should send test start event to the TestHandler': function () {
				JTF.Assert.true(MockTestHandler.receivedEvents.start, 'start was not called in TestHandler');
			},

			'TestRunner should send test description event and data to the TestHandler': function () {
				var fixtureName = 'Mock test fixture';
				var data = MockTestHandler.receivedData.desc;
				JTF.Assert.equal(data.length, 1);
				JTF.Assert.equal(data[0], fixtureName);
			},

			'TestRunner should send test pass event and data to the TestHandler': function () {
				var data = MockTestHandler.receivedData.passedTests;
				JTF.Assert.equal(data.length, 3);
				for (var i = 0; i < data.length;)
					JTF.Assert.equal(data[i], 'Passing test ' + (++i));
			},

			'TestRunner should send test fail event and data to the TestHandler': function () {
				var data = MockTestHandler.receivedData.failedTests;
				JTF.Assert.equal(data.length, 3);
				for (var i = 0; i < data.length;)
					JTF.Assert.equal(data[i], 'Failing test ' + (++i));
			},

			'TestRunner should send test stats event and data to the TestHandler': function () {
				JTF.Assert.equal(MockTestHandler.receivedData.noPasses, 3);
				JTF.Assert.equal(MockTestHandler.receivedData.noFails, 3);
			},

			'TestRunner should send end stats event and data to the TestHandler': function () {
				JTF.Assert.true(MockTestHandler.receivedEvents.end, 'end was not called in TestHandler');
			},

			'TestRunner should call FIXTURE_SETUP once before any tests are run': function () {
				JTF.Assert.equal(trace[0], 'FIXTURE_SETUP');
			},

			'TestRunner should call TEST_SETUP once before each test is run': function () {
				for (var i = 1; i < trace.length; i += 2)
					JTF.Assert.equal(trace[i], 'TEST_SETUP');
			}

		})).run(new HtmlTestHandler({ autocollapse: htmlTestHandlerConfig.autocollapse.none }));

	});
});