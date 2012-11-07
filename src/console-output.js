function getConsoleOutputter() {
	return {
		descOutputter: consoleDescWriter,
		testOutputter : consoleTestWriter,
		terminatorOutputter: consoleTerminatorWriter
	}
}

function consoleTestWriter(outputPasses, testPassed, testName, msg) {
	if (!testPassed) {
		var info = msg.isWhitespace() ? '' : ' - ' + msg;
		console.error(testFailIndent + testName + info);
	}
	else if (outputPasses)
		console.log(testPassIndent + testName);
}

function consoleDescWriter(description) {
	console.log(descIndent + description);
}

function consoleTerminatorWriter(description) {
	console.log(bottomLine);
}