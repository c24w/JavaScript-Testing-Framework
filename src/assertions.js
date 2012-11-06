function assert(condition, optionalInfo) {
	if (!condition)
		throw new AssertException(optionalInfo);
}

function assertEquiv(actual, expected) {
	assert(actual == expected, '');
}

function assertEqual(actual, expected) {
	assert(actual === expected, buildMessage('assertEqual', actual, expected));
}

function assertInstance(object, type) {
	assert(object instanceof type, '');
}

function buildMessage(assertType, actual, expected) {
	return '{0} - expected: {1} found: {2}'.format(assertType, actual, expected);
}

function AssertException(info) {
	this.message = info;
}