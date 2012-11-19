JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

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

			'getDescription should return the expected string, if defined': function () {
				var actual = testFixture.getDescription();
				JTF.Assert.instance(actual, String);
				JTF.Assert.equal(actual, expectedDesc);
			},

			'getDescription should return a default value, if undefined': function () {
				testFixture = new TestFixture();
				JTF.Assert.equal(testFixture.getDescription(), TestFixture.DefaultDescription);
			},

			'getTests should return the expected object': function () {
				var tests = testFixture.getTests();
				var testNo = 1;
				for (var t in tests)
					JTF.Assert.equal(t, 'expected test ' + testNo++);
			},

		})).run(new HtmlTestHandler({ autocollapse: htmlTestHandlerConfig.autocollapse.none }));

	});
});