JTF.namespace('Assert', function (Assert) {

	function buildMessage(actual, expected) {
		return 'expected: {0} found: {1}'.format(expected, actual);
	}

	function areTheSameType(obj1, obj2) {
		return typeof obj1 === typeof obj2;
	}

	function encloseInType(obj) {
		if (obj === null || typeof obj === 'undefined') return obj;
		return obj.constructor.name + '(' + obj + ')';
	}

	function AssertThat(subject) {
		var A = Assert;
		var AN = A.not;
		this.throws = function (exception) { return A.throws(subject, exception) },
		this.does = { not: { 'throw': function (exception) { Assert.not.throws(subject, exception) } } },
		this.equals = function (expected) { A.equal(subject, expected) },
		this.is = {
			'true': function () { A.true(subject) },
			'false': function () { A.false(subject) },
			'null': function () { A.null(subject) },
			equiv: { to: function (expected) { A.equiv(subject, expected) } },
			greater: { than: function (expected) { A.greater(subject, expected) } },
			less: { than: function (expected) { A.less(subject, expected) } },
			instance: { of: function (objClass) { A.instance(subject, objClass) } },
			type: function (type) { A.type(subject, type) },
			not: {
				'null': function () { AN.null(subject) },
				equal: { to: function (expected) { AN.equal(subject, expected) } },
				equiv: { to: function (expected) { AN.equiv(subject, expected) } },
				instance: { of: function (objClass) { AN.instance(subject, objClass) } },
				type: function (type) { AN.type(subject, type) },
			}
		}
	}

	function AssertException(message) {
		this.message = message;
	}

	Assert.AssertException = AssertException;

	Assert.DEFAULT_FAIL_MESSAGE = 'no additional information';

	function isUndefined(v) {
		return typeof v === 'undefined';
	}

	Assert.that = function (subject) {
		return new AssertThat(subject);
	};

	Assert['true'] = function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (isUndefined(condition) || (typeof condition === 'string' && !optionalInfo))
			throw new AssertException('no assert condition found');
		if (!condition) {
			var info = optionalInfo || Assert.DEFAULT_FAIL_MESSAGE;
			throw new AssertException(info);
		}
	};

	Assert['false'] = function (condition, optionalInfo) {
		Assert.true(!condition, optionalInfo);
	};

	Assert['null'] = function (subject, optionalInfo) {
		Assert.equal(subject, null, optionalInfo);
	};

	Assert.equal = function (actual, expected, optionalInfo) {
		if (arguments.length === 1)
			throw new AssertException('expected at least 2 arguments');
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo || buildMessage(act, exp);
		Assert.true(actual === expected, info);
	};

	Assert.equiv = function (actual, expected, optionalInfo) {
		if (arguments.length === 1)
			throw new AssertException('expected at least 2 arguments');
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo || buildMessage(act, exp);
		Assert.true(actual == expected, info);
	};

	function assertIsNumber(object, prefix) {
		var actualType = object === null ? 'null' : typeof object;
		Assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, typeof Number(), actualType));
	}

	Assert.greater = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'first argument');
		assertIsNumber(number2, 'second argument');
		var info = optionalInfo || '{0} is not greater than {1}'.format(number1, number2);
		Assert.true(number1 > number2, info);
	};

	Assert.less = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'first argument');
		assertIsNumber(number2, 'second argument');
		var info = optionalInfo || '{0} is not less than {1}'.format(number1, number2);
		Assert.true(number1 < number2, info);
	};

	Assert.instance = function (obj, expectedClass, optionalInfo) {
		var info = optionalInfo || 'first argument was null';
		Assert.not.null(obj, optionalInfo);
		try {
			Assert.true(obj instanceof expectedClass);
		}
		catch (e) {
			var actualClass = obj.constructor.name;
			var shouldBeThisClass = expectedClass.name;
			var info = optionalInfo || buildMessage(actualClass, shouldBeThisClass);
			Assert.equal(actualClass, shouldBeThisClass, info);
		}
	};

	Assert.type = function (obj, type, optionalInfo) {
		var actualType = typeof obj;
		var info = optionalInfo || buildMessage(actualType, type);
		Assert.equal(actualType, type, info);
	};

	Assert.throws = function (func, expectedException, optionalInfo) {
		if (typeof expectedException === 'string' && typeof optionalInfo === 'undefined') {
			optionalInfo = expectedException;
			expectedException = undefined;
		}
		try {
			func();
		}
		catch (e) {
			if (typeof expectedException !== 'undefined') {
				var info = optionalInfo || buildMessage(e.constructor.name, expectedException.name);
				Assert.instance(e, expectedException, info);
			}
			return e;
		}
		var info = optionalInfo || notThrownError(expectedException);
		throw new AssertException(info);
	};

	function notThrownError(exception) {
		return (typeof exception === 'undefined')
			? 'no exceptions were thrown'
			: exception.name + ' was never thrown'
	}

	JTF.namespace('Assert.not', function (AssertNot) {

		AssertNot['null'] = function (subject, optionalInfo) {
			Assert.not.equal(subject, null, optionalInfo);
		};

		AssertNot.equal = function (actual, expected, optionalInfo) {
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo || buildMessage(act, 'not ' + exp);
			Assert.false(actual === expected, info);
		};

		AssertNot.equiv = function (actual, expected, optionalInfo) {
			var info = optionalInfo || buildMessage(encloseInType(actual), encloseInType(expected));
			Assert.false(actual == expected, info);
		};

		AssertNot.instance = function (obj, objClass, optionalInfo) {
			var actualClass = obj.constructor.name;
			var shouldNotBeThisClass = objClass.name;
			var info = optionalInfo || buildMessage(actualClass, 'not ' + shouldNotBeThisClass);
			Assert.not.equal(actualClass, shouldNotBeThisClass, info);
		};

		AssertNot.type = function (obj, type, optionalInfo) {
			var actualType = typeof obj;
			var info = optionalInfo || buildMessage(actualType, 'not ' + type);
			Assert.not.equal(actualType, type, info);
		};

		AssertNot.throws = function (func, unthrownException, optionalInfo) {
			if (typeof unthrownException === 'string' && typeof optionalInfo === 'undefined') {
				optionalInfo = unthrownException;
				unthrownException = undefined;
			}
			try {
				func();
			}
			catch (e) {
				if (typeof unthrownException === 'undefined') {
					throw new AssertException(optionalInfo || 'exceptions were thrown');
				}
				else {
					Assert.not.instance(e, unthrownException, optionalInfo || unthrownException.name + ' was thrown');
				}
			}
		};

	});

});