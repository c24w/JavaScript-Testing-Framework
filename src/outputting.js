function outputTestFixtureToConsole(testFixture) {
	loadResources('console-output.js', 'formatting.js', function () {
		outputTestFixture(true, testFixture, consoleTestWriter, consoleDescWriter);
	});
}

function outputTestFixtureToHtml(testFixture) {
	loadResources('html-output.js', 'style.css', function () {
		outputTestFixture(true, testFixture, htmlTestWriter, htmlDescWriter);
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
	return isUselessString(msg) ? '' : ' - ' + msg;
}

function formatDesc(desc) {
	return isUselessString(desc) ? 'Test fixture' : desc;
}

function isUselessString(s) {
	return !s || s.isWhitespace();
}

function outputTestFixture(outputPasses, testFixture, testOutputter, descOutputter) {
	var desc = formatDesc(testFixture.getDescription());
	descOutputter(desc);
	var tests = testFixture.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			testOutputter(outputPasses, true, test);
		}
		catch (e) {
			testOutputter(outputPasses, false, test, formatMsg(e.message));
		}
	}
}