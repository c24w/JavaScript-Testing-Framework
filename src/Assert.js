JTF.namespace('Assert', function (Assert) {

	function buildMessage(assertType, actual, expected) {
		return '{0} - expected: {1} found: {2}'.format(assertType, expected, actual);
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

	Assert.that = function (subject) {
		return new AssertThat(subject);
	}

	Assert['true'] = function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition) {
			var info = optionalInfo ? optionalInfo : Assert.DEFAULT_FAIL_MESSAGE;
			throw new AssertException(info);
		}
	}

	Assert['false'] = function (condition, optionalInfo) {
		Assert.true(!condition, optionalInfo);
	}

	Assert['null'] = function (obj, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'Assert.null - argument was not null';
		Assert.equal(obj, null, info);
	}

	Assert.equal = function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equal', act, exp);
		Assert.true(actual === expected, info);
	}

	Assert.equiv = function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', act, exp);
		Assert.true(actual == expected, info);
	}

	function assertIsNumber(object, prefix) {
		var actualType = object === null ? 'null' : typeof object;
		Assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, typeof Number(), actualType));
	}

	Assert.greater = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.greater - first argument');
		assertIsNumber(number2, 'Assert.greater - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.greater - {0} is not greater than {1}'.format(number1, number2);
		Assert.true(number1 > number2, info);
	}

	Assert.less = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.less - first argument');
		assertIsNumber(number2, 'Assert.less - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.less - {0} is not less than {1}'.format(number1, number2);
		Assert.true(number1 < number2, info);
	}

	Assert.instance = function (obj, expectedClass, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'Assert.instance - first argument was null';
		Assert.not.null(obj, optionalInfo);
		try {
			Assert.true(obj instanceof expectedClass);
		}
		catch (e) {
			var actualClass = obj.constructor.name;
			var shouldBeThisClass = expectedClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.instance', actualClass, shouldBeThisClass);
			Assert.equal(actualClass, shouldBeThisClass, info);
		}
	}

	Assert.type = function (obj, type, optionalInfo) {
		var actualType = typeof obj;
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, type);
		Assert.equal(actualType, type, info);
	}

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
				var info = optionalInfo ? optionalInfo : buildMessage('Assert.throws', e.name, expectedException.name);
				Assert.instance(e, expectedException, info);
			}
			return e;
		}
		var info = optionalInfo ? optionalInfo : notThrownError(expectedException);
		throw new AssertException(info);
	}

	function notThrownError(exception) {
		return (typeof exception === 'undefined')
			? 'no exceptions were thrown'
			: exception.name + ' was never thrown'
	}

	JTF.namespace('Assert.not', function (AssertNot) {

		AssertNot['null'] = function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'Assert.not.null - argument was null';
			Assert.not.equal(obj, null, info);
		}

		AssertNot.equal = function (actual, expected, optionalInfo) {
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.equal', act, 'not ' + exp);
			Assert.false(actual === expected, info);
		}

		AssertNot.equiv = function (actual, expected, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
			Assert.false(actual == expected, info);
		}

		AssertNot.instance = function (obj, objClass, optionalInfo) {
			var actualClass = obj.constructor.name;
			var shouldNotBeThisClass = objClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.instance', actualClass, 'not ' + shouldNotBeThisClass);
			Assert.not.equal(actualClass, shouldNotBeThisClass, info);
		}

		AssertNot.type = function (obj, type, optionalInfo) {
			var actualType = typeof obj;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, 'not ' + type);
			Assert.not.equal(actualType, type, info);
		}

		AssertNot.throws = function (func, unthrownException, optionalInfo) {
			if (typeof unthrownException === 'string' && typeof optionalInfo === 'undefined') {
				optionalInfo = unthrownException;
				unthrownException = undefined;
			}
			try {
				func();
			}
			catch (e) {
				var expectedMsg = (typeof unthrownException !== 'undefined') ? (unthrownException.name + ' not thrown') : ('exceptions were thrown');
				var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.throws', e.constructor.name + ' was thrown', expectedMsg);
				if (typeof unthrownException !== 'undefined') {
					Assert.not.instance(e, unthrownException, info);
				}
				else {
					throw new AssertException(info);
				}
			}
		}

	});

});