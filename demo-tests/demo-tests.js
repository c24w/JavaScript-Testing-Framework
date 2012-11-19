JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {
		JTF.loadConsoleResources(function () {

			function DemoException(message) { this.message = message };

			var fixtures = [

				new TestFixture('Assert.true', {
					'Should pass': function () {
						JTF.Assert.true(true);
					},
					'Should fail without reason': function () {
						JTF.Assert.true(false);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.true(false, 'because this checks JTF.Assert.true(false)');
					}
				}),

				new TestFixture('.false', {
					'Should pass': function () {
						JTF.Assert.false(false);
					},
					'Should fail without reason': function () {
						JTF.Assert.false(true);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.false(true, 'because this checks JTF.Assert.false(true)');
					}
				}),

				new TestFixture('Assert.null', {
					'Should pass': function () {
						JTF.Assert.null(null);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.null('not null');
					},
					'Should fail with custom reason': function () {
						JTF.Assert.null('not null', 'because this checks a non-null string for null');
					}
				}),

				new TestFixture('Assert.not.null', {
					'Should pass': function () {
						JTF.Assert.not.null('not null');
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.null(null);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.null(null, 'because this checks null for not null');
					}
				}),

				new TestFixture('Assert.equal', {
					'Should pass': function () {
						JTF.Assert.equal('a', "a");
					},
					'Should fail with generated reason': function () {
						JTF.Assert.equal(1, 2);
					},
					'Should fail with generated reason including types': function () {
						JTF.Assert.equal(1, '1');
					},
					'Should fail with custom reason': function () {
						JTF.Assert.equal(1, true, 'because "1" and "true" are only equal with type-conversion, i.e. JTF.Assert.equiv');
					}
				}),

				new TestFixture('Assert.not.equal', {
					'Should pass': function () {
						JTF.Assert.not.equal('a', "b");
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.equal(1, 1);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.equal('a', 'a', 'because \'a\' and \'a\' are exactly equal');
					}
				}),

				new TestFixture('Assert.equiv', {
					'Should pass': function () {
						JTF.Assert.equiv(1, "1");
					},
					'Should fail with generated reason': function () {
						JTF.Assert.equiv('a', 'b');
					},
					'Should fail with custom reason': function () {
						JTF.Assert.equiv(0, true, 'because this compares "0" and "true"');
					}
				}),

				new TestFixture('Assert.not.equiv', {
					'Should pass': function () {
						JTF.Assert.not.equiv(1, "true");
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.equiv('a', "a");
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.equiv(1, true, 'because 1 and true are equivalent');
					}
				}),

				new TestFixture('Assert.greater', {
					'Should pass': function () {
						JTF.Assert.greater(1, 0);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.greater(0, 1);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.greater(0, 1, 'because 1 is equal to 1');
					}
				}),

				new TestFixture('Assert.less', {
					'Should pass': function () {
						JTF.Assert.less(0, 1);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.less(1, 0);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.less(1, 1, 'because 1 is equal to 1');
					}
				}),

				new TestFixture('Assert.instance', {
					'Should pass': function () {
						JTF.Assert.instance(new Number(123), Number);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.instance('abc', Number);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.instance(new Object(), Error, 'because an Object is not an instance of Error');
					}
				}),

				new TestFixture('Assert.not.instance', {
					'Should pass': function () {
						JTF.Assert.not.instance(new Number(123), String);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.instance(new String(), String);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.instance(new Error(), Error, 'because this checks that a new Error is an instance of Error');
					}
				}),

				new TestFixture('Assert.type', {
					'Should pass': function () {
						JTF.Assert.type(new Number(123), 'object');
					},
					'Should fail with generated reason': function () {
						JTF.Assert.type('abc', 'number');
					},
					'Should fail with custom reason': function () {
						JTF.Assert.type(false, 'function', 'because a boolean is not a type of function');
					}
				}),

				new TestFixture('Assert.not.type', {
					'Should pass': function () {
						JTF.Assert.not.type('string', 'number');
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.type(Object, 'function');
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.type(new Object(), 'object', 'because a new Object() is of type \'object\'');
					}
				}),

				new TestFixture('Assert.throws', {
					'Should pass': function () {
						var info = 'fail message';
						var exception = JTF.Assert.throws(function () { throw new DemoException(info) }, DemoException);
						JTF.Assert.equal(exception.message, info);
					},
					'Should fail (when no exception is thrown) with generated reason': function () {
						var exception = JTF.Assert.throws(function () { }, DemoException);
					},
					'Should fail (when a different exception is thrown) with generated reason': function () {
						JTF.Assert.throws(function () { throw new DemoException() }, Error);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.throws(function () { throw new DemoException() }, Error, 'because a DemoException is thrown in the callback, but an Error was expected');
					}
				}),

				new TestFixture('Assert.not.throws', {
					'Should pass (when no exception is thrown)': function () {
						JTF.Assert.not.throws(function () { }, DemoException);
					},
					'Should pass (when a different exception is thrown) with generated reason': function () {
						var exception = JTF.Assert.not.throws(function () { throw new DemoException() }, Error);
					},
					'Should fail with generated reason': function () {
						JTF.Assert.not.throws(function () { throw new DemoException() }, DemoException);
					},
					'Should fail with custom reason': function () {
						JTF.Assert.not.throws(function () { throw new DemoException() }, DemoException, 'because this JTF.Asserts that an DemoException is not thrown in the callback, but an DemoException was thrown');
					}
				}),

				new TestFixture('Composite assertions', {
					'Should pass (using the returned exception from JTF.Assert.throws)': function () {
						var message = 'error message';
						var exception = JTF.Assert.throws(function () { throw new DemoException(message) }, DemoException);
						JTF.Assert.equal(exception.message, message);
					},
					'Should fail (using the returned exception from JTF.Assert.throws) with generated reason': function () {
						var message = 'error message';
						var exception = JTF.Assert.throws(function () { throw new DemoException('omgwtfbbq') }, DemoException);
						JTF.Assert.equal(exception.message, message);
					},
					'Should fail (using the returned exception from JTF.Assert.throws) with custom reason': function () {
						var message = 'error message';
						var exception = JTF.Assert.throws(function () { throw new DemoException('omgwtfbbq') }, DemoException);
						JTF.Assert.equal(exception.message, message, 'because the message from the thrown DemoException doesn\'t match the expected message');
					}
				})

			];

			var runner = new BatchTestRunner(fixtures);
			runner.run(new JTF.Console.TestHandler());
			runner.run(new JTF.Html.TestHandler({ autocollapse: JTF.Html.TestHandlerConfig.autocollapse.none }));

		});
	});
});