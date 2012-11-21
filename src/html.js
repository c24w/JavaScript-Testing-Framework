(function (ctx) {

	var html = ctx;

	var totalFails = 0;

	var CONFIG = html.CONFIG = {
		COLLAPSE: { NONE: 0, PASSES: 1, ALL: 2 },
	}

	var DefaultConfig = {
		collapse: CONFIG.COLLAPSE.PASSES,
		showPasses: true,
		runInterval: 0,
		notifyOnFail: false
	}

	function addMissingConfigurations(currentConfig) {
		if (!currentConfig) return DefaultConfig;
		else {
			for (var option in DefaultConfig) {
				currentConfig[option] = currentConfig[option] || DefaultConfig[option];
			}
		}
		return currentConfig;
	}

	html.TestHandler = function (configuration) {
		var TestRunner = JTF.TestRunner;
		var currentConfig = addMissingConfigurations(configuration);
		var fixture, header, testsContainer;
		var reRunTimer;

		this.handle = function (handleType) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TestRunner.EVENT.FIXTURE.START:
					startOutputter();
					break;
				case TestRunner.EVENT.FIXTURE.DESC:
					createFixtureHeader(args[0]);
					break;
				case TestRunner.EVENT.FIXTURE.PASS:
					appendTestToHtml(true, args[0], args[1]);
					break;
				case TestRunner.EVENT.FIXTURE.FAIL:
					appendTestToHtml(false, args[0], args[1]);
					break;
				case TestRunner.EVENT.FIXTURE.STATS:
					statsOutputter(args[0], args[1]);
					break;
				case TestRunner.EVENT.FIXTURE.END:
					break;
				case TestRunner.EVENT.BATCH.END:
					batchEnd();
					break;
			}
		}

		function batchEnd() {
			if (totalFails > 0) {
				if (isSetToReRun()) {
					if (shouldCancelReRuns())
						currentConfig.runInterval = 0;
				}
				else showFailsAlert();
			}
			if (currentConfig.runInterval > 0)
				reRunTimer = setTimeout(function () { window.location.reload() }, currentConfig.runInterval);
		}

		function shouldCancelReRuns() {
			return confirm('Tests failed\n\nOK = review tests\n(stop further re-runs)\n\nCancel = ignore & continue')
		}

		function showFailsAlert() {
			return !confirm('Tests failed\n\nOK = ignore & continue\n\nCancel = review tests')
		}

		function isSetToReRun() {
			return currentConfig.runInterval > 0;
		}

		function startOutputter() {
			if (document.body.children.length === 0)
				addControls();
			fixture = html.makeDiv('testfixture');
			header = html.makeDiv('header');
			testsContainer = html.makeDiv('tests');
			addTo(fixture, header);
			addTo(fixture, testsContainer);
			addTo(document.body, fixture);
		}

		function addControls() {
			var controls = html.makeDiv('controls');
			var text = html.makeEl('span');
			addText(text, 'Expand:')

			addTo(controls, text);

			addTo(controls, html.makeOnClickButton('All', function () {
				html.removeClassFromMany('.testfixture.collapsed', 'collapsed');
			}));

			addTo(controls, html.makeOnClickButton('Passes', function () {
				html.removeClassFromMany('.testfixture.passed.collapsed', 'collapsed');
			}));

			addTo(controls, html.makeOnClickButton('Fails', function () {
				html.removeClassFromMany('.testfixture.failed.collapsed', 'collapsed');
			}));

			text = html.makeEl('span');
			text.style.marginLeft = '2em';
			addText(text, 'Collapse:')
			addTo(controls, text);

			addTo(controls, html.makeOnClickButton('All', function () {
				html.addClassToMany('.testfixture', 'collapsed');
			}));

			addTo(controls, html.makeOnClickButton('Passes', function () {
				html.addClassToMany('.testfixture.passed', 'collapsed');
			}));

			addTo(controls, html.makeOnClickButton('Fails', function () {
				html.addClassToMany('.testfixture.failed', 'collapsed');
			}));

			if (currentConfig.showPasses) {
				var btn = html.makeOnClickButton('Hide Passes', function () {
					html.addClassToMany('.testfixture.passed', 'hidden');
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				addTo(controls, btn);
			}

			if (currentConfig.runInterval > 0) {
				btn = html.makeOnClickButton('Stop re-runs', function () {
					clearTimeout(reRunTimer);
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				addTo(controls, btn);
			}

			var btn = html.makeOnClickButton('Reload', function () {
				window.location.reload();
			});
			btn.style.marginLeft = '2em';
			addTo(controls, btn);

			addTo(document.body, controls);
		}

		function createFixtureHeader(description) {
			var desc = html.makeDiv('description');
			desc.innerHTML = formatCodeParts(description);
			addTo(header, desc);
		}

		function statsOutputter(passes, fails) {
			if (fixtureShouldBeCollapsed(fails > 0))
				fixture.className += ' collapsed';
			fixture.className += fails > 0 ? ' failed' : ' passed';
			if (fails === 0 && !currentConfig.showPasses)
				fixture.className += ' hidden';
			var result = html.makeDiv('result');
			addText(result, getResultMessage(passes, fails));
			addTo(header, result);
			if (currentConfig.notifyOnFail && fails > 0) {
				totalFails += fails;
			}
			header.onclick = headerOnclickClosure(fixture);
		}

		function headerOnclickClosure(fixture) {
			return function () {
				var cn = fixture.className;
				fixture.className = 'testfixture' + status + collapsed + hidden;
			}
		}

		function fixtureShouldBeCollapsed(hasFails) {
			switch (currentConfig.collapse) {
				case CONFIG.COLLAPSE.NONE:
					return false;
				case CONFIG.COLLAPSE.ALL:
					return true;
				case CONFIG.COLLAPSE.PASSES:
					return !hasFails;
			}
		}

		function appendTestToHtml(testPassed, testName, msg) {
			var className = getTestClassName(testPassed);
			var test = html.makeDiv(className);
			var name = html.makeDiv('name');
			name.innerHTML = formatCodeParts(testName);
			addTo(test, name);
			if (typeof msg !== 'undefined') {
				var info = html.makeDiv('info');
				info.innerHTML = formatCodeParts(msg);
				addTo(test, info);
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

})(window.JTF.html = window.JTF.html || {});