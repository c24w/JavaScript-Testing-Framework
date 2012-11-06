function assert(condition, optionalInfo) {
	if (!condition)
		throw new AssertException(optionalInfo);
}

function assertEquiv(actual, expected, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertEquiv', actual, expected);
	assert(actual == expected, info);
}

function assertEqual(actual, expected, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertEqual', actual, expected);
	assert(actual === expected, info);
}

function assertInstance(object, type, optionalInfo) {
	var info = optionalInfo ? optionalInfo : buildMessage('assertInstance', object, type);
	assert(object instanceof type, info);
}

function buildMessage(assertType, actual, expected) {
	return assertType + ' - expected: "' + encloseInType(expected) + '" found: "' + encloseInType(actual) + '"';
}

function AssertException(info) {
	this.message = info;
}

function encloseInType(object) {
	return typeof object + "(" + object + ")";
}