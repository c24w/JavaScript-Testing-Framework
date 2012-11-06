function htmlTestWriter(writePasses, testPassed, testName, msg) {
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