//window.JTF.Console = window.JTF.Console || (new function () {

var spacer = '\u0020';
var descPrefix = '\u250C' + spacer;
var testPrefix = '|' + spacer;
var nonFailPadding = spacer + spacer;
var bottomLine = '\u2514' + spacer;

function getResultMessage(passed, failed) {
	var total = passed + failed;
	if (failed == 0)
		return passed + ' passed';
	else if (passed == 0)
		return failed + ' failed';
	else
		return failed + '/' + total + ' failed';
}

function ConsoleTestHandler() {

	this.handle = function (handleType /*, args */) {
		var args = Array.prototype.slice.call(arguments, 1);
		switch (handleType) {
			case TEST_RUNNER_EVENT.START:
				break;
			case TEST_RUNNER_EVENT.DESC:
				descOutputter(args[0]);
				break;
			case TEST_RUNNER_EVENT.PASS:
				testOutputter(true, true, args[0]);
				break;
			case TEST_RUNNER_EVENT.FAIL:
				testOutputter(true, false, args[0], args[1]);
				break;
			case TEST_RUNNER_EVENT.STATS:
				statsOutputter(args[1], args[1]);
				break;
			case TEST_RUNNER_EVENT.END:
				break;
		}
	}

	descOutputter = function (description) {
		console.log('');
		console.log(nonFailPadding + descPrefix + description);
	}

	testOutputter = function (outputPasses, testPassed, testName, msg) {
		if (!testPassed) {
			var info = !msg || msg.isWhitespace() ? '' : ' - ' + msg;
			console.error(testPrefix + testName + info);
		}
		else if (outputPasses) {
			console.log(nonFailPadding + testPrefix + testName);
		}
	}

	statsOutputter = function (passes, fails) {
		var message = bottomLine + getResultMessage(passes, fails);
		if (fails > 0)
			console.error(message);
		else
			console.log(nonFailPadding + message);
	}

}

//});