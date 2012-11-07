var assert = {

	basic: function (condition, optionalInfo) {
		if (!condition)
			throw new AssertException(optionalInfo);
	},

	equiv: function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equiv', encloseInType(actual), encloseInType(expected));
		assert.basic(actual == expected, info);
	},

	equal: function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.equal', encloseInType(actual), encloseInType(expected));
		assert.basic(actual === expected, info);
	},

	instance: function (object, type, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('assert.instance', encloseInType(object), type.name);
		assert.basic(object instanceof type, info);
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
	}

}

function buildMessage(assertType, actual, expected) {
	return '{0} - expected: {1} found: {2}'.format(assertType, expected, actual);
}

function AssertException(message) {
	this.message = message;
}

function encloseInType(object) {
	return typeof object + '(' + object + ')';
}