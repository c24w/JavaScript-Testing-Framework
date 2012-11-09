loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	var MockTestHandler = function () {
		this.receivedEvents = {
			start: false, end: false
		}
		this.receivedData = {
			desc: null, passedTests: [], failedTests: [], noPasses: null, noFails: null
		}
		this.handle = function (handleType) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TEST_RUNNER_EVENT.START:
					this.receivedEvents.start = true;
					break;
				case TEST_RUNNER_EVENT.DESC:
					this.receivedData.desc = args[0];
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

	new TestRunner(
		new TestFixture('Mock test fixture', {
			'Passing test 1': function () { assert.that(true) },
			'Passing test 2': function () { assert.that(true) },
			'Passing test 3': function () { assert.that(true) },
			'Failing test 1': function () { assert.that(false) },
			'Failing test 2': function () { assert.that(false) },
			'Failing test 3': function () { assert.that(false) }
		})
		)
		.run(mockTestHandler);

	new TestRunner(new TestFixture('TestRunner tests', {

		'TestRunner should send test start event to the TestHandler': function () {

			assert.that(mockTestHandler.receivedEvents.start, 'start was not called in TestHandler');
		},

		'TestRunner should send test description event and data to the TestHandler': function () {
			var fixtureName = 'Mock test fixture';

			assert.equal(mockTestHandler.receivedData.desc, fixtureName);
		},

		'TestRunner should send test pass event and data to the TestHandler': function () {
			var passData = mockTestHandler.receivedData.passedTests;
			assert.equal(passData.length, 3);
			for (var i = 0; i < passData.length;)
				assert.equal(passData[i], 'Passing test ' + (++i));
		},

		'TestRunner should send test fail event and data to the TestHandler': function () {
			var failData = mockTestHandler.receivedData.failedTests;
			assert.equal(failData.length, 3);
			for (var i = 0; i < failData.length;)
				assert.equal(failData[i], 'Failing test ' + (++i));
		},

		'TestRunner should send test stats event and data to the TestHandler': function () {
			assert.equal(mockTestHandler.receivedData.noPasses, 3);
			assert.equal(mockTestHandler.receivedData.noFails, 3);
		},

		'TestRunner should send end stats event and data to the TestHandler': function () {
			assert.that(mockTestHandler.receivedEvents.end, 'end was not called in TestHandler');
		}

	})).run(new HtmlTestHandler());

});