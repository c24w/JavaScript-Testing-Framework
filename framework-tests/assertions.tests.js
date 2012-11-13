loadResources('TestFixture.js', 'TestRunner.js', 'HtmlTestHandler.js', 'assertions.js', function () {

	function TestException(message) { this.message = message }

	var genericFailMsg = 'Should fail';

	function assertAllPass(assertCollection) {
		Assert.not.throws(assertCollection, AssertException);
	}

	function assertFails(assertFunc, exceptionMsg) {
		var exception = Assert.throws(assertFunc, AssertException);
		var msg = exceptionMsg ? exceptionMsg : genericFailMsg;
		Assert.equal(exception.message, msg);
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
					Assert.false(false);
					Assert.false(1 === 0);
				});
			},
			'Assert.false should fail for false conditions': function () {
				assertFails(function () {
					Assert.false(true, genericFailMsg)
				});
			},

			'`Assert.that(*).is.true()` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(true).is.true;
					Assert.that(1 === 1).is.true;
				});
			},
			'`Assert.that(*).is.true()` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(false).is.true();
				}, 'no additional information');
			},
			'`Assert.that(*).is.false()` should pass for false conditions': function () {
				assertAllPass(function () {
					Assert.that(false).is.false();
					Assert.that(1 === 0).is.false();
				});
			},
			'`Assert.that(*).is.false()` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(true).is.false();
				}, 'no additional information');
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
			},

			'`Assert.that(*).is.null()` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(null).is.null()
				});
			},
			'`Assert.that(*).is.null()` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that('not null', genericFailMsg).is.null()
				}, 'Assert.null - argument was not null');
			},
			'`Assert.that(*).is.not.null()` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that('not null').is.not.null()
				});
			},
			'`Assert.that(*).is.not.null()` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(null).is.not.null()
				}, 'Assert.not.null - argument was null');
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
			},

			'`Assert.that(*).equals(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(true).equals(true);
					Assert.that(1).equals(1);
					Assert.that('abc').equals('abc');
					Assert.that('abc').equals("abc");
				});
			},
			'`Assert.that(*).equals(*)` should fail for false conditions': function () {
				assertFails(function () { Assert.equal(true, false, genericFailMsg) });
			},
			'`Assert.that(*).is.equiv.to(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(true).is.equiv.to(1);
					Assert.that(false).is.equiv.to("0");
					Assert.that('1').is.equiv.to(1);
				});
			},
			'`Assert.that(*).is.equiv.to(*)` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(true).is.equiv.to(false);
				}, 'Assert.equiv - expected: boolean(false) found: boolean(true)');
			}
		}),

		new TestFixture('Number comparison assersion tests', {
			'Assert.greater should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.greater(1, 0);
					Assert.greater(1, 0.5);
					Assert.greater(1, -1);
				});
			},
			'Assert.greater should fail for false conditions': function () {
				assertFails(function () {
					Assert.greater(0, 1, genericFailMsg)
				});
			},
			'Assert.greater should fail for non-numeric first value': function () {
				assertFails(function () {
					Assert.greater(false, 1, genericFailMsg)
				}, 'Assert.greater - first argument: expected: number found: boolean');
			},
			'Assert.greater should fail for non-numeric second value': function () {
				assertFails(function () {
					Assert.greater(2, 'one', genericFailMsg)
				}, 'Assert.greater - second argument: expected: number found: string');
			},

			'Assert.less should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.less(0, 1);
					Assert.less(0.5, 1);
					Assert.less(-1, 1);
				});
			},
			'Assert.less should fail for false conditions': function () {
				assertFails(function () {
					Assert.less(1, 0, genericFailMsg)
				});
			},
			'Assert.less should fail for non-numeric first value': function () {
				assertFails(function () {
					Assert.less(false, 1, genericFailMsg)
				}, 'Assert.less - first argument: expected: number found: boolean');
			},
			'Assert.less should fail for non-numeric second value': function () {
				assertFails(function () {
					Assert.less(2, 'one', genericFailMsg)
				}, 'Assert.less - second argument: expected: number found: string');
			},

			'`Assert.that(*).is.greater.than(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(1).is.greater.than(0);
					Assert.that(1).is.greater.than(0.5);
					Assert.that(1).is.greater.than(-1);
				});
			},
			'`Assert.that(*).is.greater.than(*)` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(0).is.greater.than(1);
				}, 'Assert.greater - 0 is not greater than 1');
			},
			'`Assert.that(*).is.greater.than(*)` should fail for non-numeric first value': function () {
				assertFails(function () {
					Assert.that(false).is.greater.than(1);
				}, 'Assert.greater - first argument: expected: number found: boolean');
			},
			'`Assert.that(*).is.greater.than(*)` should fail for non-numeric second value': function () {
				assertFails(function () {
					Assert.that(2).is.greater.than('one');
				}, 'Assert.greater - second argument: expected: number found: string');
			},

			'`Assert.that(*).is.less.than(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(0).is.less.than(1);
					Assert.that(0.5).is.less.than(1);
					Assert.that(-1).is.less.than(1);
				});
			},
			'`Assert.that(*).is.less.than(*)` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(1).is.less.than(0);
				}, 'Assert.less - 1 is not less than 0');
			},
			'`Assert.that(*).is.less.than(*)` should fail for non-numeric first value': function () {
				assertFails(function () {
					Assert.that(false).is.less.than(1);
				}, 'Assert.less - first argument: expected: number found: boolean');
			},
			'`Assert.that(*).is.less.than(*)` should fail for non-numeric second value': function () {
				assertFails(function () {
					Assert.that(2).is.less.than('one');
				}, 'Assert.less - second argument: expected: number found: string');
			},
		}),

		new TestFixture('Object type assertion tests', {
			'Assert.instance should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.instance(new TestException(), TestException);
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
					Assert.not.instance('hello', String, genericFailMsg);
				});
			},

			'`Assert.that(*).is.instance.of(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(new TestException()).is.instance.of(TestException);
					Assert.that(new Object()).is.instance.of(Object);
					Assert.that('hello').is.instance.of(String);
					Assert.that(1).is.instance.of(Number);
					Assert.that(true).is.instance.of(Boolean);
				});
			},
			'`Assert.that(*).is.instance.of(*)` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that(1).is.instance.of(String);
				}, 'Assert.instance - expected: String found: Number');
			},
			'`Assert.that(*).is.not.instance.of(*)` should pass for true conditions': function () {
				assertAllPass(function () {
					Assert.that(new Error()).is.not.instance.of(TestException);
					Assert.that(new Object()).is.not.instance.of(Number);
				});
			},
			'`Assert.that(*).is.not.instance.of(*)` should fail for false conditions': function () {
				assertFails(function () {
					Assert.that('hello').is.not.instance.of(String);
				}, 'Assert.not.instance - expected: not String found: String');
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
					Assert.throws(function () { throw new Error() }, TestException, genericFailMsg);
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
			'Assert.not.throws should pass if a different type of exception is thrown': function () {
				assertAllPass(function () {
					Assert.not.throws(function () { throw new TestException() }, Error)
				});
			},
			'Assert.not.throws should fail if the defined exception is thrown': function () {
				assertFails(function () {
					Assert.not.throws(function () { throw new Error() }, Error, genericFailMsg);
				});
			},

			'`Assert.that(*).throws(*)` should fail if the defined exception is not thrown': function () {
				assertFails(function () {
					Assert.that(function () { }).throws(TestException);
				}, 'TestException was never thrown');
			},
			'`Assert.that(*).throws(*)` should fail if the wrong exception is thrown': function () {
				assertFails(function () {
					Assert.that(function () { throw new Error() }).throws(TestException);
				}, 'Assert.throws - expected: TestException found: Error');
			},
			'`Assert.that(*).throws(*)` should return the defined exception, if thrown': function () {
				assertAllPass(function () {
					var message = 'shit the bed';
					var exception = Assert.that(function () { throw new TestException(message) }).throws(TestException);
					Assert.that(exception.message).equals(message);
				});
			},

			'`Assert.that(*).does.not.throw(*)` should pass if the defined exception is not thrown': function () {
				assertAllPass(function () {
					Assert.that(function () { }).does.not.throw(Error);
				});
			},
			'`Assert.that(*).does.not.throw(*)` should pass if a different type of exception is thrown': function () {
				assertAllPass(function () {
					Assert.that(function () { throw new TestException() }).does.not.throw(Error);
				});
			},
			'`Assert.that(*).does.not.throw(*)` should fail if the defined exception is thrown ': function () {
				assertFails(function () {
					Assert.that(function () { throw new Error() }).does.not.throw(Error);
				}, 'Assert.not.throws - expected: Error not thrown found: Error was thrown');
			}
		})

	];

	for (var fixture in fixtures) {
		var handler = new HtmlTestHandler()
		new TestRunner(fixtures[fixture]).run(handler);
	}

});