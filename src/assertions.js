var assert = {

	'true': function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition) {
			var info = optionalInfo ? optionalInfo : 'no additional information';
			throw new AssertException(info);
		}
	},

	'false': function (condition, optionalInfo) {
		assert.true(!condition, optionalInfo);
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
		assertIsNumber(number1, 'assert.greater - first argument');
		assertIsNumber(number2, 'assert.greater - second argument');
		var info = optionalInfo ? optionalInfo : 'assert.greater - {0} is not greater than {1}'.format(number1, number2);
		assert.true(number1 > number2, info);
	},

	less: function (number1, number2, optionalInfo) {
		assertIsNumber(number1);
		assertIsNumber(number2);
		var info = optionalInfo ? optionalInfo : 'assert.less - {0} is not less than {1}'.format(number1, number2);
		assert.true(number1 < number2, info);
	},

	'null': function (obj, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'assert.null - argument was not null';
		assert.true(obj === null, info);
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

		equiv: function (actual, expected, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('assert.equiv', encloseInType(actual), encloseInType(expected));
			assert.false(actual == expected, info);
		},

		'null': function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'assert.not.null - argument was null';
			assert.false(obj === null, info);
		},

		type: function (obj, type, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('assert.type', obj, type.name);
			assert.not.equal(typeof obj, type, info);
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

function assertIsNumber(object, prefix) {
	assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, Number.name, typeof object));
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