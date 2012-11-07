function htmlOutputter() {

	var passed = 0, failed = 0;
	var fixture = makeDiv('testfixture');
	document.body.appendChild(fixture);

	this.descOutputter = function (description) {
		var desc = makeDiv('description');
		appendText(desc, description);
		addToFixture(desc);
	}

	this.testOutputter = function (outputPasses, testPassed, testName, msg) {
		if (!testPassed) {
			writeFailedTestHtml(testName, msg);
			failed++;
		}
		else if (outputPasses) {
			writePassedTestHtml(testName);
			passed++;
		}
	}

	this.terminatorOutputter = function () {
		addToFixture(document.createElement('hr'));
	}

	this.resultOutputter = function () {
		var result = makeDiv('result');
		appendText(result, getResultMessage(passed, failed));
		fixture.appendChild(result);
	}

	this.summaryOutputter = function () {
		var summary = makeDiv('summary');
		appendText(summary, 'hello');
		document.body.insertBefore(summary, document.body.firstChild);
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

	function addToFixture(el) {
		fixture.appendChild(el);
	}
}

function getResultMessage(passed, failed) {
	var total = passed + failed;
	if (failed == 0)
		return 'All passed';
	else if (passed == 0)
		return 'All failed';
	else
		return failed + '/' + total + ' failed';
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