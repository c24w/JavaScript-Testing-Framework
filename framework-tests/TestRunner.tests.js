loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	var MockTestHandler = function () {
		this.receivedEvents = {
			start: false, end: false
		}
		this.receivedData = {
			desc: [], passedTests: [], failedTests: [], noPasses: [], noFails: []
		}
		this.handle = function (handleType) {
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
	}

	var mockTestHandler = new MockTestHandler();
	var trace = [];
	function addTrace(t) { trace[trace.length] = t }

	new TestRunner(
		new TestFixture('Mock test fixture', {
			FIXTURE_SETUP: function () { addTrace('FIXTURE_SETUP') },
			TEST_SETUP: function () { addTrace('TEST_SETUP') },
			'Passing test 1': function () { addTrace('Test 1'); assert.true(true) },
			'Passing test 2': function () { addTrace('Test 2'); assert.true(true) },
			'Passing test 3': function () { addTrace('Test 3'); assert.true(true) },
			'Failing test 1': function () { addTrace('Test 4'); assert.true(false) },
			'Failing test 2': function () { addTrace('Test 5'); assert.true(false) },
			'Failing test 3': function () { addTrace('Test 6'); assert.true(false) }
		})
		)
		.run(mockTestHandler);

	new TestRunner(new TestFixture('TestRunner tests', {

		'TestRunner should send test start event to the TestHandler': function () {
			assert.true(mockTestHandler.receivedEvents.start, 'start was not called in TestHandler');
		},

		'TestRunner should send test description event and data to the TestHandler': function () {
			var fixtureName = 'Mock test fixture';
			var data = mockTestHandler.receivedData.desc;
			assert.equal(data.length, 1);
			assert.equal(data[0], fixtureName);
		},

		'TestRunner should send test pass event and data to the TestHandler': function () {
			var data = mockTestHandler.receivedData.passedTests;
			assert.equal(data.length, 3);
			for (var i = 0; i < data.length;)
				assert.equal(data[i], 'Passing test ' + (++i));
		},

		'TestRunner should send test fail event and data to the TestHandler': function () {
			var data = mockTestHandler.receivedData.failedTests;
			assert.equal(data.length, 3);
			for (var i = 0; i < data.length;)
				assert.equal(data[i], 'Failing test ' + (++i));
		},

		'TestRunner should send test stats event and data to the TestHandler': function () {
			assert.equal(mockTestHandler.receivedData.noPasses, 3);
			assert.equal(mockTestHandler.receivedData.noFails, 3);
		},

		'TestRunner should send end stats event and data to the TestHandler': function () {
			assert.true(mockTestHandler.receivedEvents.end, 'end was not called in TestHandler');
		},

		'TestRunner should call `FIXTURE_SETUP` once before any tests are run': function () {
			assert.equal(trace[0], 'FIXTURE_SETUP');
		},

		'TestRunner should call `TEST_SETUP` once before each test is run': function () {
			for (var i = 1; i < trace.length; i += 2)
				assert.equal(trace[i], 'TEST_SETUP');
		}

	})).run(new HtmlTestHandler());

});