var Assert = {

	that: function (subject) {
		return new AssertThat(subject);
	},

	'true': function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition) {
			var info = optionalInfo ? optionalInfo : 'no additional information';
			throw new AssertException(info);
		}
	},

	'false': function (condition, optionalInfo) {
		Assert.true(!condition, optionalInfo);
	},

	'null': function (obj, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'Assert.null - argument was not null';
		Assert.true(obj === null, info);
	},

	equal: function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equal', act, exp);
		Assert.true(actual === expected, info);
	},

	equiv: function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
		Assert.true(actual == expected, info);
	},

	greater: function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.greater - first argument');
		assertIsNumber(number2, 'Assert.greater - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.greater - {0} is not greater than {1}'.format(number1, number2);
		Assert.true(number1 > number2, info);
	},

	less: function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.less - first argument');
		assertIsNumber(number2, 'Assert.less - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.less - {0} is not less than {1}'.format(number1, number2);
		Assert.true(number1 < number2, info);
	},

	instance: function (obj, objClass, optionalInfo) {
		try {
			Assert.true(obj instanceof objClass, info);
		}
		catch (e) {
			var actualClass = obj.constructor.name;
			var expectedType = objClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.instance', actualClass, expectedType);
			Assert.equal(actualClass, expectedType, info);
		}
	},

	type: function (obj, type, optionalInfo) {
		var actualType = typeof obj;
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, type);
		Assert.equal(actualType, type, info);
	},

	throws: function (func, exception, optionalInfo) {
		try {
			func();
		}
		catch (e) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.throws', e.name, exception.name);
			Assert.instance(e, exception, info);
			return e;
		}
		var info = optionalInfo ? optionalInfo : exception.name + ' was never thrown';
		throw new AssertException(info);
	},

	not: {

		'null': function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'Assert.not.null - argument was null';
			Assert.false(obj === null, info);
		},

		equal: function (actual, expected, optionalInfo) {
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.equal', act, 'not ' + exp);
			Assert.false(actual === expected, info);
		},

		equiv: function (actual, expected, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
			Assert.false(actual == expected, info);
		},

		instance: function (obj, objClass, optionalInfo) {
			var actualClass = obj.constructor.name;
			var expectedNotType = objClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.instance', actualClass, 'not ' + expectedNotType);
			Assert.not.equal(actualClass, expectedNotType, info);
		},

		type: function (obj, type, optionalInfo) {
			var actualType = typeof obj;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, 'not ' + type);
			Assert.not.equal(actualType, type, info);
		},

		throws: function (func, exception, optionalInfo) {
			try {
				func();
			}
			catch (e) {
				var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.throws', e.constructor.name + ' was thrown', exception.name + ' not thrown');
				Assert.not.instance(e, exception, info);
			}
		}

	}

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

function assertIsNumber(object, prefix) {
	Assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, typeof Number(), typeof object));
}

function buildMessage(assertType, actual, expected) {
	return '{0} - expected: {1} found: {2}'.format(assertType, expected, actual);
}

function AssertException(message) {
	this.message = message;
}

function areTheSameType(obj1, obj2) {
	return typeof obj1 === typeof obj2;
}

function encloseInType(obj) {
	if (obj === null || typeof obj === 'undefined') return obj;
	return typeof obj + '(' + obj + ')';
}