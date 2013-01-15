JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var TestFixture = JTF.TestFixture;
		var TestRunner = JTF.TestRunner;
		var Assert = JTF.Assert;
		var expectedDesc, testFixture;

		JTF.runToHtml(new TestFixture('TestFixture tests', {

			FIXTURE_SETUP: function () {
				expectedDesc = 'test fixture description';
				testFixture = new TestFixture(expectedDesc, {
					'expected test 1': function () { },
					'expected test 2': function () { },
					'expected test 3': function () { }
				});
			},

			'getDescription should return the default value, if undefined': function (TestCase) {
				TestCase(function (tf) {
					Assert.equal(tf.getDescription(), TestFixture.DEFAULT_DESCRIPTION);
				})
				.addCase(new TestFixture())
				.addCase(new TestFixture({}));
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
				for (var t in tests) Assert.equal(t, 'expected test ' + testNo++);
			},

			/*'implicit fixture is converted to test fixture': function () {
				var implicitFixture = {
					'fixture description': {
						'test name': function () { }
					}
				};
				Assert.equal();
			}*/

		}),
		{
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPassedFixtures: true,
			notifyOnFail: false,
			runInterval: 10000
		});

	});
});