loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	function TestException(message) { this.message = message }

	var genericFailMsg = 'Should fail';

	function assertAllPass(assertCollection) {
		assert.not.throws(assertCollection, AssertException);
	}

	function assertFails(assertFunc) {
		var exception = assert.throws(assertFunc, AssertException);
		assert.equal(exception.message, genericFailMsg);
	}

	var fixtures = [

		new TestFixture('Condition assertion tests', {
			'assert.true should pass for true conditions': function () {
				assertAllPass(function () {
					assert.true(true);
					assert.true(1 === 1);
				});
			},
			'assert.true should fail for false conditions': function () {
				assertFails(function () {
					assert.true(false, genericFailMsg)
				});
			},
			'assert.false should pass for false conditions': function () {
				assertAllPass(function () {
					assert.false(false)
					assert.false(1 === 0)
				});
			},
			'assert.false should fail for false conditions': function () {
				assertFails(function () {
					assert.false(true, genericFailMsg)
				});
			}
		}),

		new TestFixture('Specific value assertion tests', {
			'assert.null should pass for true conditions': function () {
				assertAllPass(function () {
					assert.null(null)
				});
			},
			'assert.null should fail for false conditions': function () {
				assertFails(function () {
					assert.null('not null', genericFailMsg)
				});
			},
			'assert.not.null should pass for true conditions': function () {
				assertAllPass(function () {
					assert.not.null('not null')
				});
			},
			'assert.not.null should fail for false conditions': function () {
				assertFails(function () {
					assert.not.null(null, genericFailMsg)
				});
			}
		}),

		new TestFixture('Object equality assertion tests', {
			'assert.equal should pass for true conditions': function () {
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
			'assert.equiv should pass for true conditions': function () {
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
			}
		}),

		new TestFixture('Integer comparison assersion tests', {
			'assert.greater should pass for true conditions': function () {
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
			'assert.less should pass for true conditions': function () {
				assertAllPass(function () {
					assert.less(0, 1);
					assert.less(-1, 1);
				});
			},
			'assert.less should fail for false conditions': function () {
				assertFails(function () {
					assert.less(1, 0, genericFailMsg)
				});
			}
		}),

		new TestFixture('Object type assertion tests', {
			'assert.instance should pass for true conditions': function () {
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
			'assert.not.instance should pass for true conditions': function () {
				assertAllPass(function () {
					assert.not.instance(new Error(), TestException);
					assert.not.instance(new Object(), Number);
				});
			},
			'assert.not.instance should fail for false conditions': function () {
				assertFails(function () {
					assert.not.instance(new String(), String, genericFailMsg);
				});
			}
		}),

		new TestFixture('Exception handling assertion tests', {
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
			'assert.not.throws should pass if the defined exception is not thrown': function () {
				assertAllPass(function () {
					assert.not.throws(function () { }, Error)
				});
			},
			'assert.not.throws should pass if the wrong type of exception is thrown': function () {
				assertAllPass(function () {
					assert.not.throws(function () { throw new TestException() }, Error)
				});
			},
			'assert.not.throws should fail if the defined exception is thrown': function () {
				assertFails(function () {
					assert.not.throws(function () {
						throw new Error()
					}, Error, genericFailMsg);
				});
			},
			'assert.not.type should pass for true conditions': function () {
				assertAllPass(function () {
					assert.not.type(null, genericFailMsg);
					assert.not.type(null, genericFailMsg);
				});
			}
		})

	];

	for (var fixture in fixtures)
		new TestRunner(fixtures[fixture]).run(new HtmlTestHandler());

});