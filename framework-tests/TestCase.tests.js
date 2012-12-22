JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		function getTraceMsg(arg1, arg2) {
			return 'TestCase({0}, {1})'.format(arg1, arg2)
		}

		var TestRunner = JTF.TestRunner;
		var TestFixture = JTF.TestFixture;
		var Case = JTF.TestCase;
		var Assert = JTF.Assert;

		var MockTestFixture, MockTestHandler, trace;
		function addTrace(t) { trace[trace.length] = t }

		var fixture = new TestFixture('TestCase tests', {

			FIXTURE_SETUP: function () {
				trace = [];

				MockTestFixture = new TestFixture('Mock test fixture', {
					'Test': function (TestCase) {

						TestCase(function (arg1, arg2) {
							addTrace(getTraceMsg(arg1, arg2));
						})
						.addCase(1, 2)
						.addCase('one', 'two')
						.addCase(true, false)
						.addCase(new Object(), new Object());

					}
				});

				new TestRunner(MockTestFixture).run({ handle: function () { } });
			},

			'TestCase should be called once for each case, with the correct arguments': function () {
				var cases = [
					[1, 2],
					['one', 'two'],
					[true, false],
					[new Object(), new Object()]
				];
				Assert.equal(trace.length, cases.length);
				for (var i = 0; i < trace.length; i++)
					Assert.equal(trace[i], getTraceMsg.apply(null, cases[i]));
			}

		});

		var handler = new JTF.HTML.TestHandler({
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPasses: true,
			notifyOnFail: false,
			runInterval: 10000
		});

		new TestRunner(fixture).run(handler);

	});
});