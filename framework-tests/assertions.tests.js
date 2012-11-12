loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	function TestException() { }

	new TestRunner(new TestFixture('Assertions tests', {

		'assert.true should not throw an AssertException for true conditions': function () {
			try {
				assert.true(true);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.false should not throw an AssertException for false conditions': function () {
			try {
				assert.false(false);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.true should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.true(false, expectedMsg); // need cases
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

		'assert.greater should not throw an AssertException for true conditions': function () {
			try {
				assert.greater(1, 0);
				assert.greater(1, -1);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.greater should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.greater(0, 1, expectedMsg); // need cases
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.type should not throw an AssertException for true conditions': function () {
			try {
				assert.type(new AssertException(), 'object');
				assert.type('hello', 'string');
				assert.type(1, 'number');
				assert.type(true, 'boolean');
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.type should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.type(1, 'string', expectedMsg); // need cases
				//assert.type(true, 'number', expectedMsg); // need cases
				//assert.type(false, 'object', expectedMsg); // need cases
				//assert.type('hello', 'boolean', expectedMsg); // need cases
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

		'assert.not.instance should not throw an AssertException for true conditions': function () {
			try {
				assert.not.instance(new Error(), TestException);
				assert.not.instance(new Object(), Number);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.not.instance should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.not.instance(new String(), String, expectedMsg); // need cases
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
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.throws should throw an AssertException if the wrong exception is thrown': function () {
			try {
				assert.throws(function () { throw new Error() }, AssertException);
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, 'assert.throws - expected: AssertException found: Error');
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.throws should return the defined exception, if thrown': function () {
			var expectedMsg = 'error message';
			var exception = assert.throws(function () { throw new AssertException(expectedMsg) }, AssertException);
			assert.equal(exception.message, expectedMsg);
		},

		'assert.not.throws should not throw an AssertException if the defined exception is not thrown': function () {
			try {
				assert.not.throws(function () { }, Error);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.not.throws should not throw an AssertException if the wrong type of exception is thrown': function () {
			try {
				assert.not.throws(function () { throw new TestException() }, Error);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.not.throws should throw an AssertException if the defined exception is thrown': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.not.throws(function () { throw new Error() }, Error, expectedMsg);
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assert.not.null should not throw an AssertException for true conditions': function () {

			try {
				assert.not.null('not null');
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert.not.null should throw an AssertException for false conditions': function () {
			var expectedMsg = 'Should fail';
			try {
				assert.not.null(null, expectedMsg);
			}
			catch (e) {
				assert.instance(e, AssertException);
				assert.equal(e.message, expectedMsg);
				return;
			}
			throw new Error('Test should not have thrown this error');
		}

	})).run(new HtmlTestHandler());

});