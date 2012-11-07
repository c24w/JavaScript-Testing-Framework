function getTestFixture() {
}

var fixture = makeDiv('testfixture');
document.body.appendChild(fixture);

function getHtmlOutputter() {
	return {
		descOutputter: htmlDescWriter,
		testOutputter: htmlTestWriter,
		terminatorOutputter: htmlTerminatorWriter,
		resultOutputter: htmlResultWriter
	}
}

function htmlDescWriter(description) {
	var desc = makeDiv('description');
	appendText(desc, description);
	addToFixture(desc);
}

function htmlTestWriter(outputPasses, testPassed, testName, msg) {
	if (!testPassed)
		writeFailedTestHtml(testName, msg);
	else if (outputPasses)
		writePassedTestHtml(testName);
}

function htmlTerminatorWriter() {
	addToFixture(document.createElement('hr'));
}

function htmlResultWriter(passed, failed) {
	var result = makeDiv('result');
	appendText(result, getResultMessage(passed, failed));
	fixture.appendChild(result);
}

function getResultMessage(passed, failed) {
	var total = passed + failed;
	if (failed == 0)
		return 'all passed';
	else if (passed == 0)
		return 'all failed';
	else
		return failed + '/' + total + ' failed';
}

function writeFailedTestHtml(testName, msg) {
	appendTestToHtml(false, testName, msg);
}

function writePassedTestHtml(testName) {
	appendTestToHtml(true, testName);
}

function appendTestToHtml(testPassed, testName, msg) {
	var className = getTestClassName(testPassed);
	var test = makeDiv(className);
	var name = makeDiv('name');
	name.innerHTML = formatCodeParts(testName);
	//appendText(name, formatCodeParts(testName));
	test.appendChild(name);

	if (typeof msg !== 'undefined') {
		var info = makeDiv('info');
		info.innerHTML = formatCodeParts(msg);
		//appendText(info, formatCodeParts(msg));
		test.appendChild(info);
	}
	addToFixture(test);
}

function getTestClassName(testPassed) {
	var resultClass = testPassed ? ' pass' : ' fail';
	var className = 'test' + resultClass;
	return className;
}

function makeDiv(className) {
	var d = document.createElement('div');
	d.className = className;
	return d;
}

function appendText(element, text) {
	element.appendChild(document.createTextNode(text));
}

function addToFixture(el) {
	fixture.appendChild(el);
}

function formatCodeParts(testName) {
	var text = testName;
	var words = testName.split(/[,\(\)\u0020]/g);
	var result = '';
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (isDefined(word))
			text = text.replace(word, '<span class="code">' + word + '</span>');
	}
	return text;
}

function isDefined(word) {
	if (window[word])
		return true;
	try {
		eval(word);
		return true;
	}
	catch (e) {
		return false;
	}
}