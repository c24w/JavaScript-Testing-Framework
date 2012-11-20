JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestFixture = JTF.TestFixture;
		var TestRunner = JTF.TestRunner;
		var Assert = JTF.Assert;
		var expectedDesc, testFixture;

		new TestRunner(new TestFixture('TestFixture tests', {

			FIXTURE_SETUP: function () {
				expectedDesc = 'test fixture description';
				testFixture = new TestFixture(expectedDesc, {
					'expected test 1': function () { },
					'expected test 2': function () { },
					'expected test 3': function () { }
				});
			},

			'getDescription should return a default value, if undefined': function () {
				Assert.equal(new TestFixture().getDescription(), TestFixture.DefaultDescription);
			},

			'getDescription should return the expected string, if defined': function () {
				var actual = testFixture.getDescription();
				Assert.instance(actual, String);
				Assert.equal(actual, expectedDesc);
			},

			'getTests should return an empty object, if undefined': function () {
				Assert.equal(Object.keys(new TestFixture().getTests()).length, 0);
			},

			'getTests should return the expected object, if defined': function () {
				var tests = testFixture.getTests();
				var testNo = 1;
				for (var t in tests)
					Assert.equal(t, 'expected test ' + testNo++);
			},

		})).run(new JTF.Html.TestHandler({ showPasses: true, collapse: JTF.Html.TestHandlerConfig.collapse.passes, notifyOnFail: true, refresh: 5000 }));

	});
});