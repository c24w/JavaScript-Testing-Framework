function getTestFixture() {
}

var fixture = makeDiv();
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
	var className = getTestClassName(testPassed);
	var test = makeDiv(className);
	var name = makeDiv('name');
	name.innerHTML = formatCodeParts(testName);
	test.appendChild(name);

	if (typeof msg !== 'undefined') {
		var info = makeDiv('info');
		info.innerHTML = formatCodeParts(msg);
		test.appendChild(info);
	}
	addToFixture(test);
}

function htmlDescWriter(description) {
	var desc = makeDiv('description');
	desc.innerHTML = description;
	addToFixture(desc);
}

function htmlTerminatorWriter() {
	addToFixture(document.createElement('hr'));
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

function addToFixture(el) {
	fixture.appendChild(el);
}

function formatCodeParts(testName) {
	var text = testName;
	var words = testName.replace(/[,\(\)]/g, '\u0020').split('\u0020');
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