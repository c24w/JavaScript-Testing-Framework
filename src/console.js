JTF.namespace('Console', function (Console) {
	var spacer = ' ';
	var descPrefix = '\u250C' + spacer;
	var testPrefix = '|' + spacer;
	var nonFailPadding = spacer + spacer;
	var bottomLine = '\u2514' + spacer;

	Console.TestHandler = function () {

		this.handle = function (handleType) {
			var e = JTF.EVENT;
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case e.BATCH.START:
					break;
				case e.FIXTURE.START:
					console.log('');
					break;
				case e.FIXTURE.DESC:
					console.log(Console.getDescriptionLine(args[0]));
					break;
				case e.TEST.PASS:
					testOutputter(true, args[0]);
					break;
				case e.TEST.FAIL:
					testOutputter(false, args[0], args[1]);
					break;
				case e.FIXTURE.STATS:
					statsOutputter.apply(null, args);
					break;
				case e.FIXTURE.FIXTURE_END:
					break;
				case e.BATCH.END:
					break;
			}
		};

		function testOutputter(testPassed, testName, msg) {
			if (testPassed) console.log(Console.getPassedTestLine(testName));
			else console.error(Console.getFailedTestLine(testName, msg));
		}

		function statsOutputter(passes, fails) {
			var message = Console.getStatsLine(passes, fails);
			if (fails > 0) console.error(message);
			else console.log(message);
		}

		Console.getDescriptionLine = function (description) {
			return nonFailPadding + descPrefix + description;
		};

		Console.getPassedTestLine = function (testName) {
			return nonFailPadding + testPrefix + testName;
		};

		Console.getFailedTestLine = function (testName, msg) {
			return testPrefix + testName + ' - ' + msg;
		};

		Console.getStatsLine = function (passes, fails) {
			var total = passes + fails;
			switch (fails) {
				case 0: return nonFailPadding + bottomLine + passes + ' passed';
				case total: return bottomLine + fails + ' failed';
				default: return bottomLine + fails + '/' + total + ' failed';
			}
		};

	};

});