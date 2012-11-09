var assert = {

	that: function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition)
			throw new AssertException(optionalInfo);
	},

	equal: function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equal', act, exp);
		assert.that(actual === expected, info);
	},

	equiv: function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equiv', encloseInType(actual), encloseInType(expected));
		assert.that(actual == expected, info);
	},

	greater: function (number1, number2, optionalInfo) {
		assert.type(number1, 'number', 'assert.greater - first argument: expected: {0} found: {1}'.format(Number.name, typeof number1));
		assert.type(number2, 'number', 'assert.greater - second argument: expected: Number found:' + typeof number2);
		var info = optionalInfo ? optionalInfo : 'assert.greater - {0} is not greater than {1}'.format(number1, number2);
		assert.that(number1 > number2, info);
	},

	type: function (object, type, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.type', object, type.name);
		assert.equal(typeof object, type, info);
	},

	instance: function (object, type, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.instance', encloseInType(object), type.name);
		assert.that(object instanceof type, info);
	},

	throws: function (func, exception, optionalInfo) {
		try {
			func();
		}
		catch (e) {
			var info = optionalInfo ? optionalInfo : buildMessage('assert.throws', e.name, exception.name);
			assert.instance(e, exception, info);
			return e;
		}
		var info = optionalInfo ? optionalInfo : exception.name + ' was never thrown';
		throw new AssertException(info);
	},

	not: {
		'null': function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'assert.not.null - argument was null';
			assert.that(obj !== null, info);
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

function encloseInType(object) {
	if (object === null || typeof object === 'undefined') return object;
	return typeof object + '(' + object + ')';
}