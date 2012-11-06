function outputTestsToConsole(testFixture) {
	loadResource('console-output.js', function () {
		outputTests(testFixture, consoleTestWriter);
	});
}

function outputTestsToHtml(testFixture) {
	loadResources('html-output.js', 'style.css', function () {
		outputTests(testFixture, htmlTestWriter);
	});
}

descOutputters = {
	console: function (desc) {
		loadResource('console-output.js', function () {
			consoleDescWriter(true, testPassed, testName, msg);
		});
	},
	html: function (desc) {
		loadResources('html-output.js', 'style.css', function () {
			htmlDescWriter(desc);
		});
	}
}

function formatMsg(msg) {
	loadResource('utils.js', function () {
		return !msg || msg.isWhitespace() ? '' : ' - ' + msg;
	});
}

function outputTests(testFixture, testOutputter) {
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			testOutputter(true, true, test);
		}
		catch (e) {
			testOutputter(true, false, test, e.message);
		}
	}
}