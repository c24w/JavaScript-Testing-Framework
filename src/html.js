JTF.namespace('HTML', function (HTML) {

	var CONFIG = HTML.CONFIG = {
		COLLAPSE: { NONE: 0, PASSES: 1, ALL: 2 },
	}

	var DefaultConfig = {
		collapse: CONFIG.COLLAPSE.PASSES,
		showPassedFixtures: true,
		runInterval: 0,
		notifyOnFail: false,
		rootElement: document.body
	}

	function updatePartialConfig(partialConfig) {
		if (!partialConfig || !(partialConfig instanceof Object))
			return DefaultConfig;
		else {
			for (var key in DefaultConfig) {
				if (!partialConfig.hasOwnProperty(key))
					partialConfig[key] = DefaultConfig[key];
			}
			return partialConfig;
		}
	}

	HTML.TestHandler = function (configuration) {
		var PAGE_STATUS = {
			PASS: 0,
			FAIL: 1,
			ERROR: 2
		};
		var pageStatus;

		JTF.setState('', JTF.resources.progressIcon);
		var TestRunner = JTF.TestRunner;
		var currentConfig = updatePartialConfig(configuration);
		var fixture, header, testsContainer;
		var reRunTimer;

		this.handle = function (handleType) {
			var EVT = JTF.EVENT;
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case EVT.BATCH.START:
					addControls();
					break;
				case EVT.FIXTURE.START:
					createFixture();
					break;
				case EVT.FIXTURE.DESC:
					setHeader(args[0]);
					break;
				case EVT.TEST.PASS:
					appendTestToHtml(true, args[0]);
					break;
				case EVT.TEST.FAIL:
					appendTestToHtml(false, args[0], args[1]);
					break;
				case EVT.TEST.ERROR:
					addTestError(args[0], args[1]);
					break;
				case EVT.FIXTURE.STATS:
					statsOutputter(args[0], args[1], args[2]);
					break;
				case EVT.FIXTURE.END:
					break;
				case EVT.BATCH.END:
					batchEnd();
					break;
			}
		};

		function createFixture() {
			fixture = HTML.makeDiv('testfixture');
			header = HTML.makeDiv('header');
			testsContainer = HTML.makeDiv('tests');
			HTML.addTo(fixture, header);
			HTML.addTo(fixture, testsContainer);
			HTML.addTo(currentConfig.rootElement, fixture);
		}

		function setHeader(description) {
			var desc = HTML.makeDiv('description');
			desc.innerHTML = description;
			HTML.addTo(header, desc);
		}

		function appendTestToHtml(testPassed, testName, msg) {
			var className = getTestClassName(testPassed);
			var test = HTML.makeDiv(className);
			var name = HTML.makeDiv('name');
			name.innerHTML = testName;
			HTML.addTo(test, name);
			if (typeof msg !== 'undefined') {
				var info = HTML.makeDiv('info');
				info.innerHTML = msg;
				HTML.addTo(test, info);
			}
			HTML.addTo(testsContainer, test);
		}

		function addTestError(testName, error) {
			var testError = HTML.makeDiv('test error');
			var name = HTML.makeDiv('name');
			name.innerHTML = testName;
			HTML.addTo(testError, name);
			var info = HTML.makeDiv('info');
			info.innerHTML = error;
			HTML.addTo(testError, info);
			HTML.addTo(testsContainer, testError);
		}

		function batchEnd() {
			if (pageStatus === PAGE_STATUS.PASS)
				JTF.setState('', JTF.resources.passIcon);
			else if (pageStatus === PAGE_STATUS.FAIL) {
				JTF.setState('', JTF.resources.failIcon);
				if (currentConfig.notifyOnFail) {
					if (isSetToReRun()) {
						if (shouldCancelReRuns())
							currentConfig.runInterval = 0;
					}
					else showFailsAlert();
				}
			}
			else if (pageStatus === PAGE_STATUS.ERROR)
				JTF.setState('', JTF.resources.errorIcon);
			if (isSetToReRun())
				reRunTimer = setTimeout(function () { JTF.reload(); }, currentConfig.runInterval);
		}

		function shouldCancelReRuns() {
			return confirm('Tests failed\n\nOK = review tests\n(stop further re-runs)\n\nCancel = ignore & continue')
		}

		function showFailsAlert() {
			alert('Tests failed')
		}

		function isSetToReRun() {
			return currentConfig.runInterval > 0;
		}

		function addControls() {
			var controls = HTML.makeDiv('controls');
			var label = HTML.makeEl('span');
			HTML.addTextTo(label, 'Expand:')

			HTML.addTo(controls, label);

			HTML.addTo(controls, HTML.makeOnClickButton('All', function () {
				HTML.removeClassFromMany('.testfixture.collapsed', 'collapsed');
			}));

			HTML.addTo(controls, HTML.makeOnClickButton('Passes', function () {
				HTML.removeClassFromMany('.testfixture.passed.collapsed', 'collapsed');
			}));

			HTML.addTo(controls, HTML.makeOnClickButton('Fails', function () {
				HTML.removeClassFromMany('.testfixture.failed.collapsed', 'collapsed');
			}));

			label = HTML.makeEl('span');
			label.style.marginLeft = '2em';
			HTML.addTextTo(label, 'Collapse:')
			HTML.addTo(controls, label);

			HTML.addTo(controls, HTML.makeOnClickButton('All', function () {
				HTML.addClassToMany('.testfixture', 'collapsed');
			}));

			HTML.addTo(controls, HTML.makeOnClickButton('Passes', function () {
				HTML.addClassToMany('.testfixture.passed', 'collapsed');
			}));

			HTML.addTo(controls, HTML.makeOnClickButton('Fails', function () {
				HTML.addClassToMany('.testfixture.failed', 'collapsed');
			}));

			if (currentConfig.showPassedFixtures) {
				var btn = HTML.makeOnClickButton('Hide Passes', function () {
					HTML.addClassToMany('.testfixture.passed', 'hidden');
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				HTML.addTo(controls, btn);
			}

			if (currentConfig.runInterval > 0) {
				btn = HTML.makeOnClickButton('Stop re-runs', function () {
					clearTimeout(reRunTimer);
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				HTML.addTo(controls, btn);
			}

			var btn = HTML.makeOnClickButton('Reload', JTF.reload);
			btn.style.marginLeft = '2em';
			HTML.addTo(controls, btn);

			HTML.addTo(currentConfig.rootElement, controls);
		}

		function statsOutputter(passes, fails, testErrors) {
			var hasFails = fails > 0;
			var hasErrors = testErrors > 0;
			if (fixtureShouldBeCollapsed(hasFails || hasErrors))
				fixture.className += ' collapsed';
			fixture.className += hasErrors ? ' withErrors' : hasFails ? ' failed' : ' passed';
			if (!hasFails && !currentConfig.showPassedFixtures)
				fixture.className += ' hidden';
			var result = HTML.makeDiv('result');
			HTML.addTextTo(result, HTML.getStatsLine(passes, fails, testErrors));
			HTML.addTo(header, result);
			if (typeof pageStatus === 'undefined') {
				pageStatus = getPageStatus(hasErrors, hasFails);
			}
			header.onclick = headerOnclickClosure(fixture);
		}

		function getPageStatus(hasErrors, hasFails) {
			var ps = PAGE_STATUS;
			if (hasErrors) return ps.ERROR;
			if (hasFails) return ps.FAIL;
			return ps.PASS;
		}

		function headerOnclickClosure(fixture) {
			return function () {
				var cn = fixture.className;
				if (cn.indexOf('collapsed') === -1)
					HTML.addClassTo(fixture, 'collapsed');
				else
					HTML.removeClassFrom(fixture, 'collapsed');
			}
		}

		function fixtureShouldBeCollapsed(hasFailsOrErrors) {
			switch (currentConfig.collapse) {
				case CONFIG.COLLAPSE.NONE:
					return false;
				case CONFIG.COLLAPSE.ALL:
					return true;
				case CONFIG.COLLAPSE.PASSES:
					return !hasFailsOrErrors;
			}
		}

		HTML.getStatsLine = function (passes, fails, testErrors) {
			var total = passes + fails + testErrors;
			if (total === 0) return 'fixture contains no tests';

			var passMsg = passes + ' passed';
			if (passes === total) return passMsg;

			var failMsg = fails + ' failed';
			if (fails === total) return failMsg;

			var hadErrorsMsg = testErrors + ' had errors';
			if (testErrors === total) return hadErrorsMsg;

			if (testErrors > 0) {
				var result = [];
				var append = function (item) { result[result.length] = item; };
				append(hadErrorsMsg);
				if (passes > 0) append(passMsg);
				if (fails > 0) append(failMsg);
				return result.join(' : : ');
			}
			else return fails + '/' + total + ' failed';

		}

	}

	function getTestClassName(testPassed) {
		var resultClass = testPassed ? ' pass' : ' fail';
		var className = 'test' + resultClass;
		return className;
	}

	/*function formatCodeParts(testName) {
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
	}*/

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

});