(function (ctx) {

	var totalFails = 0;

	var CONFIG = ctx.CONFIG = {
		COLLAPSE: { NONE: 0, PASSES: 1, ALL: 2 },
	}

	var DefaultConfig = {
		collapse: CONFIG.COLLAPSE.PASSES,
		showPasses: true,
		runInterval: 0,
		notifyOnFail: false,
		rootElement: document.body
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

	ctx.TestHandler = function (configuration) {
		JTF.setState('', JTF.resources.progressIcon);
		var TestRunner = JTF.TestRunner;
		var currentConfig = addMissingConfigurations(configuration);
		var fixture, header, testsContainer;
		var reRunTimer;

		this.handle = function (handleType) {
			var TREvent = JTF.TestRunner.EVENT;
			var args = Array.prototype.slice.call(arguments, 1);
			switch (handleType) {
				case TREvent.BATCH.START:
					addControls();
					break;
				case TREvent.FIXTURE.START:
					createFixture();
					break;
				case TREvent.FIXTURE.DESC:
					setHeader(args[0]);
					break;
				case TREvent.FIXTURE.PASS:
					appendTestToHtml(true, args[0]);
					break;
				case TREvent.FIXTURE.FAIL:
					appendTestToHtml(false, args[0], args[1]);
					break;
				case TREvent.FIXTURE.STATS:
					statsOutputter(args[0], args[1]);
					break;
				case TREvent.FIXTURE.END:
					break;
				case TREvent.BATCH.END:
					batchEnd();
					break;
			}
		}

		function createFixture() {
			fixture = ctx.makeDiv('testfixture');
			header = ctx.makeDiv('header');
			testsContainer = ctx.makeDiv('tests');
			ctx.addTo(fixture, header);
			ctx.addTo(fixture, testsContainer);
			ctx.addTo(currentConfig.rootElement, fixture);
		}

		function setHeader(description) {
			var desc = ctx.makeDiv('description');
			desc.innerHTML = formatCodeParts(description);
			ctx.addTo(header, desc);
		}

		function appendTestToHtml(testPassed, testName, msg) {
			var className = getTestClassName(testPassed);
			var test = ctx.makeDiv(className);
			var name = ctx.makeDiv('name');
			name.innerHTML = formatCodeParts(testName);
			ctx.addTo(test, name);
			if (typeof msg !== 'undefined') {
				var info = ctx.makeDiv('info');
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
			var controls = ctx.makeDiv('controls');
			var label = ctx.makeEl('span');
			ctx.addTextTo(label, 'Expand:')

			ctx.addTo(controls, label);

			ctx.addTo(controls, ctx.makeOnClickButton('All', function () {
				ctx.removeClassFromMany('.testfixture.collapsed', 'collapsed');
			}));

			ctx.addTo(controls, ctx.makeOnClickButton('Passes', function () {
				ctx.removeClassFromMany('.testfixture.passed.collapsed', 'collapsed');
			}));

			ctx.addTo(controls, ctx.makeOnClickButton('Fails', function () {
				ctx.removeClassFromMany('.testfixture.failed.collapsed', 'collapsed');
			}));

			label = ctx.makeEl('span');
			label.style.marginLeft = '2em';
			ctx.addTextTo(label, 'Collapse:')
			ctx.addTo(controls, label);

			ctx.addTo(controls, ctx.makeOnClickButton('All', function () {
				ctx.addClassToMany('.testfixture', 'collapsed');
			}));

			ctx.addTo(controls, ctx.makeOnClickButton('Passes', function () {
				ctx.addClassToMany('.testfixture.passed', 'collapsed');
			}));

			ctx.addTo(controls, ctx.makeOnClickButton('Fails', function () {
				ctx.addClassToMany('.testfixture.failed', 'collapsed');
			}));

			if (currentConfig.showPasses) {
				var btn = ctx.makeOnClickButton('Hide Passes', function () {
					ctx.addClassToMany('.testfixture.passed', 'hidden');
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				ctx.addTo(controls, btn);
			}

			if (currentConfig.runInterval > 0) {
				btn = ctx.makeOnClickButton('Stop re-runs', function () {
					clearTimeout(reRunTimer);
					this.style.visibility = 'hidden';
				});
				btn.style.marginLeft = '2em';
				ctx.addTo(controls, btn);
			}

			var btn = ctx.makeOnClickButton('Reload', function () {
				window.location.reload();
			});
			btn.style.marginLeft = '2em';
			ctx.addTo(controls, btn);

			ctx.addTo(currentConfig.rootElement, controls);
		}

		function statsOutputter(passes, fails) {
			if (fixtureShouldBeCollapsed(fails > 0))
				fixture.className += ' collapsed';
			fixture.className += fails > 0 ? ' failed' : ' passed';
			if (fails === 0 && !currentConfig.showPasses)
				fixture.className += ' hidden';
			var result = ctx.makeDiv('result');
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