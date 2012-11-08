loadResources('test-fixtures.js', 'outputting.js', 'html-test-handler.js', 'assertions.js', function () {

	var mockOutputter = {
		descOutputter: function () { },
		testOutputter: function () { },
		terminatorOutputter: function (description) { },
		resultOutputter: function () { },
		summaryOutputter: function () { },
	}

	new TestRunner(new TestFixture('Test-runner tests', {

		'outputTestFixture should': function () {
			var fixture = new TestFixture('Fixture', {
				'Test should fail': function () {
					assert.equal('this test', 'should fail');
				}
			});

			outputTestFixture(false, fixture, mockOutputter);

			function test() {
				assert.equal('this test', 'should fail');
			}
			try {
				test();
			}
			catch (e) {

			}
		}

	})).run(new HtmlTestHandler());

});