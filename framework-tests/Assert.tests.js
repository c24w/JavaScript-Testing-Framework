JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert;
		var TestCase = JTF.TestCase;
		var genericFailMsg = 'Should fail';
		function TestException(message) { this.message = message }

		function assertPass(assertCollection) {
			Assert.not.throws(assertCollection, Assert.AssertException);
		}

		function assertFail(assertFunc, exceptionMsg) {
			var exception = Assert.throws(assertFunc, Assert.AssertException);
			var msg = exceptionMsg ? exceptionMsg : genericFailMsg;
			Assert.equal(exception.message, msg);
		}

		var fixtures = [

			new JTF.TestFixture('Conditions', {
				'Assert.true should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.true)
							.addCase(true)
							.addCase(1 === 1)
					});
				},
				'Assert.true should fail for false conditions': function () {
					assertFail(function () {
						new TestCase(Assert.true)
							.addCase(false, genericFailMsg)
							.addCase(1 === 2, genericFailMsg);
					});
				},
				'Assert.false should pass for false conditions': function () {
					assertPass(function () {
						new TestCase(Assert.false)
							.addCase(false)
							.addCase(1 === 0);
					});
				},
				'Assert.false should fail for false conditions': function () {
					assertFail(function () {
						new TestCase(Assert.false)
							.addCase(true, genericFailMsg)
							.addCase(1 === 1, genericFailMsg);
					});
				},

				'Assert.that(*).is.true() should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(function (subject) {
							Assert.that(subject).is.true();
						})
						.addCase(true)
						.addCase(1 === 1);
					});
				},
				'Assert.that(*).is.true() should fail for false conditions': function () {
					assertFail(function () {
						new TestCase(function (subject) {
							Assert.that(subject).is.true();
						})
						.addCase(false)
						.addCase(1 === 2);
					}, 'no additional information');
				},
				'Assert.that(*).is.false() should pass for false conditions': function () {
					assertPass(function () {
						new TestCase(function (subject) {
							Assert.that(subject).is.false();
						})
						.addCase(false)
						.addCase(1 === 2);
					});
				},
				'Assert.that(*).is.false() should fail for false conditions': function () {
					assertFail(function () {
						new TestCase(function (subject) {
							Assert.that(subject).is.false();
						})
						.addCase(true)
						.addCase(1 === 1);
					}, 'no additional information');
				}
			}),

			new JTF.TestFixture('null checks', {
				'Assert.null should pass for true conditions': function () {
					assertPass(function () {
						Assert.null(null);
					});
				},
				'Assert.null should fail for false conditions': function () {
					new TestCase(function (subject, msg) {
						assertFail(function () {
							Assert.null(subject, msg);
						})
					})
					.addCase(1, genericFailMsg)
					.addCase(true, genericFailMsg)
					.addCase('not null', genericFailMsg);
				},
				'Assert.not.null should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.not.null)
							.addCase(1)
							.addCase(true)
							.addCase('not null');
					});
				},
				'Assert.not.null should fail for false conditions': function () {
					assertFail(function () {
						Assert.not.null(null, genericFailMsg)
					});
				},

				'Assert.that(*).is.null() should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(null).is.null()
					});
				},
				'Assert.that(*).is.null() should fail for false conditions': function () {
					new TestCase(function (subject) {
						assertFail(function () {
							Assert.that(subject).is.null();
						}, 'Assert.null - argument was not null')
					})
					.addCase(1)
					.addCase(true)
					.addCase('not null');
				},
				'Assert.that(*).is.not.null() should pass for true conditions': function () {
					new TestCase(function (subject) {
						assertPass(function () {
							Assert.that(subject).is.not.null();
						}, 'Assert.not.null - argument was null')
					})
					.addCase(1)
					.addCase(true)
					.addCase('not null');
				},
				'Assert.that(*).is.not.null() should fail for false conditions': function () {
					new TestCase(function (subject) {
						assertFail(function () {
							Assert.that(subject).is.not.null();
						})
					})
				}

			}),

			new JTF.TestFixture('Equality', {
				'Assert.equal should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.equal)
						addCase(1, 1)
						addCase('abc', 'abc')
						addCase(true, true);
					});
				},
				'Assert.equal should fail for false conditions': function () {
					new TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.equal(data1, data2, genericFailMsg);
							});
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				},
				'Assert.equiv should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.equiv)
							.addCase(true, 1)
							.addCase(false, "0")
							.addCase('1', 1);
					});
				},
				'Assert.equiv should fail for false conditions': function () {
					new TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.equiv(data1, data2, genericFailMsg);
							});
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				},

				'Assert.that(*).equals(*) should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(function (data1, data2) {
							Assert.that(data1).equals(data2)
						})
						.addCase(1, 1)
						.addCase('abc', "abc")
						.addCase(true, true);
					});
				},
				'Assert.that(*).equals(*) should fail for false conditions': function () {
					new TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.that(data1).equals(data2);
							}, 'Assert.equal - expected: {0} found: {1}'.format(data2, data1));
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				},
				'Assert.that(*).is.equiv.to(*) should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(function (data1, data2) {
							Assert.that(data1).is.equiv.to(data2);
						})
						.addCase(true, 1)
						.addCase(false, "0")
						.addCase('1', 1);
					});
				},
				'Assert.that(*).is.equiv.to(*) should fail for false conditions': function () {
					new TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.that(data1).is.equiv.to(data2);
							}, 'Assert.equiv - expected: {0} found: {1}'.format(data2, data1));
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				}
			}),

			new JTF.TestFixture('Assert.greater', {
				'Assert.greater should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.greater)
							.addCase(1, 0)
							.addCase(1, 0.5)
							.addCase(1, -1);
					});
				},
				'Assert.greater should fail for false conditions': function () {
					new TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.greater(data1, data2, genericFailMsg);
						});
					})
					.addCase(0, 1)
					.addCase(0.5, 1)
					.addCase(-1, 1);
				},
				'Assert.greater should fail for non-numeric first value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.greater(data, 1, genericFailMsg);
						}, 'Assert.greater - first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.greater should fail for non-numeric second value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.greater(1, data, genericFailMsg);
						}, 'Assert.greater - second argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},

				'Assert.that(*).is.greater.than(*) should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(1).is.greater.than(0);
						Assert.that(1).is.greater.than(0.5);
						Assert.that(1).is.greater.than(-1);
					});
				},
				'Assert.that(*).is.greater.than(*) should fail for false conditions': function () {
					assertFail(function () {
						Assert.that(0).is.greater.than(1);
					}, 'Assert.greater - 0 is not greater than 1');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric first value': function () {
					assertFail(function () {
						Assert.that(false).is.greater.than(1);
					}, 'Assert.greater - first argument: expected: number found: boolean');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric second value': function () {
					assertFail(function () {
						Assert.that(2).is.greater.than('one');
					}, 'Assert.greater - second argument: expected: number found: string');
				}

			}),

			new JTF.TestFixture('Assert.less', {

				'Assert.less should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(Assert.less)
							.addCase(0, 1)
							.addCase(0.5, 1)
							.addCase(-1, 1);
					});
				},
				'Assert.less should fail for false conditions': function () {
					new TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.less(data1, data2, genericFailMsg);
						})
					})
					.addCase(1, 0)
					.addCase(1, 0.5)
					.addCase(1, -1);
				},
				'Assert.less should fail for non-numeric first value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.less(data, 1, genericFailMsg);
						}, 'Assert.less - first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.less should fail for non-numeric second value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.less(1, data, genericFailMsg);
						}, 'Assert.less - second argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},

				'Assert.that(*).is.less.than(*) should pass for true conditions': function () {
					assertPass(function () {
						new TestCase(function (data1, data2) {
							Assert.that(data1).is.less.than(data2);
							Assert.that(data1).is.less.than(data2);
							Assert.that(data1).is.less.than(data2);
						})
						.addCase(0, 1)
						.addCase(0.5, 1)
						.addCase(-1, 1);
					});
				},
				'Assert.that(*).is.less.than(*) should fail for false conditions': function () {
					new TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.that(data1).is.less.than(data2);
						}, 'Assert.less - {0} is not less than {1}'.format(data1, data2));
					})
					.addCase(1, 0)
					.addCase(1, 0.5)
					.addCase(1, -1);
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric first value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.that(data).is.less.than(1);
						}, 'Assert.less - first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric second value': function () {
					new TestCase(function (data, type) {
						assertFail(function () {
							Assert.that(1).is.less.than(data);
						}, 'Assert.less - second argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
			}),

			new JTF.TestFixture('Object types / instances', {
				'Assert.instance should pass for true conditions': function () {
					assertPass(function () {
						Assert.instance(new TestException(), TestException);
						Assert.instance(new Object(), Object);
						Assert.instance('hello', String);
						Assert.instance(1, Number);
					});

				},
				'Assert.instance should fail for false conditions': function () {
					assertFail(function () {
						Assert.instance(1, String, genericFailMsg);
					});
				},
				'Assert.not.instance should pass for true conditions': function () {
					assertPass(function () {
						Assert.not.instance(new Error(), TestException);
						Assert.not.instance(new Object(), Number);
						Assert.not.instance(1, String);
						Assert.not.instance('', Boolean);
						Assert.not.instance(true, Number);
					});
				},
				'Assert.not.instance should fail for false conditions': function () {
					assertFail(function () {
						Assert.not.instance('hello', String, genericFailMsg);
					});
				},

				'Assert.that(*).is.instance.of(*) should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(new TestException()).is.instance.of(TestException);
						Assert.that(new Object()).is.instance.of(Object);
						Assert.that('hello').is.instance.of(String);
						Assert.that(1).is.instance.of(Number);
						Assert.that(true).is.instance.of(Boolean);
					});
				},
				'Assert.that(*).is.instance.of(*) should fail for false conditions': function () {
					assertFail(function () {
						Assert.that(1).is.instance.of(String);
					}, 'Assert.instance - expected: String found: Number');
				},
				'Assert.that(*).is.not.instance.of(*) should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(new Error()).is.not.instance.of(TestException);
						Assert.that(new Object()).is.not.instance.of(Number);
					});
				},
				'Assert.that(*).is.not.instance.of(*) should fail for false conditions': function () {
					assertFail(function () {
						Assert.that('hello').is.not.instance.of(String);
					}, 'Assert.not.instance - expected: not String found: String');
				},

				'Assert.type should pass for true conditions': function () {
					assertPass(function () {
						Assert.type(TestException, 'function');
						Assert.type(new TestException(), 'object');
						Assert.type(null, 'object');
						Assert.type('hello', 'string');
						Assert.type(1, 'number');
						Assert.type(true, 'boolean');
						var undefinedVariable;
						Assert.type(undefinedVariable, 'undefined');
					});
				},
				'Assert.type should fail for false conditions': function () {
					assertFail(function () {
						Assert.type(1, 'string', genericFailMsg);
					});
				},
				'Assert.not.type should pass for true conditions': function () {
					assertPass(function () {
						Assert.not.type(TestException, 'object');
						Assert.not.type(new TestException(), 'function');
						Assert.not.type(null, 'string');
						Assert.not.type('hello', 'number');
						Assert.not.type(1, 'boolean');
						Assert.not.type(true, 'object');
						var undefinedVariable;
						Assert.not.type(undefinedVariable, 'function');
					});
				},
				'Assert.not.type should fail for false conditions': function () {
					assertFail(function () {
						Assert.not.type(1, 'number', genericFailMsg);
					});
				},

				'Assert.that(*).is.type(*) should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(TestException).is.type('function');
						Assert.that(new TestException()).is.type('object');
						Assert.that(null).is.type('object');
						Assert.that('hello').is.type('string');
						Assert.that(1).is.type('number');
						Assert.that(true).is.type('boolean');
						var undefinedVariable;
						Assert.that(undefinedVariable).is.type('undefined');
					});
				},
				'Assert.that(*).is.type(*) should fail for false conditions': function () {
					assertFail(function () {
						Assert.that(1).is.type('string');
					}, 'Assert.type - expected: string found: number');
				},
				'Assert.that(*).is.not.type(*) should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(TestException).is.not.type('object');
						Assert.that(new TestException()).is.not.type('function');
						Assert.that(null).is.not.type('string');
						Assert.that('hello').is.not.type('number');
						Assert.that(1).is.not.type('boolean');
						Assert.that(true).is.not.type('object');
						var undefinedVariable;
						Assert.that(undefinedVariable).is.not.type('function');
					});
				},
				'Assert.that(*).is.not.type(*) should fail for false conditions': function () {
					assertFail(function () {
						Assert.that(1).is.not.type('number');
					}, 'Assert.type - expected: not number found: number');
				}
			}),

			new JTF.TestFixture('Assert.throws specific exception', {
				'Assert.throws should pass if the defined exception is thrown': function () {
					assertPass(function () {
						Assert.throws(function () { throw new TestException() }, TestException);
					});
				},
				'Assert.throws should fail if the defined exception is not thrown': function () {
					assertFail(function () {
						Assert.throws(function () { }, TestException, genericFailMsg);
					});
				},
				'Assert.throws should fail if the wrong exception is thrown': function () {
					assertFail(function () {
						Assert.throws(function () { throw new Error() }, TestException, genericFailMsg);
					});
				},
				'Assert.throws should return the defined exception, if thrown': function () {
					var exception = Assert.throws(function () { throw new TestException(genericFailMsg) }, TestException);
					Assert.equal(exception.message, genericFailMsg);
				},

				'Assert.that(*).throws(*) should pass if the defined exception is thrown': function () {
					assertPass(function () {
						Assert.that(function () { throw new TestException() }).throws(TestException);
					});
				},
				'Assert.that(*).throws(*) should fail if the defined exception is not thrown': function () {
					assertFail(function () {
						Assert.that(function () { }).throws(TestException);
					}, 'TestException was never thrown');
				},
				'Assert.that(*).throws(*) should fail if the wrong exception is thrown': function () {
					assertFail(function () {
						Assert.that(function () { throw new Error() }).throws(TestException);
					}, 'Assert.throws - expected: TestException found: Error');
				},
				'Assert.that(*).throws(*) should return the defined exception, if thrown': function () {
					assertPass(function () {
						var exception = Assert.that(function () { throw new TestException(genericFailMsg) }).throws(TestException);
						Assert.that(exception.message).equals(genericFailMsg);
					});
				},
			}),

			new JTF.TestFixture('Assert.throws any exception', {
				'Assert.throws should pass if any exception is thrown': function () {
					assertPass(function () {
						Assert.throws(function () { throw new TestException() });
					});
				},
				'Assert.throws should fail if no exception is thrown': function () {
					assertFail(function () {
						Assert.throws(function () { }, genericFailMsg);
					});
				},
				'Assert.throws should return any thrown exception': function () {
					var exception = Assert.throws(function () { throw new TestException(genericFailMsg) });
					Assert.instance(exception, TestException);
					Assert.equal(exception.message, genericFailMsg);
				},

				'Assert.that(*).throws() should pass if any exception is thrown': function () {
					assertPass(function () {
						Assert.that(function () { throw new TestException() }).throws();
					});
				},
				'Assert.that(*).throws() should fail if no exception is thrown': function () {
					assertFail(function () {
						Assert.that(function () { }).throws();
					}, "no exceptions were thrown");
				},
				'Assert.that(*).throws() should return any thrown exception': function () {
					var exception = Assert.that(function () { throw new TestException(genericFailMsg) }).throws();
					Assert.instance(exception, TestException);
					Assert.equal(exception.message, genericFailMsg);
				},
			}),

			new JTF.TestFixture('Assert.not.throws specific exception', {
				'Assert.not.throws should pass if the defined exception is not thrown': function () {
					assertPass(function () {
						Assert.not.throws(function () { }, Error)
					});
				},
				'Assert.not.throws should pass if a different type of exception is thrown': function () {
					assertPass(function () {
						Assert.not.throws(function () { throw new TestException() }, Error)
					});
				},
				'Assert.not.throws should fail if the defined exception is thrown': function () {
					assertFail(function () {
						Assert.not.throws(function () { throw new Error() }, Error, genericFailMsg);
					});
				},

				'Assert.that(*).does.not.throw(*) should pass if the defined exception is not thrown': function () {
					assertPass(function () {
						Assert.that(function () { }).does.not.throw(Error);
					});
				},
				'Assert.that(*).does.not.throw(*) should pass if a different type of exception is thrown': function () {
					assertPass(function () {
						Assert.that(function () { throw new TestException() }).does.not.throw(Error);
					});
				},
				'Assert.that(*).does.not.throw(*) should fail if the defined exception is thrown ': function () {
					assertFail(function () {
						Assert.that(function () { throw new Error() }).does.not.throw(Error);
					}, 'Assert.not.throws - expected: Error not thrown found: Error was thrown');
				}
			}),

			new JTF.TestFixture('Assert.not.throws any exception', {
				'Assert.not.throws should pass if no exception is thrown': function () {
					assertPass(function () {
						Assert.not.throws(function () { })
					});
				},
				'Assert.not.throws should fail if any exception is thrown': function () {
					assertFail(function () {
						Assert.not.throws(function () { throw new Error() }, genericFailMsg);
					});
				},

				'Assert.that(*).does.not.throw() should pass if no exception is thrown': function () {
					assertPass(function () {
						Assert.that(function () { }).does.not.throw();
					});
				},
				'Assert.that(*).does.not.throw() should fail if any exception is thrown ': function () {
					assertFail(function () {
						Assert.that(function () { throw new Error() }).does.not.throw();
					}, 'Assert.not.throws - expected: exceptions were thrown found: Error was thrown');
				}
			})

		];

		var handler = new JTF.HTML.TestHandler({
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPasses: true,
			notifyOnFail: false,
			runInterval: 10000
		})

		new JTF.TestRunner.Batch(fixtures).run(handler);

	});
});