function HtmlTestHandler() {

	var fixture, topbar;

	this.handle = function (handleType) {
		var args = Array.prototype.slice.call(arguments, 1);
		loadResource('style.css', function () {
			switch (handleType) {
				case TEST_RUNNER_EVENT.START:
					startOutputter();
					break;
				case TEST_RUNNER_EVENT.DESC:
					descOutputter(args[0]);
					break;
				case TEST_RUNNER_EVENT.PASS:
					testOutputter(true, true, args[0]);
					break;
				case TEST_RUNNER_EVENT.FAIL:
					testOutputter(true, false, args[0], args[1]);
					break;
				case TEST_RUNNER_EVENT.STATS:
					statsOutputter(args[0], args[1]);
					break;
				case TEST_RUNNER_EVENT.END:
					endOutputter();
					break;
			}
		});
	}

	function startOutputter() {
		if (document.body.children.length > 0)
			document.body.appendChild(document.createElement('hr'));
		fixture = makeDiv('testfixture');
		document.body.appendChild(fixture);
	}

	function descOutputter(description) {
		var descEl = makeDiv('description');
		descEl.innerHTML = formatCodeParts(description);
		topbar = makeDiv('topbar');
		topbar.appendChild(descEl);
		addToFixture(topbar);
	}

	function testOutputter(outputPasses, testPassed, testName, msg) {
		if (!testPassed) {
			writeFailedTestHtml(testName, msg);
		}
		else if (outputPasses) {
			writePassedTestHtml(testName);
		}
	}

	function statsOutputter(passes, fails) {
		fixture.className += fails > 0 ? ' failed' : ' passed';
		var result = makeDiv('result');
		appendText(result, getResultMessage(passes, fails));
		topbar.appendChild(result);
	}

	function endOutputter() { }

	function writeFailedTestHtml(testName, msg) {
		appendTestToHtml(false, testName, msg);
	}

	function writePassedTestHtml(testName) {
		appendTestToHtml(true, testName);
	}
	// hide html operations in another file or something
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

function getResultMessage(passes, fails) {
	var total = passes + fails;
	if (fails == 0)
		return passes + ' passed';
	else if (passes == 0)
		return fails + ' failed';
	else
		return fails + '/' + total + ' failed';
}

function getTestClassName(testPassed) {
	var resultClass = testPassed ? ' pass' : ' fail';
	var className = 'test' + resultClass;
	return className;
}

function makeDiv(className) {
	var d = document.createElement('div');
	if (className) d.className = className;
	return d;
}

function appendText(element, text) {
	element.appendChild(document.createTextNode(text));
}

function formatCodeParts(testName) {
	var text = testName;
	var words = testName.split(/[,\u0020]/g);
	var result = '';
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (/`.+`/.test(word))
			text = text.replace(word, '<span class="code">' + word.replace(/`/g, '') + '</span>');
		else if (isDefined(word))
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