function assert(condition, optionalInfo) {
	if (!condition)
		throw new AssertException(optionalInfo);
}

function assertEquiv(actual, expected, optionalInfo) {
	assert(actual == expected, optionalInfo);
}

function assertEqual(actual, expected, optionalInfo) {
	assert(actual === expected, optionalInfo);
}

function assertInstance(object, type, optionalInfo) {
	assert(object instanceof type, optionalInfo);
}

function AssertException(info) {
	this.getInfo = function () {
		return info ? info : '';
	}
}