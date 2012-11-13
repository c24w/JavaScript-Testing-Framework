function AssertThat(subject) {
	var A = Assert;
	var AN = A.not;
	this.is = {
		'true': function () { A.true(subject) },
		'false': function () { A.false(subject) },
		'null': function () { A.null(subject) },
		equal: { to: function (expected) { A.equal(subject, expected) } },
		equiv: { to: function (expected) { A.equiv(subject, expected) } },
		greater: { than: function (expected) { A.greater(subject, expected) } },
		less: { than: function (expected) { A.less(subject, expected) } },
		instance: { of: function (type) { A.instance(subject, type) } },
		throws: function (exception) { A.throws(subject, exception) },
		not: {
			'null': function () { AN.null(subject) },
			equal: { to: function (expected) { AN.equal(subject, expected) } },
			equiv: { to: function (expected) { AN.equiv(subject, expected) } },
			instance: { of: function (type) { AN.instance(subject, type) } },
			throws: function (exception) { AN.throws(subject, exception) },
		}
	}
}

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
		assertIsNumber(number1);
		assertIsNumber(number2);
		var info = optionalInfo ? optionalInfo : 'Assert.less - {0} is not less than {1}'.format(number1, number2);
		Assert.true(number1 < number2, info);
	},

	instance: function (obj, type, optionalInfo) {
		try {
			Assert.true(obj instanceof type, info);
		}
		catch (e) {
			var objToString = toString.call(obj);
			var actualType = objToString.match(/\[object (.+)\]/)[1];
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.instance', actualType, type.name);
			Assert.equal(actualType, type.name, info);
		}
	},

	throws: function (func, exception, optionalInfo) {
		try {
			func();
		}
		catch (e) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.throws', typeof e, exception.name);
			Assert.true(e instanceof exception, info);
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
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.equal', act, exp);
			Assert.false(actual === expected, info);
		},

		equiv: function (actual, expected, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
			Assert.false(actual == expected, info);
		},

		instance: function (obj, type, optionalInfo) {
			try {
				Assert.false(obj instanceof type, info);
			}
			catch (e) {
				var objToString = toString.call(obj);
				var actualType = objToString.match(/\[object (.+)\]/)[1];
				var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.instance', actualType, 'not ' + type.name);
				Assert.not.equal(actualType, type.name, info);
			}
		},

		throws: function (func, exception, optionalInfo) {
			try {
				func();
			}
			catch (e) {
				var info = optionalInfo ? optionalInfo : exception.name + ' was thrown because: ' + e.message;
				Assert.false(e instanceof exception, info);
			}
		}

	}

}

function assertIsNumber(object, prefix) {
	Assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, Number.name, typeof object));
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