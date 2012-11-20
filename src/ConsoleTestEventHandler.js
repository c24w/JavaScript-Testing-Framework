(function (ctx) {

	var spacer = '\u0020';
	var descPrefix = '\u250C' + spacer;
	var testPrefix = '|' + spacer;
	var nonFailPadding = spacer + spacer;
	var bottomLine = '\u2514' + spacer;

	var TestRunner = JTF.TestRunner;

	function getResultMessage(passed, failed) {
		var total = passed + failed;
		if (failed == 0)
			return passed + ' passed';
		else if (passed == 0)
			return failed + ' failed';
		else
			return failed + '/' + total + ' failed';
	}

	ctx.TestHandler = function () {

		this.handle = function (handleType /*, args */) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TestRunner.EVENT.FIXTURE.START:
					break;
				case TestRunner.EVENT.FIXTURE.DESC:
					descOutputter(args[0]);
					break;
				case TestRunner.EVENT.FIXTURE.PASS:
					testOutputter(true, true, args[0]);
					break;
				case TestRunner.EVENT.FIXTURE.FAIL:
					testOutputter(true, false, args[0], args[1]);
					break;
				case TestRunner.EVENT.FIXTURE.STATS:
					statsOutputter(args[0], args[1]);
					break;
				case TestRunner.EVENT.FIXTURE.FIXTURE_END:
					break;
			}
		}

		function descOutputter(description) {
			console.log('');
			console.log(nonFailPadding + descPrefix + description);
		}

		function testOutputter(outputPasses, testPassed, testName, msg) {
			if (!testPassed) {
				var info = !msg || msg.isWhitespace() ? '' : ' - ' + msg;
				console.error(testPrefix + testName + info);
			}
			else if (outputPasses) {
				console.log(nonFailPadding + testPrefix + testName);
			}
		}

		function statsOutputter(passes, fails) {
			var message = bottomLine + getResultMessage(passes, fails);
			if (fails > 0)
				console.error(message);
			else
				console.log(nonFailPadding + message);
		}

	}

})(window.JTF.Console = window.JTF.Console || {});