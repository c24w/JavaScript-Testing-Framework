htmlTestHandlerConfig = {
	autocollapse: {
		none: 0, passes: 1, all: 2
	}
}

var defaultConfig = {
	autocollapse: htmlTestHandlerConfig.autocollapse.none
}

function HtmlTestHandler(configuration) {

	var config = configuration ? configuration : defaultConfig;

	var fixture, header, testsContainer;

	this.handle = function (handleType) {
		var args = Array.prototype.slice.call(arguments, 1);
		loadResource('style.css', function () {
			switch (handleType) {
				case TEST_RUNNER_EVENT.START:
					startOutputter();
					break;
				case TEST_RUNNER_EVENT.DESC:
					createFixtureHeader(args[0]);
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
		if (document.body.children.length === 0)
			addControls();
		fixture = makeDiv('testfixture');
		addTo(document.body, fixture);
	}

	function addControls() {
		var controls = makeDiv('controls');
		var text = makeEl('span');
		addText(text, 'Expand:')

		addTo(controls, text);

		addTo(controls, makeControlButton('All', function () {
			setClass('.testfixture .tests.collapsed', 'tests');
		}));

		addTo(controls, makeControlButton('Passed', function () {
			setClass('.testfixture.passed .tests.collapsed', 'tests');
		}));

		addTo(controls, makeControlButton('Failed', function () {
			setClass('.testfixture.failed .tests.collapsed', 'tests');
		}));

		text = makeEl('span'); 9
		text.style.marginLeft = '2em';
		addText(text, 'Collapse:')
		addTo(controls, text);

		addTo(controls, makeControlButton('All', function () {
			setClass('.testfixture .tests', 'tests collapsed');
		}));

		addTo(controls, makeControlButton('Passed', function () {
			setClass('.testfixture.passed .tests', 'tests collapsed');
		}));

		addTo(controls, makeControlButton('Failed', function () {
			setClass('.testfixture.failed .tests', 'tests collapsed');
		}));

		addTo(document.body, controls);
	}

	function makeControlButton(label, func) {
		var button = makeEl('button');
		button.innerHTML = label;
		button.onclick = func;
		return button;
	}

	function setClass(selector, newClass) {
		var testGroups = document.querySelectorAll(selector);
		for (var i = 0; i < testGroups.length; i++)
			testGroups[i].className = newClass;
	}

	function createFixtureHeader(description) {
		header = makeDiv('header');
		var desc = makeDiv('description');
		desc.innerHTML = formatCodeParts(description);
		addTo(header, desc);
		addTo(fixture, header);
	}

	function testOutputter(outputPasses, testPassed, testName, msg) {
		if (!testPassed) {
			appendTestToHtml(false, testName, msg);
		}
		else if (outputPasses) {
			appendTestToHtml(true, testName);
		}
	}

	function statsOutputter(passes, fails) {
		if (shouldBeCollapsed(fails))
			testsContainer.className += ' collapsed';
		fixture.className += fails > 0 ? ' failed' : ' passed';
		var result = makeDiv('result');
		addText(result, getResultMessage(passes, fails));
		addTo(header, result);
	}

	function shouldBeCollapsed(numFails) {
		return config.autocollapse == htmlTestHandlerConfig.autocollapse.all
			|| (numFails === 0 && htmlTestHandlerConfig.autocollapse.passes);
	}

	function endOutputter() { }

	function appendTestToHtml(testPassed, testName, msg) {
		var className = getTestClassName(testPassed);
		var test = makeDiv(className);
		var name = makeDiv('name');
		name.innerHTML = formatCodeParts(testName);
		addTo(test, name);

		if (typeof msg !== 'undefined') {
			var info = makeDiv('info');
			info.innerHTML = formatCodeParts(msg);
			addTo(test, info);
		}
		if (!testsContainer) {
			testsContainer = makeDiv('tests');
			fixture.onclick = function () {
				var cn = testsContainer.className;
				testsContainer.className = 'tests' + (cn === 'tests' ? ' collapsed' : '');
			}
			addTo(fixture, testsContainer);
		}
		addTo(testsContainer, test);
	}
}

function getResultMessage(passes, fails) {
	var total = passes + fails;
	if (fails === 0)
		return passes + ' passed';
	else if (passes === 0)
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
	var d = makeEl('div');
	if (className) d.className = className;
	return d;
}

function makeEl(type) {
	return document.createElement(type);
}

function addTo(parent, el) {
	parent.appendChild(el);
}

function addText(element, text) {
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