var spacer = '\u0020';
var descPrefix = '\u250C' + spacer;
var testPrefix = '|' + spacer;
var nonFailPadding = spacer + spacer;
var bottomLine = '\u2514' + spacer;

function ConsoleOutputter() {

	var passed = 0, failed = 0;

	this.descOutputter = function (description) {
		console.log('');
		console.log(nonFailPadding + descPrefix + description);
	}

	this.testOutputter = function (outputPasses, testPassed, testName, msg) {
		if (!testPassed) {
			var info = !msg || msg.isWhitespace() ? '' : ' - ' + msg;
			console.error(testPrefix + testName + info);
			failed++;
		}
		else if (outputPasses) {
			console.log(nonFailPadding + testPrefix + testName);
			passed++;
		}
	}

	this.terminatorOutputter = function (description) { }

	this.resultOutputter = function () {
		var message = bottomLine + getResultMessage(passed, failed);
		if (failed > 0)
			console.error(message);
		else
			console.log(nonFailPadding + message);
	}

	this.summaryOutputter = function () { }

}

function getResultMessage(passed, failed) {
	var total = passed + failed;
	if (failed == 0)
		return passed + ' passed';
	else if (passed == 0)
		return failed + ' failed';
	else
		return failed + '/' + total + ' failed';
}
