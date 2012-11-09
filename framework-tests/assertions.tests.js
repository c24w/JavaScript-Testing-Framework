loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	new TestRunner(new TestFixture('Assertions tests', {

		'assert.that should not throw an AssertException for true conditions': function () {
			try {
				assert.that(true);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.that should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.that(false, expectedMsg); // need cases
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.equal should not throw an AssertException for true conditions': function () {
			try {
				assert.equal(true, true);
				assert.equal(1, 1);
				assert.equal('abc', 'abc');
				assert.equal('abc', "abc");
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.equal should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.equal(true, false, expectedMsg); // need cases
				//assert.equal(1, '1', 'Should fail');
				//assert.equal(false, 0, 'Should fail');
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.equiv should not throw an AssertException for true conditions': function () {
			try {
				assert.equiv(true, 1);
				assert.equiv(false, "0");
				assert.equiv('1', 1);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.equiv should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.equiv(true, false, expectedMsg); // need cases
				//assert.equiv(false, 'false', 'Should fail');
				//assert.equiv(true, 10, 'Should fail');
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.instance should not throw an AssertException for true conditions': function () {
			try {
				assert.instance(new AssertException(), AssertException);
				assert.instance(new Object(), Object);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.instance should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.instance(new Object(), String, expectedMsg); // need cases
				//assert.instance(new Object(), String, 'Should fail');
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.throws should throw an AssertException if the defined exception is not thrown': function () {
			try {
				assert.throws(function () { }, AssertException);
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, 'AssertException was never thrown');
			}
		},

		'assert.throws should throw an AssertException if the wrong exception is thrown': function () {
			try {
				assert.throws(function () { throw new Error() }, AssertException);
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, 'assert.throws - expected: AssertException found: Error');
			}
		},

		'assert.throws should return the defined exception, if thrown': function () {
			var expectedMsg = 'error message';
			var exception = assert.throws(function () { throw new AssertException(expectedMsg) }, AssertException);
			assert.equal(exception.message, expectedMsg);
		}

	})).run(new HtmlTestHandler());

});