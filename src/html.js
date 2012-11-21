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

	function addMissingConfigurations(config) {
		if (!config) return DefaultConfig;
		else {
			for (var option in DefaultConfig) {
				config[option] = config[option] || DefaultConfig[option];
			}
		}
		return config;
	}

	html.TestHandler = function (configuration) {
		JTF.setState('', JTF.resources.progressIcon);
		var TestRunner = JTF.TestRunner;
		var currentConfig = addMissingConfigurations(configuration);
		var fixture, header, testsContainer;
		var reRunTimer;

		this.handle = function (handleType) {
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TestRunner.EVENT.BATCH.START:
					addControls();
					break;
				case TestRunner.EVENT.FIXTURE.START:
					createFixture();
					break;
				case TestRunner.EVENT.FIXTURE.DESC:
					setHeader(args[0]);
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

		function createFixture() {
			fixture = html.makeDiv('testfixture');
			header = html.makeDiv('header');
			testsContainer = html.makeDiv('tests');
			ctx.addTo(fixture, header);
			ctx.addTo(fixture, testsContainer);
			ctx.addTo(document.body, fixture);
		}

		function setHeader(description) {
			var desc = html.makeDiv('description');
			desc.innerHTML = formatCodeParts(description);
			ctx.addTo(header, desc);
		}

		function appendTestToHtml(testPassed, testName, msg) {
			var className = getTestClassName(testPassed);
			var test = html.makeDiv(className);
			var name = html.makeDiv('name');
			name.innerHTML = formatCodeParts(testName);
			ctx.addTo(test, name);
			if (typeof msg !== 'undefined') {
				var info = html.makeDiv('info');
				info.innerHTML = formatCodeParts(msg);
				ctx.addTo(test, info);
			}
			ctx.addTo(testsContainer, test);
		}

		function batchEnd() {
			if (totalFails > 0) {
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

		function addControls() {
			var controls = html.makeDiv('controls');
			var label = html.makeEl('span');
			ctx.addTextTo(label, 'Expand:')

			ctx.addTo(controls, label);

			ctx.addTo(controls, html.makeOnClickButton('All', function () {
				html.removeClassFromMany('.testfixture.collapsed', 'collapsed');
			}));

			ctx.addTo(controls, html.makeOnClickButton('Passes', function () {
				html.removeClassFromMany('.testfixture.passed.collapsed', 'collapsed');
			}));

			ctx.addTo(controls, html.makeOnClickButton('Fails', function () {
				html.removeClassFromMany('.testfixture.failed.collapsed', 'collapsed');
			}));

			label = html.makeEl('span');
			label.style.marginLeft = '2em';
			ctx.addTextTo(label, 'Collapse:')
			ctx.addTo(controls, label);

			ctx.addTo(controls, html.makeOnClickButton('All', function () {
				html.addClassToMany('.testfixture', 'collapsed');
			}));

			ctx.addTo(controls, html.makeOnClickButton('Passes', function () {
				html.addClassToMany('.testfixture.passed', 'collapsed');
			}));

			ctx.addTo(controls, html.makeOnClickButton('Fails', function () {
				html.addClassToMany('.testfixture.failed', 'collapsed');
			}));

			if (currentConfig.showPasses) {
				var btn = html.makeOnClickButton('Hide Passes', function () {
					html.addClassToMany('.testfixture.passed', 'hidden');
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				ctx.addTo(controls, btn);
			}

			if (currentConfig.runInterval > 0) {
				btn = html.makeOnClickButton('Stop re-runs', function () {
					clearTimeout(reRunTimer);
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				ctx.addTo(controls, btn);
			}

			var btn = html.makeOnClickButton('Reload', function () {
				window.location.reload();
			});
			btn.style.marginLeft = '2em';
			ctx.addTo(controls, btn);

			ctx.addTo(document.body, controls);
		}

		function statsOutputter(passes, fails) {
			if (fixtureShouldBeCollapsed(fails > 0))
				fixture.className += ' collapsed';
			fixture.className += fails > 0 ? ' failed' : ' passed';
			if (fails === 0 && !currentConfig.showPasses)
				fixture.className += ' hidden';
			var result = html.makeDiv('result');
			ctx.addTextTo(result, getResultMessage(passes, fails));
			ctx.addTo(header, result);
			if (fails > 0) {
				totalFails += fails;
			}
			header.onclick = headerOnclickClosure(fixture);
		}

		function headerOnclickClosure(fixture) {
			return function () {
				var cn = fixture.className;
				if (cn.indexOf('collapsed') === -1)
					ctx.addClassTo(fixture, 'collapsed');
				else
					ctx.removeClassFrom(fixture, 'collapsed');
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