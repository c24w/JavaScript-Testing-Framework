JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		function TestException(message) { this.message = message }

		var genericFailMsg = 'Should fail';
		var assertException = JTF.Assert.AssertException;

		function assertAllPass(assertCollection) {
			JTF.Assert.not.throws(assertCollection, window.JTF.Assert.AssertException);
		}

		function assertFails(assertFunc, exceptionMsg) {
			var exception = JTF.Assert.throws(assertFunc, window.JTF.Assert.AssertException);
			var msg = exceptionMsg ? exceptionMsg : genericFailMsg;
			JTF.Assert.equal(exception.message, msg);
		}

		var fixtures = [

			new JTF.TestFixture('Conditions', {
				'Assert.true should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.true(true);
						JTF.Assert.true(1 === 1);
					});
				},
				'Assert.true should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.true(false, genericFailMsg)
					});
				},
				'Assert.false should pass for false conditions': function () {
					assertAllPass(function () {
						JTF.Assert.false(false);
						JTF.Assert.false(1 === 0);
					});
				},
				'Assert.false should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.false(true, genericFailMsg)
					});
				},

				'Assert.that(*).is.true() should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(true).is.true;
						JTF.Assert.that(1 === 1).is.true;
					});
				},
				'Assert.that(*).is.true() should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(false).is.true();
					}, 'no additional information');
				},
				'Assert.that(*).is.false() should pass for false conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(false).is.false();
						JTF.Assert.that(1 === 0).is.false();
					});
				},
				'Assert.that(*).is.false() should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(true).is.false();
					}, 'no additional information');
				}
			}),

			new JTF.TestFixture('null checks', {
				'Assert.null should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.null(null)
					});
				},
				'Assert.null should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.null('not null', genericFailMsg)
					});
				},
				'Assert.not.null should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.not.null('not null')
					});
				},
				'Assert.not.null should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.not.null(null, genericFailMsg)
					});
				},

				'Assert.that(*).is.null() should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(null).is.null()
					});
				},
				'Assert.that(*).is.null() should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that('not null', genericFailMsg).is.null()
					}, 'Assert.null - argument was not null');
				},
				'Assert.that(*).is.not.null() should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that('not null').is.not.null()
					});
				},
				'Assert.that(*).is.not.null() should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(null).is.not.null()
					}, 'Assert.not.null - argument was null');
				}
			}),

			new JTF.TestFixture('Equality', {
				'Assert.equal should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.equal(true, true);
						JTF.Assert.equal(1, 1);
						JTF.Assert.equal('abc', 'abc');
						JTF.Assert.equal('abc', "abc");
					});
				},
				'Assert.equal should fail for false conditions': function () {
					assertFails(function () { JTF.Assert.equal(true, false, genericFailMsg) });
				},
				'Assert.equiv should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.equiv(true, 1);
						JTF.Assert.equiv(false, "0");
						JTF.Assert.equiv('1', 1);
					});
				},
				'Assert.equiv should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.equiv(true, false, genericFailMsg);
					});
				},

				'Assert.that(*).equals(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(true).equals(true);
						JTF.Assert.that(1).equals(1);
						JTF.Assert.that('abc').equals('abc');
						JTF.Assert.that('abc').equals("abc");
					});
				},
				'Assert.that(*).equals(*) should fail for false conditions': function () {
					assertFails(function () { JTF.Assert.equal(true, false, genericFailMsg) });
				},
				'Assert.that(*).is.equiv.to(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(true).is.equiv.to(1);
						JTF.Assert.that(false).is.equiv.to("0");
						JTF.Assert.that('1').is.equiv.to(1);
					});
				},
				'Assert.that(*).is.equiv.to(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(true).is.equiv.to(false);
					}, 'Assert.equiv - expected: Boolean(false) found: Boolean(true)');
				}
			}),

			new JTF.TestFixture('Number comparisons', {
				'Assert.greater should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.greater(1, 0);
						JTF.Assert.greater(1, 0.5);
						JTF.Assert.greater(1, -1);
					});
				},
				'Assert.greater should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.greater(0, 1, genericFailMsg)
					});
				},
				'Assert.greater should fail for non-numeric first value': function () {
					assertFails(function () {
						JTF.Assert.greater(false, 1, genericFailMsg)
					}, 'Assert.greater - first argument: expected: number found: boolean');
				},
				'Assert.greater should fail for non-numeric second value': function () {
					assertFails(function () {
						JTF.Assert.greater(2, 'one', genericFailMsg)
					}, 'Assert.greater - second argument: expected: number found: string');
				},

				'Assert.less should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.less(0, 1);
						JTF.Assert.less(0.5, 1);
						JTF.Assert.less(-1, 1);
					});
				},
				'Assert.less should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.less(1, 0, genericFailMsg)
					});
				},
				'Assert.less should fail for non-numeric first value': function () {
					assertFails(function () {
						JTF.Assert.less(false, 1, genericFailMsg)
					}, 'Assert.less - first argument: expected: number found: boolean');
				},
				'Assert.less should fail for non-numeric second value': function () {
					assertFails(function () {
						JTF.Assert.less(2, 'one', genericFailMsg)
					}, 'Assert.less - second argument: expected: number found: string');
				},

				'Assert.that(*).is.greater.than(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(1).is.greater.than(0);
						JTF.Assert.that(1).is.greater.than(0.5);
						JTF.Assert.that(1).is.greater.than(-1);
					});
				},
				'Assert.that(*).is.greater.than(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(0).is.greater.than(1);
					}, 'Assert.greater - 0 is not greater than 1');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric first value': function () {
					assertFails(function () {
						JTF.Assert.that(false).is.greater.than(1);
					}, 'Assert.greater - first argument: expected: number found: boolean');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric second value': function () {
					assertFails(function () {
						JTF.Assert.that(2).is.greater.than('one');
					}, 'Assert.greater - second argument: expected: number found: string');
				},

				'Assert.that(*).is.less.than(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(0).is.less.than(1);
						JTF.Assert.that(0.5).is.less.than(1);
						JTF.Assert.that(-1).is.less.than(1);
					});
				},
				'Assert.that(*).is.less.than(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(1).is.less.than(0);
					}, 'Assert.less - 1 is not less than 0');
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric first value': function () {
					assertFails(function () {
						JTF.Assert.that(false).is.less.than(1);
					}, 'Assert.less - first argument: expected: number found: boolean');
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric second value': function () {
					assertFails(function () {
						JTF.Assert.that(2).is.less.than('one');
					}, 'Assert.less - second argument: expected: number found: string');
				},
			}),

			new JTF.TestFixture('Object types / instances', {
				'Assert.instance should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.instance(new TestException(), TestException);
						JTF.Assert.instance(new Object(), Object);
						JTF.Assert.instance('hello', String);
						JTF.Assert.instance(1, Number);
					});

				},
				'Assert.instance should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.instance(1, String, genericFailMsg);
					});
				},
				'Assert.not.instance should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.not.instance(new Error(), TestException);
						JTF.Assert.not.instance(new Object(), Number);
						JTF.Assert.not.instance(1, String);
						JTF.Assert.not.instance('', Boolean);
						JTF.Assert.not.instance(true, Number);
					});
				},
				'Assert.not.instance should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.not.instance('hello', String, genericFailMsg);
					});
				},

				'Assert.that(*).is.instance.of(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(new TestException()).is.instance.of(TestException);
						JTF.Assert.that(new Object()).is.instance.of(Object);
						JTF.Assert.that('hello').is.instance.of(String);
						JTF.Assert.that(1).is.instance.of(Number);
						JTF.Assert.that(true).is.instance.of(Boolean);
					});
				},
				'Assert.that(*).is.instance.of(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(1).is.instance.of(String);
					}, 'Assert.instance - expected: String found: Number');
				},
				'Assert.that(*).is.not.instance.of(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(new Error()).is.not.instance.of(TestException);
						JTF.Assert.that(new Object()).is.not.instance.of(Number);
					});
				},
				'Assert.that(*).is.not.instance.of(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that('hello').is.not.instance.of(String);
					}, 'Assert.not.instance - expected: not String found: String');
				},

				'Assert.type should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.type(TestException, 'function');
						JTF.Assert.type(new TestException(), 'object');
						JTF.Assert.type(null, 'object');
						JTF.Assert.type('hello', 'string');
						JTF.Assert.type(1, 'number');
						JTF.Assert.type(true, 'boolean');
						var undefinedVariable;
						JTF.Assert.type(undefinedVariable, 'undefined');
					});
				},
				'Assert.type should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.type(1, 'string', genericFailMsg);
					});
				},
				'Assert.not.type should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.not.type(TestException, 'object');
						JTF.Assert.not.type(new TestException(), 'function');
						JTF.Assert.not.type(null, 'string');
						JTF.Assert.not.type('hello', 'number');
						JTF.Assert.not.type(1, 'boolean');
						JTF.Assert.not.type(true, 'object');
						var undefinedVariable;
						JTF.Assert.not.type(undefinedVariable, 'function');
					});
				},
				'Assert.not.type should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.not.type(1, 'number', genericFailMsg);
					});
				},

				'Assert.that(*).is.type(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(TestException).is.type('function');
						JTF.Assert.that(new TestException()).is.type('object');
						JTF.Assert.that(null).is.type('object');
						JTF.Assert.that('hello').is.type('string');
						JTF.Assert.that(1).is.type('number');
						JTF.Assert.that(true).is.type('boolean');
						var undefinedVariable;
						JTF.Assert.that(undefinedVariable).is.type('undefined');
					});
				},
				'Assert.that(*).is.type(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(1).is.type('string');
					}, 'Assert.type - expected: string found: number');
				},
				'Assert.that(*).is.not.type(*) should pass for true conditions': function () {
					assertAllPass(function () {
						JTF.Assert.that(TestException).is.not.type('object');
						JTF.Assert.that(new TestException()).is.not.type('function');
						JTF.Assert.that(null).is.not.type('string');
						JTF.Assert.that('hello').is.not.type('number');
						JTF.Assert.that(1).is.not.type('boolean');
						JTF.Assert.that(true).is.not.type('object');
						var undefinedVariable;
						JTF.Assert.that(undefinedVariable).is.not.type('function');
					});
				},
				'Assert.that(*).is.not.type(*) should fail for false conditions': function () {
					assertFails(function () {
						JTF.Assert.that(1).is.not.type('number');
					}, 'Assert.type - expected: not number found: number');
				}
			}),

			new JTF.TestFixture('Exception handling', {
				'Assert.throws should fail if the defined exception is not thrown': function () {
					assertFails(function () {
						JTF.Assert.throws(function () { }, TestException, genericFailMsg);
					});
				},
				'Assert.throws should fail if the wrong exception is thrown': function () {
					assertFails(function () {
						JTF.Assert.throws(function () { throw new Error() }, TestException, genericFailMsg);
					});
				},
				'Assert.throws should return the defined exception, if thrown': function () {
					var exception = JTF.Assert.throws(function () { throw new TestException(genericFailMsg) }, TestException);
					JTF.Assert.equal(exception.message, genericFailMsg);
				},

				'Assert.not.throws should pass if the defined exception is not thrown': function () {
					assertAllPass(function () {
						JTF.Assert.not.throws(function () { }, Error)
					});
				},
				'Assert.not.throws should pass if a different type of exception is thrown': function () {
					assertAllPass(function () {
						JTF.Assert.not.throws(function () { throw new TestException() }, Error)
					});
				},
				'Assert.not.throws should fail if the defined exception is thrown': function () {
					assertFails(function () {
						JTF.Assert.not.throws(function () { throw new Error() }, Error, genericFailMsg);
					});
				},

				'Assert.that(*).throws(*) should fail if the defined exception is not thrown': function () {
					assertFails(function () {
						JTF.Assert.that(function () { }).throws(TestException);
					}, 'TestException was never thrown');
				},
				'Assert.that(*).throws(*) should fail if the wrong exception is thrown': function () {
					assertFails(function () {
						JTF.Assert.that(function () { throw new Error() }).throws(TestException);
					}, 'Assert.throws - expected: TestException found: Error');
				},
				'Assert.that(*).throws(*) should return the defined exception, if thrown': function () {
					assertAllPass(function () {
						var exception = JTF.Assert.that(function () { throw new TestException(genericFailMsg) }).throws(TestException);
						JTF.Assert.that(exception.message).equals(genericFailMsg);
					});
				},

				'Assert.that(*).does.not.throw(*) should pass if the defined exception is not thrown': function () {
					assertAllPass(function () {
						JTF.Assert.that(function () { }).does.not.throw(Error);
					});
				},
				'Assert.that(*).does.not.throw(*) should pass if a different type of exception is thrown': function () {
					assertAllPass(function () {
						JTF.Assert.that(function () { throw new TestException() }).does.not.throw(Error);
					});
				},
				'Assert.that(*).does.not.throw(*) should fail if the defined exception is thrown ': function () {
					assertFails(function () {
						JTF.Assert.that(function () { throw new Error() }).does.not.throw(Error);
					}, 'Assert.not.throws - expected: Error not thrown found: Error was thrown');
				}
			})

		];

		var handler = new JTF.Html.TestHandler({ showpasses: true, autocollapse: JTF.Html.TestHandlerConfig.autocollapse.passes })
		new BatchTestRunner(fixtures).run(handler);

	});
});