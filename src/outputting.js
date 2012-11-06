testOutputters = {
	console: function (testPassed, testName, msg) {
		loadResource('console-output.js', function () {
			consoleTestWriter(true, testPassed, testName, msg);
		});
	},
	html: function (testPassed, testName, msg) {
		loadResources('html-output.js', 'style.css', function () {
			determineOutput(true, testPassed, testName, msg);
		});
	}
}

function formatMsg(msg) {
	loadResource('utils.js', function () {
		return !msg || msg.isWhitespace() ? '' : ' - ' + msg;
	});
}

function outputTestFixture(testFixture, testOutputter) {
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			testOutputter(true, test);
		}
		catch (e) {
			testOutputter(false, test, e.message);
		}
	}
}