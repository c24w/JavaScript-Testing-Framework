loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	function TestException(message) { this.message = message }

	var genericFailMsg = 'Should fail';

	function assertAllPass(assertFunc) {
		assert.not.throws(assertFunc, AssertException);
	}

	function assertFails(assertFunc) {
		var exception = assert.throws(assertFunc, AssertException);
		assert.equal(exception.message, genericFailMsg);
	}

	new TestRunner(new TestFixture('Assertions tests', {

		'assert.true should not fail for true conditions': function () {
			assertAllPass(function () { assert.true(true) });
		},

		'assert.false should not fail for false conditions': function () {
			assertAllPass(function () { assert.false(false) });
		},

		'assert.true should fail for false conditions': function () {
			assertFails(function () { assert.true(false, genericFailMsg) });
		},

		'assert.null should not fail for true conditions': function () {
			assertAllPass(function () { assert.null(null) });
		},

		'assert.null should fail for false conditions': function () {
			assertFails(function () { assert.null('not null', genericFailMsg) });
		},

		'assert.equal should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.equal(true, true);
				assert.equal(1, 1);
				assert.equal('abc', 'abc');
				assert.equal('abc', "abc");
			});
		},

		'assert.equal should fail for false conditions': function () {
			assertFails(function () { assert.equal(true, false, genericFailMsg) });
		},

		'assert.equiv should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.equiv(true, 1);
				assert.equiv(false, "0");
				assert.equiv('1', 1);
			});
		},

		'assert.equiv should fail for false conditions': function () {
			assertFails(function () {
				assert.equiv(true, false, genericFailMsg);
			});
		},

		'assert.greater should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.greater(1, 0);
				assert.greater(1, -1);
			});
		},

		'assert.greater should fail for false conditions': function () {
			assertFails(function () {
				assert.greater(0, 1, genericFailMsg)
			});
		},

		'assert.type should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.type(new AssertException(), 'object');
				assert.type('hello', 'string');
				assert.type(1, 'number');
				assert.type(true, 'boolean');
			});
		},

		'assert.type should fail for false conditions': function () {
			assertFails(function () {
				assert.type(1, 'string', genericFailMsg);
			});
		},

		'assert.instance should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.instance(new AssertException(), AssertException);
				assert.instance(new Object(), Object);
				assert.instance('hello', String);
				assert.instance(1, Number);
				assert.instance(true, Boolean);
			});
		},

		'assert.instance should fail for false conditions': function () {
			assertFails(function () {
				assert.instance(1, String, genericFailMsg);
			});
		},

		'assert.not.instance should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.not.instance(new Error(), TestException);
				assert.not.instance(new Object(), Number);
			});
		},

		'assert.not.instance should fail for false conditions': function () {
			assertFails(function () {
				assert.not.instance(new String(), String, genericFailMsg);
			});
		},

		'assert.throws should fail if the defined exception is not thrown': function () {
			assertFails(function () {
				assert.throws(function () { }, TestException, genericFailMsg);
			});
		},

		'assert.throws should fail if the wrong exception is thrown': function () {
			assertFails(function () {
				assert.throws(function () { throw new Error() }, AssertException, genericFailMsg);
			});
		},

		'assert.throws should return the defined exception, if thrown': function () {
			var exception = assert.throws(function () { throw new TestException(genericFailMsg) }, TestException);
			assert.equal(exception.message, genericFailMsg);
		},

		'assert.not.throws should not fail if the defined exception is not thrown': function () {
			assertAllPass(function () {
				assert.not.throws(function () { }, Error);
			});
		},

		'assert.not.throws should not fail if the wrong type of exception is thrown': function () {
			assertAllPass(function () {
				assert.not.throws(function () { throw new TestException() }, Error);
			});
		},

		'assert.not.throws should fail if the defined exception is thrown': function () {
			assertFails(function () {
				assert.not.throws(function () { throw new Error() }, Error, genericFailMsg);
			});
		},

		'assert.not.null should not fail for true conditions': function () {
			assertAllPass(function () {
				assert.not.null('not null');
			});
		},

		'assert.not.null should fail for false conditions': function () {
			assertFails(function () {
				assert.not.null(null, genericFailMsg);
			});
		}

	})).run(new HtmlTestHandler());

});