requires('formatting.js');

function consoleOutputter(testPassed, msg) {
	consoleLogger(true, testPassed, msg);
}

function consoleFailsOutputter(testPassed, msg) {
	consoleLogger(false, testPassed, msg);
}

function consoleLogger(logPasses, testPassed, msg) {
	if (!testPassed)
		console.error(failIndent + msg);
	else if (logPasses)
		console.log(normalIndent + msg);
}

function htmlOutputter(testPassed, msg) {
	htmlLogger(true, testPassed, msg);
}

function htmlLogger(logPasses, testPassed, msg) {
	if (!testPassed)
		htmlLogFail(msg);
	else if (logPasses)
		htmlLogPass(msg);
	document.body.innerHTML += '<br>';
}

function htmlLogFail(msg) {
	document.body.innerHTML += msg;
}

function htmlLogPass(msg) {
	document.body.innerHTML += msg;
}

var displayTestInTestCase = function (testCase, testPassed, name, msg) {
	var test = document.createElement('p');
	test.className = 'test';
	var className = testPassed ? 'pass' : 'fail';
	var message = msg == null ? '' : msg;
	test.innerHTML = '<span class="{0}">{1}</span>{2}'.format(className, name, message);
	testCase.appendChild(test);
}

//console.log('\n' + normalIndent + '---  ' + testcase.getDescription() + '  ---\n');