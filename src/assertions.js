function assert(condition, optionalInfo) {
	if (!condition)
		throw new Error(optionalInfo);
}

function assertEqual(actual, expected, optionalInfo) {
	assert(actual == expected, optionalInfo);
}