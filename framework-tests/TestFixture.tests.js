loadFramework(function () {
	loadHtmlResources(function () {

		var expectedDesc = 'test fixture description';

		var tf = new TestFixture(expectedDesc, {
			'expected test 1': function () { },
			'expected test 2': function () { },
			'expected test 3': function () { }
		});

		new TestRunner(new TestFixture('TestFixture tests', {

			'`getDescription` should return the expected value if defined': function () {
				Assert.equal(tf.getDescription(), expectedDesc);
			},

			'`getDescription` should return undefined if no value is defined': function () {
				var tf = new TestFixture();
				Assert.instance(tf.getDescription(), undefined);
			},

			'`getTests` should be the expected value': function () {
				var tests = tf.getTests();
				var testNo = 1;
				for (var t in tests)
					Assert.equal(t, 'expected test ' + testNo++);
			},

		})).run(new HtmlTestHandler());

	});
});