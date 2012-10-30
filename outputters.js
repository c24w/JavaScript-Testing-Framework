function consoleOutputter(testPassed, msg) {
	consoleLogger(true, testPassed, msg);
}

function consoleFailsOutputter(testPassed, msg) {
	consoleLogger(false, testPassed, msg);
}

function consoleLogger(logPasses, testPassed, msg) {
	if (!testPassed)
		console.error(failIndent + msg);
	else if (logPasses)
		console.log(normalIndent + msg);
}