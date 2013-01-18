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
		this.does = {
			not: {
				equal: function (expected) { AN.equal(subject, expected) },
				'throw': function (exception) { AN.throws(subject, exception) }
			}
		},
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
		this.toString = function () { return this.constructor.name + ': ' + this.message; }
	}

	Assert.AssertException = AssertException;

	Assert.DEFAULT_FAIL_MESSAGE = 'no additional information';

	function isUndefined(v) {
		return typeof v === 'undefined';
	}

	function assertArgs(lowerBound, upperBound) {
		var argsLength = arguments.callee.caller.arguments.length;
		if (argsLength < lowerBound)
			throw new Error('assertion expected at least {0} argument{1}'.format(lowerBound, lowerBound === 1 ? '' : 's'));
		if (argsLength > upperBound)
			throw new Error('assertion expected at most {0} argument{1}'.format(upperBound, lowerBound === 1 ? '' : 's'));
	}

	Assert.that = function (subject) {
		return new AssertThat(subject);
	};

	Assert['true'] = function (condition, optionalInfo) {
		assertArgs(1, 2);
		if (condition === null) throw new Error('assert condition was null');
		if (typeof condition !== 'boolean') throw new Error('assert condition was not a boolean');
		if (condition === false) {
			var info = optionalInfo || Assert.DEFAULT_FAIL_MESSAGE;
			throw new AssertException(info);
		}
	};

	Assert['false'] = function (condition, optionalInfo) {
		assertArgs(1, 2);
		if (condition === null) throw new Error('assert condition was null');
		if (typeof condition !== 'boolean') throw new Error('assert condition was not a boolean');
		Assert.true(condition === false, optionalInfo);
	};

	Assert['null'] = function (subject, optionalInfo) {
		assertArgs(1, 2);
		Assert.equal(subject, null, optionalInfo);
	};

	Assert.equal = function (actual, expected, optionalInfo) {
		assertArgs(2, 3);
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo || buildMessage(act, exp);
		Assert.true(actual === expected, info);
	};

	Assert.equiv = function (actual, expected, optionalInfo) {
		assertArgs(2, 3);
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
		assertArgs(2, 3);
		assertIsNumber(number1, 'first argument');
		assertIsNumber(number2, 'second argument');
		var info = optionalInfo || '{0} is not greater than {1}'.format(number1, number2);
		Assert.true(number1 > number2, info);
	};

	Assert.less = function (number1, number2, optionalInfo) {
		assertArgs(2, 3);
		assertIsNumber(number1, 'first argument');
		assertIsNumber(number2, 'second argument');
		var info = optionalInfo || '{0} is not less than {1}'.format(number1, number2);
		Assert.true(number1 < number2, info);
	};

	Assert.instance = function (obj, expectedClass, optionalInfo) {
		assertArgs(2, 3);
		Assert.not.null(obj, optionalInfo || 'object argument was null');
		Assert.not.null(expectedClass, optionalInfo || 'class argument was null');
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
		assertArgs(2, 3);
		Assert.instance(type, String, optionalInfo || 'type argument should be a string');
		var actualType = typeof obj;
		var info = optionalInfo || buildMessage(actualType, type);
		Assert.equal(actualType, type, info);
	};

	Assert.throws = function (func, expectedException, optionalInfo) {
		assertArgs(1, 3);
		Assert.instance(func, Function, optionalInfo || 'first argument should be a function');
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
			assertArgs(1, 2);
			Assert.not.equal(subject, null, optionalInfo);
		};

		AssertNot.equal = function (actual, expected, optionalInfo) {
			assertArgs(2, 3);
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo || buildMessage(act, 'not ' + exp);
			Assert.false(actual === expected, info);
		};

		AssertNot.equiv = function (actual, expected, optionalInfo) {
			assertArgs(2, 3);
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo || buildMessage(act, 'not ' + exp);
			Assert.false(actual == expected, info);
		};

		AssertNot.instance = function (obj, objClass, optionalInfo) {
			assertArgs(2, 3);
			Assert.not.null(obj, optionalInfo || 'object argument was null');
			Assert.not.null(objClass, optionalInfo || 'class argument was null');
			var actualClass = obj.constructor.name;
			var shouldNotBeThisClass = objClass.name;
			var info = optionalInfo || buildMessage(actualClass, 'not ' + shouldNotBeThisClass);
			Assert.not.equal(actualClass, shouldNotBeThisClass, info);
		};

		AssertNot.type = function (obj, type, optionalInfo) {
			assertArgs(2, 3);
			Assert.instance(type, String, optionalInfo || 'type argument should be a string');
			var actualType = typeof obj;
			var info = optionalInfo || buildMessage(actualType, 'not ' + type);
			Assert.not.equal(actualType, type, info);
		};

		AssertNot.throws = function (func, unthrownException, optionalInfo) {
			assertArgs(1, 3);
			Assert.instance(func, Function, optionalInfo || 'first argument should be a function');
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