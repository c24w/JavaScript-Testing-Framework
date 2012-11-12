var assert = {

	'true': function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition)
			throw new AssertException(optionalInfo);
	},

	'false': function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (condition)
			throw new AssertException(optionalInfo);
	},

	'null': function (obj, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'assert.not.null - argument was null';
		assert.true(obj === null, info);
	},

	equal: function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equal', act, exp);
		assert.true(actual === expected, info);
	},

	equiv: function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equiv', encloseInType(actual), encloseInType(expected));
		assert.true(actual == expected, info);
	},

	greater: function (number1, number2, optionalInfo) {
		assert.type(number1, 'number', 'assert.greater - first argument: expected: {0} found: {1}'.format(Number.name, typeof number1));
		assert.type(number2, 'number', 'assert.greater - second argument: expected: Number found: ' + typeof number2);
		var info = optionalInfo ? optionalInfo : 'assert.greater - {0} is not greater than {1}'.format(number1, number2);
		assert.true(number1 > number2, info);
	},

	less: function (number1, number2, optionalInfo) {
		assert.type(number1, 'number', 'assert.less - first argument: expected: {0} found: {1}'.format(Number.name, typeof number1));
		assert.type(number2, 'number', 'assert.less - second argument: expected: Number found: ' + typeof number2);
		var info = optionalInfo ? optionalInfo : 'assert.less - {0} is not less than {1}'.format(number1, number2);
		assert.true(number1 < number2, info);
	},
	/*
	contains: function (number1, number2, optionalInfo) {
		assert.type(number1, 'number', 'assert.greater - first argument: expected: {0} found: {1}'.format(Number.name, typeof number1));
		assert.type(number2, 'number', 'assert.greater - second argument: expected: Number found:' + typeof number2);
		var info = optionalInfo ? optionalInfo : 'assert.greater - {0} is not greater than {1}'.format(number1, number2);
		assert.true(number1 < number2, info);
	},
	*/
	type: function (obj, type, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.type', obj, type.name);
		assert.equal(typeof obj, type, info);
	},

	instance: function (obj, type, optionalInfo) {
		try {
			assert.true(obj instanceof type, info);
		}
		catch (e) {
			var objToString = toString.call(obj);
			var actualType = objToString.match(/\[object (.+)\]/)[1];
			var info = optionalInfo ? optionalInfo : buildMessage('assert.instance', actualType, type.name);
			assert.equal(actualType, type.name, info);
		}
	},

	throws: function (func, exception, optionalInfo) {
		try {
			func();
		}
		catch (e) {
			var info = optionalInfo ? optionalInfo : buildMessage('assert.throws', typeof e, exception.name);
			assert.true(e instanceof exception, info);
			return e;
		}
		var info = optionalInfo ? optionalInfo : exception.name + ' was never thrown';
		throw new AssertException(info);
	},

	not: {

		equal: function (actual, expected, optionalInfo) {
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo ? optionalInfo : buildMessage('assert.not.equal', act, exp);
			assert.false(actual === expected, info);
		},

		'null': function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'assert.not.null - argument was null';
			assert.false(obj === null, info);
		},

		instance: function (obj, type, optionalInfo) {
			try {
				assert.false(obj instanceof type, info);
			}
			catch (e) {
				var objToString = toString.call(obj);
				var actualType = objToString.match(/\[object (.+)\]/)[1];
				var info = optionalInfo ? optionalInfo : buildMessage('assert.not.instance', actualType, 'not ' + type.name);
				assert.not.equal(actualType, type.name, info);
			}
		},

		throws: function (func, exception, optionalInfo) {
			try {
				func();
			}
			catch (e) {
				var info = optionalInfo ? optionalInfo : exception.name + ' was thrown because: ' + e.message;
				assert.false(e instanceof exception, info);
			}
		}

	}

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