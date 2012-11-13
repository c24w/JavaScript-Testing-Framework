loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	function TestException(message) { this.message = message }

	var genericFailMsg = 'Should fail';

	function assertAllPass(assertCollection) {
		Assert.not.throws(assertCollection, AssertException);
	}

	function assertFails(assertFunc) {
		var exception = Assert.throws(assertFunc, AssertException);
		Assert.equal(exception.message, genericFailMsg);
	}

	var fixtures = [

		new TestFixture('Condition assertion tests', {
			'Assert.true should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.true(true);
					Assert.true(1 === 1);
				});
			},
			'Assert.true should fail for false conditions': function () {
				assertFails(function () {
					Assert.true(false, genericFailMsg)
				});
			},
			'Assert.false should pass for false conditions': function () {
				assertAllPass(function () {
					Assert.false(false)
					Assert.false(1 === 0)
				});
			},
			'Assert.false should fail for false conditions': function () {
				assertFails(function () {
					Assert.false(true, genericFailMsg)
				});
			}
		}),

		new TestFixture('Specific value assertion tests', {
			'Assert.null should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.null(null)
				});
			},
			'Assert.null should fail for false conditions': function () {
				assertFails(function () {
					Assert.null('not null', genericFailMsg)
				});
			},
			'Assert.not.null should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.not.null('not null')
				});
			},
			'Assert.not.null should fail for false conditions': function () {
				assertFails(function () {
					Assert.not.null(null, genericFailMsg)
				});
			}
		}),

		new TestFixture('Object equality assertion tests', {
			'Assert.equal should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.equal(true, true);
					Assert.equal(1, 1);
					Assert.equal('abc', 'abc');
					Assert.equal('abc', "abc");
				});
			},
			'Assert.equal should fail for false conditions': function () {
				assertFails(function () { Assert.equal(true, false, genericFailMsg) });
			},
			'Assert.equiv should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.equiv(true, 1);
					Assert.equiv(false, "0");
					Assert.equiv('1', 1);
				});
			},
			'Assert.equiv should fail for false conditions': function () {
				assertFails(function () {
					Assert.equiv(true, false, genericFailMsg);
				});
			}
		}),

		new TestFixture('Integer comparison assersion tests', {
			'Assert.greater should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.greater(1, 0);
					Assert.greater(1, -1);
				});
			},
			'Assert.greater should fail for false conditions': function () {
				assertFails(function () {
					Assert.greater(0, 1, genericFailMsg)
				});
			},
			'Assert.less should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.less(0, 1);
					Assert.less(-1, 1);
				});
			},
			'Assert.less should fail for false conditions': function () {
				assertFails(function () {
					Assert.less(1, 0, genericFailMsg)
				});
			}
		}),

		new TestFixture('Object type assertion tests', {
			'Assert.instance should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.instance(new AssertException(), AssertException);
					Assert.instance(new Object(), Object);
					Assert.instance('hello', String);
					Assert.instance(1, Number);
					Assert.instance(true, Boolean);
				});
			},
			'Assert.instance should fail for false conditions': function () {
				assertFails(function () {
					Assert.instance(1, String, genericFailMsg);
				});
			},
			'Assert.not.instance should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.not.instance(new Error(), TestException);
					Assert.not.instance(new Object(), Number);
				});
			},
			'Assert.not.instance should fail for false conditions': function () {
				assertFails(function () {
					Assert.not.instance(new String(), String, genericFailMsg);
				});
			}
		}),

		new TestFixture('Exception handling assertion tests', {
			'Assert.throws should fail if the defined exception is not thrown': function () {
				assertFails(function () {
					Assert.throws(function () { }, TestException, genericFailMsg);
				});
			},
			'Assert.throws should fail if the wrong exception is thrown': function () {
				assertFails(function () {
					Assert.throws(function () { throw new Error() }, AssertException, genericFailMsg);
				});
			},
			'Assert.throws should return the defined exception, if thrown': function () {
				var exception = Assert.throws(function () { throw new TestException(genericFailMsg) }, TestException);
				Assert.equal(exception.message, genericFailMsg);
			},
			'Assert.not.throws should pass if the defined exception is not thrown': function () {
				assertAllPass(function () {
					Assert.not.throws(function () { }, Error)
				});
			},
			'Assert.not.throws should pass if the wrong type of exception is thrown': function () {
				assertAllPass(function () {
					Assert.not.throws(function () { throw new TestException() }, Error)
				});
			},
			'Assert.not.throws should fail if the defined exception is thrown': function () {
				assertFails(function () {
					Assert.not.throws(function () {
						throw new Error()
					}, Error, genericFailMsg);
				});
			},
			'Assert.not.type should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.not.type(null, genericFailMsg);
					Assert.not.type(null, genericFailMsg);
				});
			}
		})

	];

	for (var fixture in fixtures)
		new TestRunner(fixtures[fixture]).run(new HtmlTestHandler());

});