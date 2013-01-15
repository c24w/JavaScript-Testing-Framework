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
		var batchHasFails = false;

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
					console.error(args[0] + ' - ' + args[1]);
					break;
				case EVT.FIXTURE.STATS:
					statsOutputter(args[0], args[1]);
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
			desc.innerHTML = formatCodeParts(description);
			HTML.addTo(header, desc);
		}

		function appendTestToHtml(testPassed, testName, msg) {
			var className = getTestClassName(testPassed);
			var test = HTML.makeDiv(className);
			var name = HTML.makeDiv('name');
			name.innerHTML = formatCodeParts(testName);
			HTML.addTo(test, name);
			if (typeof msg !== 'undefined') {
				var info = HTML.makeDiv('info');
				info.innerHTML = formatCodeParts(msg);
				HTML.addTo(test, info);
			}
			HTML.addTo(testsContainer, test);
		}

		function batchEnd() {
			if (batchHasFails) {
				JTF.setState('', JTF.resources.failIcon);
				if (currentConfig.notifyOnFail) {
					if (isSetToReRun()) {
						if (shouldCancelReRuns())
							currentConfig.runInterval = 0;
					}
					else showFailsAlert();
				}
			}
			else JTF.setState('', JTF.resources.passIcon);
			if (currentConfig.runInterval > 0)
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

		function statsOutputter(passes, fails) {
			if (fixtureShouldBeCollapsed(fails === 0))
				fixture.className += ' collapsed';
			fixture.className += fails > 0 ? ' failed' : ' passed';
			if (fails === 0 && !currentConfig.showPassedFixtures)
				fixture.className += ' hidden';
			var result = HTML.makeDiv('result');
			HTML.addTextTo(result, HTML.getStatsLine(passes, fails));
			HTML.addTo(header, result);
			if (fails > 0) batchHasFails = true;
			header.onclick = headerOnclickClosure(fixture);
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

		function fixtureShouldBeCollapsed(fixturePassed) {
			switch (currentConfig.collapse) {
				case CONFIG.COLLAPSE.NONE:
					return false;
				case CONFIG.COLLAPSE.ALL:
					return true;
				case CONFIG.COLLAPSE.PASSES:
					return fixturePassed;
			}
		}

		HTML.getStatsLine = function (passes, fails) {
			var total = passes + fails;
			switch (total) {
				case 0: return 'fixture contains no tests';
				case passes: return passes + ' passed';
				case fails: return fails + ' failed';
				default: return fails + '/' + total + ' failed';
			}
		}
	}

	function getTestClassName(testPassed) {
		var resultClass = testPassed ? ' pass' : ' fail';
		var className = 'test' + resultClass;
		return className;
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

});