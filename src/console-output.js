var spacer = '\u0020';
var descPrefix = '\u250C' + spacer;
var testPrefix = '|' + spacer;
var nonFailPadding = spacer + spacer;
var bottomLine = '\u2514' + spacer;

function getConsoleOutputter() {
	return {
		descOutputter: consoleDescWriter,
		testOutputter: consoleTestWriter,
		terminatorOutputter: consoleTerminatorWriter,
		resultOutputter: consoleResultWriter
	}
}

function consoleTestWriter(outputPasses, testPassed, testName, msg) {
	if (!testPassed) {
		var info = msg.isWhitespace() ? '' : ' - ' + msg;
		console.error(testPrefix + testName + info);
	}
	else if (outputPasses)
		console.log(nonFailPadding + testPrefix + testName);
}

function consoleDescWriter(description) {
	console.log(nonFailPadding + descPrefix + description);
}

function consoleResultWriter(passed, failed) {
	var message = bottomLine + getResultMessage(passed, failed);
	if (failed > 0)
		console.error(message);
	else
		console.log(nonFailPadding + message);
}

function consoleTerminatorWriter(description) {
	console.log('');
}

function getResultMessage(passed, failed) {
	var total = passed + failed;
	if (failed == 0)
		return 'all passed';
	else if (passed == 0)
		return 'all failed';
	else
		return failed + '/' + total + ' failed';
}
