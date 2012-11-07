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

		'assertThrows should pass': function () {
			var info = 'fail message';
			var exception = assertThrows(function () { throw new AssertException(info) }, AssertException);
			assertEqual(exception.message, info);
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

		'assertEqual should fail (using the result of assertThrows) with generated reason': function () {
			var expectedInfo = 'error info';
			var exception = assertThrows(function () { throw new Error('omgwtfbbq') }, Error);
			assertEqual(exception.message, expectedInfo);
		},

		'assertEquiv should fail with generated reason': function () {
			assertEquiv('a', 'b');
		},

		'assertEquiv should fail with custom reason': function () {
			assertEquiv(0, true, 'because this compares "0" and "true"');
		},

		'assertInstance should fail with generated reason': function () {
			assertInstance('abc', Number);
		},

		'assertInstance should fail with custom reason': function () {
			assertInstance(new Object, Error, 'because an Object is not an instance of Error');
		},

		'assertThrows should fail (because nothing throws) with generated reason': function () {
			var exception = assertThrows(function () { }, Error);
		},

		'assertThrows should fail (because a different exception is thrown) with generated reason': function () {
			assertThrows(function () { throw new Error() }, AssertException);
		},

		'assertThrows should fail with custom reason': function () {
			assertThrows(function () { throw new Error() }, AssertException, 'because the callback function throws an Error and AssertException was expected');
		},

	});

	outputTestFixtureToHtml(tf);
	outputTestFixtureToConsole(tf);

});
