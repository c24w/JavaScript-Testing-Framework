requires('formatting.js');

testOutputters = {
	console: function (testPassed, testName, msg) {
		consoleTestWriter(true, testPassed, testName, msg);
	},
	html: function (testPassed, testName, msg) {
		determineOutput(true, testPassed, testName, msg);
	}
}

function consoleTestWriter(writePasses, testPassed, testName, msg) {
	if (!testPassed)
		console.error(failIndent + testName + formatMsg(msg));
	else if (writePasses)
		console.log(normalIndent + testName);
}

function determineOutput(writePasses, testPassed, testName, msg) {
	if (!testPassed)
		writeFailedTestHtml(testName, msg);
	else if (writePasses)
		writePassedTestHtml(testName);
}

function writeFailedTestHtml(testName, msg) {
	appendTestToHtml(false, testName, msg);
}

function writePassedTestHtml(testName) {
	appendTestToHtml(true, testName);
}

function appendTestToHtml(testPassed, testName, msg) {
	var msg = formatMsg(msg);
	var test = document.createElement('div');
	var testResult = testPassed ? 'pass' : 'fail';
	test.className = 'test ' + testResult;
	var message = msg == null ? '' : msg;
	test.innerHTML = '<span class="name">{0}</span>{1}'.format(testName, msg);
	document.body.appendChild(test);
}

function formatMsg(msg) {
	return !msg || msg.isWhitespace() ? '' : ' - ' + msg;
}

function outputTestFixture(testcase, testOutputter) {
	var tests = testcase.getTests();
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
//console.log('\n' + normalIndent + '---  ' + testcase.getDescription() + '  ---\n');