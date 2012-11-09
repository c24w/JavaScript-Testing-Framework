loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	var MockTestHandler = function () {
		this.numberOfCalls = {
			start: 0,
			desc: 0,
			pass: 0,
			fail: 0,
			stats: 0,
			end: 0,
		}
		this.handle = function (handleType) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TEST_RUNNER_EVENT.START:
					this.numberOfCalls.start++;
					break;
				case TEST_RUNNER_EVENT.DESC:
					this.numberOfCalls.desc++;
					break;
				case TEST_RUNNER_EVENT.PASS:
					this.numberOfCalls.pass++;
					break;
				case TEST_RUNNER_EVENT.FAIL:
					this.numberOfCalls.fail++;
					break;
				case TEST_RUNNER_EVENT.STATS:
					this.numberOfCalls.stats++;
					break;
				case TEST_RUNNER_EVENT.END:
					this.numberOfCalls.end++;
					break;
			}
		}
	}

	var mockTestFixture = new TestFixture('Mock test fixture', {

		'Passing test': function () {
			assert.that(true);
		},

		'Failing test': function () {
			assert.that(false);
		}

	});

	new TestRunner(new TestFixture('TestRunner tests', {

		'TestRunner should call `TestHandler.handle(...)` for all `TEST_RUNNER_EVENT`s': function () {

			var mockTestHandler = new MockTestHandler();
			new TestRunner(mockTestFixture).run(mockTestHandler);
			var calls = mockTestHandler.numberOfCalls;

			for (var call in calls)
				assert.equal(calls[call], 1, call + ' was not called in TestHandler');
		}

	})).run(new HtmlTestHandler());

});