loadResources('TestFixture.js', 'assertions.js', 'TestRunner.js', 'ConsoleTestHandler.js', 'HtmlTestHandler.js', function () {

	var fixtures = [

		new TestFixture('Assert.true', {
			'Assert.true should pass': function () {
				Assert.true(true);
			},
			'Assert.true should fail without reason': function () {
				Assert.true(false);
			},
			'Assert.true should fail with custom reason': function () {
				Assert.true(false, 'because this checks Assert.true(false)');
			}
		}),

		new TestFixture('Assert.false', {
			'Assert.false should pass': function () {
				Assert.false(false);
			},
			'Assert.false should fail without reason': function () {
				Assert.false(true);
			},
			'Assert.false should fail with custom reason': function () {
				Assert.false(true, 'because this checks Assert.false(true)');
			}
		}),

		new TestFixture('Assert.null', {
			'Assert.null should pass': function () {
				Assert.null(null);
			},
			'Assert.null should fail with generated reason': function () {
				Assert.null('not null');
			},
			'Assert.null should fail with custom reason': function () {
				Assert.null('not null', 'because this checks a non-`null` string for `null`');
			}
		}),

		new TestFixture('Assert.not.null', {
			'Assert.not.null should pass': function () {
				Assert.not.null('not null');
			},
			'Assert.not.null should fail with generated reason': function () {
				Assert.not.null(null);
			},
			'Assert.not.null should fail with custom reason': function () {
				Assert.not.null(null, 'because this checks `null` for not `null`');
			}
		}),

		new TestFixture('Assert.equal', {
			'Assert.equal should pass': function () {
				Assert.equal('a', "a");
			},
			'Assert.equal should fail with generated reason': function () {
				Assert.equal(1, 2);
			},
			'Assert.equal should fail with generated reason including types': function () {
				Assert.equal(1, '1');
			},
			'Assert.equal should fail with custom reason': function () {
				Assert.equal(1, true, 'because "1" and "true" are only equal with type-conversion, i.e. Assert.equiv');
			}
		}),

		new TestFixture('Assert.not.equal', {
			'Assert.not.equal should pass': function () {
				Assert.not.equal('a', "b");
			},
			'Assert.not.equal should fail with generated reason': function () {
				Assert.not.equal(1, 1);
			},
			'Assert.not.equal should fail with custom reason': function () {
				Assert.not.equal('a', 'a', 'because \'a\' and \'a\' are exactly equal');
			}
		}),

		new TestFixture('Assert.equiv', {
			'Assert.equiv should pass': function () {
				Assert.equiv(1, "1");
			},
			'Assert.equiv should fail with generated reason': function () {
				Assert.equiv('a', 'b');
			},
			'Assert.equiv should fail with custom reason': function () {
				Assert.equiv(0, true, 'because this compares "0" and "true"');
			}
		}),

		new TestFixture('Assert.not.equiv', {
			'Assert.not.equiv should pass': function () {
				Assert.not.equiv(1, "true");
			},
			'Assert.not.equiv should fail with generated reason': function () {
				Assert.not.equiv('a', "a");
			},
			'Assert.not.equiv should fail with custom reason': function () {
				Assert.not.equiv(1, true, 'because 1 and true are equivalent');
			}
		}),

		new TestFixture('Assert.greater', {
			'Assert.greater should pass': function () {
				Assert.greater(1, 0);
			},
			'Assert.greater should fail with generated reason': function () {
				Assert.greater(0, 1);
			},
			'Assert.greater should fail with custom reason': function () {
				Assert.greater(0, 1, 'because 1 is equal to 1');
			}
		}),

		new TestFixture('Assert.less', {
			'Assert.less should pass': function () {
				Assert.less(0, 1);
			},
			'Assert.less should fail with generated reason': function () {
				Assert.less(1, 0);
			},
			'Assert.less should fail with custom reason': function () {
				Assert.less(1, 1, 'because 1 is equal to 1');
			}
		}),

		new TestFixture('Assert.instance', {
			'Assert.instance should pass': function () {
				Assert.instance(new Number(123), Number);
			},
			'Assert.instance should fail with generated reason': function () {
				Assert.instance('abc', Number);
			},
			'Assert.instance should fail with custom reason': function () {
				Assert.instance(new Object(), Error, 'because an Object is not an instance of Error');
			}
		}),

		new TestFixture('Assert.not.instance', {
			'Assert.not.instance should pass': function () {
				Assert.not.instance(new Number(123), String);
			},
			'Assert.not.instance should fail with generated reason': function () {
				Assert.not.instance(new String(), String);
			},
			'Assert.not.instance should fail with custom reason': function () {
				Assert.not.instance(new Error(), Error, 'because this checks that a `new` Error is an instance of `Error`');
			}
		}),

		new TestFixture('Assert.throws', {
			'Assert.throws should pass': function () {
				var info = 'fail message';
				var exception = Assert.throws(function () { throw new AssertException(info) }, AssertException);
				Assert.equal(exception.message, info);
			},
			'Assert.throws should fail (when no exception is thrown) with generated reason': function () {
				var exception = Assert.throws(function () { }, Error);
			},
			'Assert.throws should fail (when a different exception is thrown) with generated reason': function () {
				Assert.throws(function () { throw new Error() }, AssertException);
			},
			'Assert.throws should fail with custom reason': function () {
				Assert.throws(function () { throw new Error() }, AssertException, 'because an Error is thrown in the callback, but an AssertException was expected');
			},
			'Assert.equal should fail (using the resulting exception of Assert.throws) with generated reason': function () {
				var expectedMsg = 'error message';
				var exception = Assert.throws(function () { throw new Error('omgwtfbbq') }, Error);
				Assert.equal(exception.message, expectedMsg);
			}
		}),

		new TestFixture('Assert.not.throws', {
			'Assert.not.throws should pass (when no exception is thrown)': function () {
				Assert.not.throws(function () { }, AssertException);
			},
			'Assert.not.throws should pass (when a different exception is thrown) with generated reason': function () {
				var exception = Assert.not.throws(function () { throw new AssertException() }, Error);
			},
			'Assert.not.throws should fail with generated reason': function () {
				Assert.not.throws(function () { throw new Error() }, Error);
			},
			'Assert.not.throws should fail with custom reason': function () {
				Assert.not.throws(function () { throw new Error() }, Error, 'because this asserts against an Error being thrown in the callback, but an Error was thrown');
			}
		})

	];


	for (var f in fixtures) {
		var f = fixtures[f];
		var t = new TestRunner(f);
		t.run(new ConsoleTestHandler());
		t.run(new HtmlTestHandler({
			autocollapse: htmlTestHandlerConfig.autocollapse.all
		}));
	}

});
