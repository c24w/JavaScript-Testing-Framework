loadResources('test-fixtures.js', 'assertions.js', 'outputting.js', function () {

	var tf = new testFixture('Demo Tests', {

		'assert should pass': function () {
			assert(true);
		},

		'assertEqual should pass': function () {
			assertEqual('a', "a");
		},

		'assertEquiv should pass': function () {
			assertEquiv(1, "1");
		},

		'assertInstance should pass': function () {
			assertInstance(new Number(123), Number);
		},

		'assert should fail without reason': function () {
			assert(false);
		},

		'assert should fail with custom reason': function () {
			assert(false, 'because I said so');
		},

		'assertEqual should fail with generated reason': function () {
			assertEqual(1, '1');
		},

		'assertEqual should fail with custom reason': function () {
			assertEqual(1, true, 'because "1" and "true" are only equal with type-conversion, i.e. assertEquiv');
		},

		'assertEquiv should fail with generated reason': function () {
			assertEquiv('a', 'b');
		},

		'assertEquiv should fail with custom reason': function () {
			assertEquiv(0, true, 'because this compares "0" and "true"');
		},

		'assertInstance should fail with generated reason': function () {
			assertInstance('abc', Object);
		},

		'assertInstance should fail with custom reason': function () {
			assertInstance(new Object, Error, 'because an Object is not an instance of Error');
		}

	});

	outputTestFixtureToHtml(tf);
	outputTestFixtureToConsole(tf);

});
