function consoleTestWriter(outputPasses, testPassed, testName, msg) {
	if (!testPassed)
		console.error(testFailIndent + testName + msg);
	else if (outputPasses)
		console.log(testPassIndent + testName);
}

function consoleDescWriter(description) {
	console.log(descIndent + description);
}