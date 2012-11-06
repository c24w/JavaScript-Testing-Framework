var fixture = document.createElement('div');
fixture.className = 'testfixture';
document.body.appendChild(fixture);

function htmlTestWriter(outputPasses, testPassed, testName, msg) {
	if (!testPassed)
		writeFailedTestHtml(testName, msg);
	else if (outputPasses)
		writePassedTestHtml(testName);
}

function writeFailedTestHtml(testName, msg) {
	appendTestToHtml(false, testName, msg);
}

function writePassedTestHtml(testName) {
	appendTestToHtml(true, testName);
}

function appendTestToHtml(testPassed, testName, msg) {
	var test = document.createElement('div');
	var testResult = testPassed ? 'pass' : 'fail';
	test.className = 'test ' + testResult;
	var message = msg == null ? '' : msg;
	test.innerHTML = '<span class="name">{0}</span>{1}'.format(testName, msg);
	fixture.appendChild(test);
}

function htmlDescWriter(description) {
	var desc = document.createElement('div');
	desc.className = 'description';
	desc.innerHTML = description;
	fixture.appendChild(desc);
}