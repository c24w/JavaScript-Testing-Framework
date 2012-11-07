function assert(condition, optionalInfo) {
	if (!condition)
		throw new AssertException(optionalInfo);
}

function assertEquiv(actual, expected, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertEquiv', encloseInType(actual), encloseInType(expected));
	assert(actual == expected, info);
}

function assertEqual(actual, expected, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertEqual', encloseInType(actual), encloseInType(expected));
	assert(actual === expected, info);
}

function assertInstance(object, type, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertInstance', encloseInType(object), type.name);
	assert(object instanceof type, info);
}

function assertThrows(func, exception, optionalInfo) {
	try {
		func();
	}
	catch (e) {
		var info = optionalInfo ? optionalInfo : buildMessage('assertThrows', e.name, exception.name);
		assertInstance(e, exception, info);
		return e;
	}
	throw new AssertException(exception.name + ' was never thrown');
}

function buildMessage(assertType, actual, expected) {
	return '{0} - expected: {1} found: {2}'.format(assertType, expected, actual);
}

function AssertException(info) {
	this.message = info;
}

function encloseInType(object) {
	return typeof object + '(' + object + ')';
}