htmlTestHandlerConfig = {
	autocollapse: {
		none: 0, passes: 1, all: 2
	},
}

var defaultConfig = {
	autocollapse: htmlTestHandlerConfig.autocollapse.passes,
	showpasses: true
}

function addMissingConfigurations(config) {
	if (!config) return defaultConfig;
	else {
		for (var option in defaultConfig) {
			if (typeof config[option] === 'undefined')
				config[option] = defaultConfig[option];
		}
	}
	return config;
}

function HtmlTestHandler(configuration) {
		var config = addMissingConfigurations(configuration);
		var fixture, header, testsContainer;

		this.handle = function (handleType) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TEST_RUNNER_EVENT.START:
					startOutputter();
					break;
				case TEST_RUNNER_EVENT.DESC:
					createFixtureHeader(args[0]);
					break;
				case TEST_RUNNER_EVENT.PASS:
					appendTestToHtml(true, args[0], args[1]);
					break;
				case TEST_RUNNER_EVENT.FAIL:
					appendTestToHtml(false, args[0], args[1]);
					break;
				case TEST_RUNNER_EVENT.STATS:
					statsOutputter(args[0], args[1]);
					break;
				case TEST_RUNNER_EVENT.END:
					break;
			}
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

			addTo(controls, makeControlButton('Passes', function () {
				setClass('.testfixture.passed .tests.collapsed', 'tests');
			}));

			addTo(controls, makeControlButton('Fails', function () {
				setClass('.testfixture.failed .tests.collapsed', 'tests');
			}));

			text = makeEl('span');
			text.style.marginLeft = '2em';
			addText(text, 'Collapse:')
			addTo(controls, text);

			addTo(controls, makeControlButton('All', function () {
				setClass('.testfixture .tests', 'tests collapsed');
			}));

			addTo(controls, makeControlButton('Passes', function () {
				setClass('.testfixture.passed .tests', 'tests collapsed');
			}));

			addTo(controls, makeControlButton('Fails', function () {
				setClass('.testfixture.failed .tests', 'tests collapsed');
			}));

			if (config.showpasses) {
				var btn = makeControlButton('Hide Passes', function () {
					setClass('.testfixture.passed', 'testfixture passed hidden');
					this.parentNode.removeChild(this);
				});
				btn.style.marginLeft = '2em';
				addTo(controls, btn);
			}

			addTo(document.body, controls);
		}

		function makeControlButton(label, func) {
			var button = makeEl('button');
			button.innerHTML = label;
			button.onclick = func;
			return button;
		}

		function setClass(selector, newClass) {
			var selection = document.querySelectorAll(selector);
			for (var i = 0; i < selection.length; i++)
				selection[i].className = newClass;
		}

		function createFixtureHeader(description) {
			header = makeDiv('header');
			var desc = makeDiv('description');
			desc.innerHTML = formatCodeParts(description);
			addTo(header, desc);
			addTo(fixture, header);
		}

		function statsOutputter(passes, fails) {
			if (shouldBeCollapsed(fails))
				testsContainer.className += ' collapsed';
			fixture.className += fails > 0 ? ' failed' : ' passed';
			if (fails === 0 && !config.showpasses)
				fixture.className += ' hidden';
			var result = makeDiv('result');
			addText(result, getResultMessage(passes, fails));
			addTo(header, result);
		}

		function shouldBeCollapsed(numFails) {
			if (config.autocollapse === htmlTestHandlerConfig.autocollapse.none)
				return false;
			if (config.autocollapse === htmlTestHandlerConfig.autocollapse.all)
				return true;
			if (htmlTestHandlerConfig.autocollapse.passes && numFails === 0)
				return true;
		}

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
				header.onclick = function () {
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