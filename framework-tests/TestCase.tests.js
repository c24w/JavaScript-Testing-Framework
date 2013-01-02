JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestRunner = JTF.TestRunner, TestFixture = JTF.TestFixture, Case = JTF.TestCase, Assert = JTF.Assert;

		var MockTestFixture, MockTestHandler, trace, cases;
		function addTrace(t) { trace[trace.length] = t; }
		function logCase() { addTrace(Array.prototype.join.call(arguments, ',')); }

		var fixture = new TestFixture('TestCase tests', {

			FIXTURE_SETUP: function () {
				trace = [];
				cases = [
					[1, 2, 3],
					['a', 'b'],
					[true, false],
					[new Object(), new Object()]
				];

				MockTestFixture = new TestFixture('Mock test fixture', {
					'Test': function (TestCase) {
						var tc = TestCase(logCase);
						for (var i = 0; i < cases.length; i++)
							tc.addCase(cases[i]);
					}
				});

				new TestRunner(MockTestFixture).run({ handle: function () { } });
			},

			'Test function should be called once for each case with the correct arguments': function () {
				Assert.equal(trace.length, cases.length);
				for (var i = 0; i < trace.length; i++)
					Assert.equal(trace[i], cases[i].join(','));
			}

	});

	var config = {
		collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
		showPassedFixtures: true,
		notifyOnFail: false,
		runInterval: 10000
	};

	JTF.runToHtml(fixture, config);

});
});