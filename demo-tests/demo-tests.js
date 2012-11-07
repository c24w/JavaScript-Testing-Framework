loadResources('test-fixtures.js', 'assertions.js', 'outputting.js', function () {

	var fixtures = [

		new testFixture('assert.that', {

			'assert.that should pass': function () {
				assert.that(true);
			},

			'assert.that should fail without reason': function () {
				assert.that(false);
			},

			'assert.that should fail with custom reason': function () {
				assert.that(false, 'because I said so');
			},

		}),

		new testFixture('assert.equal', {

			'assert.equal should pass': function () {
				assert.equal('a', "a");
			},

			'assert.equal should fail with generated reason': function () {
				assert.equal(1, '1');
			},

			'assert.equal should fail with custom reason': function () {
				assert.equal(1, true, 'because "1" and "true" are only equal with type-conversion, i.e. assert.equiv');
			},

		}),

		new testFixture('assert.equiv', {

			'assert.equiv should pass': function () {
				assert.equiv(1, "1");
			},

			'assert.equiv should fail with generated reason': function () {
				assert.equiv('a', 'b');
			},

			'assert.equiv should fail with custom reason': function () {
				assert.equiv(0, true, 'because this compares "0" and "true"');
			},

		}),

		new testFixture('assert.instance', {

			'assert.instance should pass': function () {
				assert.instance(new Number(123), Number);
			},

			'assert.instance should fail with generated reason': function () {
				assert.instance('abc', Number);
			},

			'assert.instance should fail with custom reason': function () {
				assert.instance(new Object, Error, 'because an Object is not an instance of Error');
			},

		}),

		new testFixture('assert.throws', {

			'assert.throws should pass': function () {
				var info = 'fail message';
				var exception = assert.throws(function () { throw new AssertException(info) }, AssertException);
				assert.equal(exception.message, info);
			},

			'assert.throws should fail (because no exception is thrown) with generated reason': function () {
				var exception = assert.throws(function () { }, Error);
			},

			'assert.throws should fail (because a different exception is thrown) with generated reason': function () {
				assert.throws(function () { throw new Error() }, AssertException);
			},

			'assert.throws should fail with custom reason': function () {
				assert.throws(function () { throw new Error() }, AssertException, 'because an Error is thrown in the callback, but an AssertException was expected');
			},

			'assert.equal should fail (using the result of assert.throws) with generated reason': function () {
				var expectedMsg = 'error message';
				var exception = assert.throws(function () { throw new Error('omgwtfbbq') }, Error);
				assert.equal(exception.message, expectedMsg);
			},

			})

];

for (var f in fixtures) {
	var f = fixtures[f];
	outputTestFixtureToHtml(f);
	outputTestFixtureToConsole(f);
}

});
