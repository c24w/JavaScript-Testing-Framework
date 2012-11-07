loadResources('test-fixtures.js', 'assertions.js', function () {

	new autoRunTestFixtureToHtml('Test-fixture tests', {

		'aaa': function () {
			try {
				assert.that(true);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		}

	});
});