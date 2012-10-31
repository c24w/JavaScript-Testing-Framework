requires('outputters.js');
requires('utils.js');
requires('formatting.js');

function testCase(description, tests) {
	var desc = description;
	var tests = tests;
	this.getDescription = function () { return desc }
	this.getTests = function () { return tests }
	this.outputTestResults = function (outputter) {
		outputTestResults(this, outputter);
	}
}

function autoRunTestCase(description, tests) {
	new testCase(description, tests).outputTestResults(htmlOutputter);
}

function outputTestResults(testcase, outputter) {
	var tests = testcase.getTests();
	for (var test in tests) {
		try {
			tests[test]();
			outputter(true, test);
		}
		catch (e) {
			var msg = e.message.isWhitespace() ? '' : ' - ' + e.message;
			outputter(false, test + msg);
		}
	}
}
/*
function displayTestCase(description) {

	var testCase = document.createElement('div');
	testCase.className = 'testCase';
	testCase.innerHTML = '<div class="desc">' + description + '</div>';
	document.body.getElementById('testFixture').appendChild(testCase);
}

var displayTestInTestCase = function (testCase, testPassed, name, msg) {
	var test = document.createElement('p');
	test.className = 'test';
	var className = testPassed ? 'pass' : 'fail';
	var message = msg == null ? '' : msg;
	test.innerHTML = '<span class="{0}">{1}</span>{2}'.format(className, name, message);
	testCase.appendChild(test);
}
*/