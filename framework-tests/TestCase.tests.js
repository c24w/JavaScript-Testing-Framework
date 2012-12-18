JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		function getTraceMsg(arg1, arg2) {
			return 'TestCase({0}, {1})'.format(arg1, arg2)
		}

		var TestRunner = JTF.TestRunner;
		var TestFixture = JTF.TestFixture;
		var TestCase = JTF.TestCase;
		var Case = JTF.TestCase;
		var Assert = JTF.Assert;

		var MockTestFixture, MockTestHandler, trace;
		function addTrace(t) { trace[trace.length] = t }

		var fixture = new TestFixture('TestCase tests', {

			FIXTURE_SETUP: function () {
				trace = [];

				MockTestFixture = new TestFixture('Mock test fixture', {
					'Test': function () {

						TestCase(
							[1, 2],
							['one', 'two'],
							[true, false],
							function (arg1, arg2) {
								addTrace(getTraceMsg(arg1, arg2));
							}
						);

					}
				});

				new TestRunner.Single(MockTestFixture).run({ handle: function () { } });
			},

			'TestCase should be called once for each case, with the correct arguments': function () {
				Assert.equal(trace.length, 3);
				var cases = [
					[1, 2],
					['one', 'two'],
					[true, false]
				];
				for (var i = 0; i < trace.length; i++)
					Assert.equal(trace[i], getTraceMsg.apply(this, cases[i]));
			}

		});

		var handler = new JTF.HTML.TestHandler({
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPasses: true,
			notifyOnFail: false,
			runInterval: 10000
		});

		new TestRunner.Single(fixture).run(handler);

	});
});