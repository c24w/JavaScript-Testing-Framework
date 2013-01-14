JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert;
		var genericFailMsg = 'should fail';
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

			new JTF.TestFixture('Invalid method calls', {
				'Assert.true should fail with the expected message when invalid arguments are supplied': function (TestCase) {
					assertFail(function () {
						TestCase(Assert.true)
							.addCase()
							.addCase('optional message but no condition');
					}, 'no assert condition found');
					assertFail(function () {
						Assert.true(null);
					}, 'assert condition was null');
				},

				'Assert.equal should fail with the expected message when invalid arguments are supplied': function (TestCase) {
					assertFail(function () {
						TestCase(Assert.equal)
							.addCase()
							.addCase(1);
					}, 'expected at least 2 arguments');
				},

				'Assert.equiv should fail with the expected message when invalid arguments are supplied': function (TestCase) {
					assertFail(function () {
						TestCase(Assert.equiv)
							.addCase()
							.addCase(1);
					}, 'expected at least 2 arguments');
				}
			}),

			new JTF.TestFixture('Conditions', {
				'Assert.true should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (bool) {
							Assert.true(bool);
							Assert.that(bool).is.true();
						})
						.addCase(true)
						.addCase('hi' == "hi")
						.addCase(1 === 1);
					});
				},
				'Assert.true should fail for false conditions': function (TestCase) {
					TestCase(function (bool) {
						assertFail(function () { Assert.true(bool, genericFailMsg) });
						assertFail(function () { Assert.that(bool).is.true(); }, Assert.DEFAULT_FAIL_MESSAGE);
					})
					.addCase(false)
					.addCase('hi' == "hello")
					.addCase(1 === 2);
				},
				'Assert.false should pass for false conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (bool) {
							Assert.false(bool);
							Assert.that(bool).is.false();
						})
						.addCase(false)
						.addCase('hi' == "hello")
						.addCase(1 === 0);
					});
				},
				'Assert.false should fail for false conditions': function (TestCase) {
					TestCase(function (bool) {
						assertFail(function () { Assert.false(bool, genericFailMsg); });
						assertFail(function () { Assert.that(bool).is.false(); });
					})
					.addCase(true)
					.addCase('hi' == "hi")
					.addCase(1 === 1);
				}
			}),

			new JTF.TestFixture('null checks', {
				'Assert.null should pass for true conditions': function () {
					assertPass(function () {
						Assert.null(null);
					});
				},
				'Assert.null should fail for false conditions': function (TestCase) {
					TestCase(function (subject, msg) {
						assertFail(function () {
							Assert.null(subject, msg);
						})
					})
					.addCase(1, genericFailMsg)
					.addCase(true, genericFailMsg)
					.addCase('not null', genericFailMsg);
				},
				'Assert.not.null should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.not.null)
							.addCase(1)
							.addCase(true)
							.addCase('not null');
					});
				},
				'Assert.not.null should fail for false conditions': function (TestCase) {
					assertFail(function () {
						Assert.not.null(null, genericFailMsg)
					});
				},

				'Assert.that(*).is.null() should pass for true conditions': function () {
					assertPass(function () {
						Assert.that(null).is.null()
					});
				},
				'Assert.that(*).is.null() should fail for false conditions': function (TestCase) {
					TestCase(function (subject, type) {
						assertFail(function () {
							Assert.that(subject).is.null();
						}, 'expected: null found: {0}({1})'.format(type, subject))
					})
					.addCase(1, 'Number')
					.addCase(true, 'Boolean')
					.addCase('not null', 'String');
				},
				'Assert.that(*).is.not.null() should pass for true conditions': function (TestCase) {
					TestCase(function (subject) {
						assertPass(function () {
							Assert.that(subject).is.not.null();
						}, 'argument was null')
					})
					.addCase(1)
					.addCase(true)
					.addCase('not null');
				},
				'Assert.that(*).is.not.null() should fail for false conditions': function (TestCase) {
					TestCase(function (subject) {
						assertFail(function () {
							Assert.that(subject).is.not.null();
						})
					})
				}

			}),

			new JTF.TestFixture('Equality', {
				'Assert.equal should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.equal)
						.addCase(1, 1)
						.addCase('abc', "abc")
						.addCase(true, true);
					});
				},
				'Assert.equal should fail for false conditions': function (TestCase) {
					TestCase(
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

				'Assert.not.equal should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.not.equal)
						.addCase(true, false)
						.addCase(1, 2)
						.addCase('hi', 'bye');
					});
				},
				'Assert.not.equal should fail for false conditions': function (TestCase) {
					TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.not.equal(data1, data2, genericFailMsg);
							});
						}
					)
					.addCase(1, 1)
					.addCase('abc', "abc")
					.addCase(true, true);
				},

				'Assert.that(*).equals(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).equals(data2)
						})
						.addCase(1, 1)
						.addCase('abc', "abc")
						.addCase(true, true);
					});
				},
				'Assert.that(*).equals(*) should fail for false conditions': function (TestCase) {
					TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.that(data1).equals(data2);
							}, 'expected: {0} found: {1}'.format(data2, data1));
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				},

				'Assert.that(*).does.not.equal(*) / Assert.that(*).is.not.equal.to(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).does.not.equal(data2);
							Assert.that(data1).is.not.equal.to(data2);
						})
						.addCase(true, false)
						.addCase(1, 2)
						.addCase('hi', 'bye');
					});
				},
				'Assert.that(*).does.not.equal(*) / Assert.that(*).is.not.equal.to(*) should fail for false conditions': function (TestCase) {
					TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.that(data1).does.not.equal(data2);
								Assert.that(data1).is.not.equal.to(data2);
							}, 'expected: not {0} found: {1}'.format(data2, data1));
						}
					)
					.addCase(1, 1)
					.addCase('abc', "abc")
					.addCase(true, true);
				}
			}),

			new JTF.TestFixture('Equivalence', {
				'Assert.equiv should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.equiv)
							.addCase(true, 1)
							.addCase(false, "0")
							.addCase('1', 1);
					});
				},
				'Assert.equiv should fail for false conditions': function (TestCase) {
					TestCase(
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

				'Assert.that(*).is.equiv.to(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).is.equiv.to(data2);
						})
						.addCase(true, 1)
						.addCase(false, "0")
						.addCase('1', 1);
					});
				},
				'Assert.that(*).is.equiv.to(*) should fail for false conditions': function (TestCase) {
					TestCase(
						function (data1, data2) {
							assertFail(function () {
								Assert.that(data1).is.equiv.to(data2);
							}, 'expected: {0} found: {1}'.format(data2, data1));
						}
					)
					.addCase(true, false)
					.addCase(1, 2)
					.addCase('hi', 'bye');
				}
			}),

			new JTF.TestFixture('Assert.greater', {
				'Assert.greater should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.greater)
							.addCase(1, 0)
							.addCase(1, 0.5)
							.addCase(1, -1);
					});
				},
				'Assert.greater should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.greater(data1, data2, genericFailMsg);
						});
					})
					.addCase(0, 1)
					.addCase(0.5, 1)
					.addCase(-1, 1);
				},
				'Assert.greater should fail for non-numeric first value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.greater(data, 1, genericFailMsg);
						}, 'first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.greater should fail for non-numeric second value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.greater(1, data, genericFailMsg);
						}, 'second argument: expected: number found: ' + type);
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
					}, '0 is not greater than 1');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric first value': function () {
					assertFail(function () {
						Assert.that(false).is.greater.than(1);
					}, 'first argument: expected: number found: boolean');
				},
				'Assert.that(*).is.greater.than(*) should fail for non-numeric second value': function () {
					assertFail(function () {
						Assert.that(2).is.greater.than('one');
					}, 'second argument: expected: number found: string');
				}

			}),

			new JTF.TestFixture('Assert.less', {

				'Assert.less should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.less)
							.addCase(0, 1)
							.addCase(0.5, 1)
							.addCase(-1, 1);
					});
				},
				'Assert.less should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.less(data1, data2, genericFailMsg);
						})
					})
					.addCase(1, 0)
					.addCase(1, 0.5)
					.addCase(1, -1);
				},
				'Assert.less should fail for non-numeric first value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.less(data, 1, genericFailMsg);
						}, 'first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.less should fail for non-numeric second value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.less(1, data, genericFailMsg);
						}, 'second argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},

				'Assert.that(*).is.less.than(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).is.less.than(data2);
							Assert.that(data1).is.less.than(data2);
							Assert.that(data1).is.less.than(data2);
						})
						.addCase(0, 1)
						.addCase(0.5, 1)
						.addCase(-1, 1);
					});
				},
				'Assert.that(*).is.less.than(*) should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.that(data1).is.less.than(data2);
						}, '{0} is not less than {1}'.format(data1, data2));
					})
					.addCase(1, 0)
					.addCase(1, 0.5)
					.addCase(1, -1);
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric first value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.that(data).is.less.than(1);
						}, 'first argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
				'Assert.that(*).is.less.than(*) should fail for non-numeric second value': function (TestCase) {
					TestCase(function (data, type) {
						assertFail(function () {
							Assert.that(1).is.less.than(data);
						}, 'second argument: expected: number found: ' + type);
					})
					.addCase(false, 'boolean')
					.addCase('hi', 'string')
					.addCase(null, 'null');
				},
			}),

			new JTF.TestFixture('Assert.instance', {
				'Assert.instance should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.instance)
							.addCase(new TestException(), TestException)
							.addCase(new Object(), Object)
							.addCase('hello', String)
							.addCase(1, Number);
					});

				},
				'Assert.instance should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.instance(data1, data2, genericFailMsg);
						});
					})
					.addCase(1, String)
					.addCase('hello', Number)
					.addCase(new Object(), TestException);
				},
				'Assert.not.instance should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.not.instance)
							.addCase(new Error(), TestException)
							.addCase(new Object(), Number)
							.addCase(1, String)
							.addCase('', Boolean)
							.addCase(true, Number);
					});
				},
				'Assert.not.instance should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2) {
						assertFail(function () {
							Assert.not.instance(data1, data2, genericFailMsg);
						});
					})
					.addCase(new TestException(), TestException)
					.addCase(new Object(), Object)
					.addCase('hello', String)
					.addCase(1, Number);
				},

				'Assert.that(*).is.instance.of(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).is.instance.of(data2);
						})
						.addCase(new TestException(), TestException)
						.addCase(new Object(), Object)
						.addCase('hello', String)
						.addCase(1, Number)
						.addCase(true, Boolean);
					});
				},
				'Assert.that(*).is.instance.of(*) should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2, type1, type2) {
						assertFail(function () {
							Assert.that(data1).is.instance.of(data2);
						}, 'expected: {0} found: {1}'.format(type2, type1));
					})
					.addCase(1, String, 'Number', 'String')
					.addCase('hi', Number, 'String', 'Number')
					.addCase(true, Object, 'Boolean', 'Object');
				},
				'Assert.that(*).is.not.instance.of(*) should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(function (data1, data2) {
							Assert.that(data1).is.not.instance.of(data2);
						})
						.addCase(new Error(), TestException)
						.addCase(new Object(), Number)
						.addCase(1, String)
						.addCase('', Boolean)
						.addCase(true, Number)
					});
				},
				'Assert.that(*).is.not.instance.of(*) should fail for false conditions': function (TestCase) {
					TestCase(function (data1, data2, type) {
						assertFail(function () {
							Assert.that(data1).is.not.instance.of(data2);
						}, 'expected: not {0} found: {0}'.format(type));
					})
					.addCase(new TestException(), TestException, 'TestException')
					.addCase(new Object(), Object, 'Object')
					.addCase('hello', String, 'String')
					.addCase(1, Number, 'Number');
				}

			}),

			new JTF.TestFixture('Assert.type', {
				'Assert.type should pass for true conditions': function (TestCase) {
					assertPass(function () {
						TestCase(Assert.type)
							.addCase(TestException, 'function')
							.addCase(new TestException(), 'object')
							.addCase(null, 'object')
							.addCase('hello', 'string')
							.addCase(1, 'number')
							.addCase(true, 'boolean')
							.addCase(undefined, 'undefined');
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
					}, 'expected: string found: number');
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
					}, 'expected: not number found: number');
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
					}, 'expected: TestException found: Error');
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
					}, 'Error was thrown');
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
					}, 'exceptions were thrown');
				}
			})

		];

		var config = {
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			showPassedFixtures: true,
			notifyOnFail: false,
			runInterval: 10000
		};

		JTF.runToHtml(fixtures, config);

	});
});