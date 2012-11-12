loadResources('TestFixture.js', 'assertions.js', 'TestRunner.js', 'ConsoleTestHandler.js', 'HtmlTestHandler.js', function () {

	var fixtures = [

		new TestFixture('assert.true', {
			'assert.true should pass': function () {
				assert.true(true);
			},
			'assert.true should fail without reason': function () {
				assert.true(false);
			},
			'assert.true should fail with custom reason': function () {
				assert.true(false, 'because this checks assert.true(false)');
			}
		}),

		new TestFixture('assert.false', {
			'assert.false should pass': function () {
				assert.false(false);
			},
			'assert.false should fail without reason': function () {
				assert.false(true);
			},
			'assert.false should fail with custom reason': function () {
				assert.false(true, 'because this checks assert.false(true)');
			}
		}),

		new TestFixture('assert.null', {
			'assert.null should pass': function () {
				assert.null(null);
			},
			'assert.null should fail with generated reason': function () {
				assert.null('not null');
			},
			'assert.null should fail with custom reason': function () {
				assert.null('not null', 'because this checks a non-`null` string for `null`');
			}
		}),

		new TestFixture('assert.not.null', {
			'assert.not.null should pass': function () {
				assert.not.null('not null');
			},
			'assert.not.null should fail with generated reason': function () {
				assert.not.null(null);
			},
			'assert.not.null should fail with custom reason': function () {
				assert.not.null(null, 'because this checks `null` for not `null`');
			}
		}),

		new TestFixture('assert.equal', {
			'assert.equal should pass': function () {
				assert.equal('a', "a");
			},
			'assert.equal should fail with generated reason': function () {
				assert.equal(1, 2);
			},
			'assert.equal should fail with generated reason including types': function () {
				assert.equal(1, '1');
			},
			'assert.equal should fail with custom reason': function () {
				assert.equal(1, true, 'because "1" and "true" are only equal with type-conversion, i.e. assert.equiv');
			}
		}),

		new TestFixture('assert.not.equal', {
			'assert.not.equal should pass': function () {
				assert.not.equal('a', "b");
			},
			'assert.not.equal should fail with generated reason': function () {
				assert.not.equal(1, 1);
			},
			'assert.not.equal should fail with custom reason': function () {
				assert.not.equal('a', 'a', 'because \'a\' and \'a\' are exactly equal');
			}
		}),

		new TestFixture('assert.equiv', {
			'assert.equiv should pass': function () {
				assert.equiv(1, "1");
			},
			'assert.equiv should fail with generated reason': function () {
				assert.equiv('a', 'b');
			},
			'assert.equiv should fail with custom reason': function () {
				assert.equiv(0, true, 'because this compares "0" and "true"');
			}
		}),

		new TestFixture('assert.not.equiv', {
			'assert.not.equiv should pass': function () {
				assert.not.equiv(1, "true");
			},
			'assert.not.equiv should fail with generated reason': function () {
				assert.not.equiv('a', "a");
			},
			'assert.not.equiv should fail with custom reason': function () {
				assert.not.equiv(1, true, 'because 1 and true are equivalent');
			}
		}),

		new TestFixture('assert.greater', {
			'assert.greater should pass': function () {
				assert.greater(1, 0);
			},
			'assert.greater should fail with generated reason': function () {
				assert.greater(0, 1);
			},
			'assert.greater should fail with custom reason': function () {
				assert.greater(0, 1, 'because 1 is equal to 1');
			}
		}),

		new TestFixture('assert.less', {
			'assert.less should pass': function () {
				assert.less(0, 1);
			},
			'assert.less should fail with generated reason': function () {
				assert.less(1, 0);
			},
			'assert.less should fail with custom reason': function () {
				assert.less(1, 1, 'because 1 is equal to 1');
			}
		}),

		new TestFixture('assert.instance', {
			'assert.instance should pass': function () {
				assert.instance(new Number(123), Number);
			},
			'assert.instance should fail with generated reason': function () {
				assert.instance('abc', Number);
			},
			'assert.instance should fail with custom reason': function () {
				assert.instance(new Object(), Error, 'because an Object is not an instance of Error');
			}
		}),

		new TestFixture('assert.not.instance', {
			'assert.not.instance should pass': function () {
				assert.not.instance(new Number(123), String);
			},
			'assert.not.instance should fail with generated reason': function () {
				assert.not.instance(new String(), String);
			},
			'assert.not.instance should fail with custom reason': function () {
				assert.not.instance(new Error(), Error, 'because this checks that a `new` Error is an instance of `Error`');
			}
		}),

		new TestFixture('assert.throws', {
			'assert.throws should pass': function () {
				var info = 'fail message';
				var exception = assert.throws(function () { throw new AssertException(info) }, AssertException);
				assert.equal(exception.message, info);
			},
			'assert.throws should fail (when no exception is thrown) with generated reason': function () {
				var exception = assert.throws(function () { }, Error);
			},
			'assert.throws should fail (when a different exception is thrown) with generated reason': function () {
				assert.throws(function () { throw new Error() }, AssertException);
			},
			'assert.throws should fail with custom reason': function () {
				assert.throws(function () { throw new Error() }, AssertException, 'because an Error is thrown in the callback, but an AssertException was expected');
			},
			'assert.equal should fail (using the resulting exception of assert.throws) with generated reason': function () {
				var expectedMsg = 'error message';
				var exception = assert.throws(function () { throw new Error('omgwtfbbq') }, Error);
				assert.equal(exception.message, expectedMsg);
			}
		}),

		new TestFixture('assert.not.throws', {
			'assert.not.throws should pass (when no exception is thrown)': function () {
				assert.not.throws(function () { }, AssertException);
			},
			'assert.not.throws should pass (when a different exception is thrown) with generated reason': function () {
				var exception = assert.not.throws(function () { throw new AssertException() }, Error);
			},
			'assert.not.throws should fail with generated reason': function () {
				assert.not.throws(function () { throw new Error() }, Error);
			},
			'assert.not.throws should fail with custom reason': function () {
				assert.not.throws(function () { throw new Error() }, Error, 'because this asserts against an Error being thrown in the callback, but an Error was thrown');
			}
		})

	];


	for (var f in fixtures) {
		var f = fixtures[f];
		var t = new TestRunner(f);
		t.run(new ConsoleTestHandler());
		t.run(new HtmlTestHandler());
	}

});
