JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert, dummyRootEl;

		new JTF.TestRunner.Batch([

			new JTF.TestFixture('HTML output tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
				},

				'Controls contains \'Stop re-runs\' button when runInterval > 0': function () {
					new JTF.TestRunner.Batch().run(new JTF.html.TestHandler({ rootElement: dummyRootEl, runInterval: 60000 }));

					var controlsRoot = dummyRootEl.firstChild;
					Assert.that(getTagName(controlsRoot)).equals('div');
					Assert.that(controlsRoot.className).equals('controls');

					var actControlEls = controlsRoot.children;
					var expControlEls = [['span', 'Expand:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['span', 'Collapse:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['button', 'Hide Passes'], ['button', 'Stop re-runs'], ['button', 'Reload']];

					Assert.equal(actControlEls.length, expControlEls.length, 'Expected: {0} control elements, found: {1}'.format(expControlEls.length, actControlEls.length));

					for (var i = 0; i < expControlEls.length; i++) {
						Assert.equal(getTagName(actControlEls[i]), expControlEls[i][0]);
						Assert.equal(actControlEls[i].innerHTML, expControlEls[i][1]);
					}

				},

				'Controls does not contains \'Stop re-runs\' button when runInterval is set to 0': function () {
					new JTF.TestRunner.Batch().run(new JTF.html.TestHandler({ rootElement: dummyRootEl }));

					var controlsRoot = dummyRootEl.firstChild;
					Assert.that(getTagName(controlsRoot)).equals('div');
					Assert.that(controlsRoot.className).equals('controls');

					var actControlEls = controlsRoot.children;
					var expControlEls = [['span', 'Expand:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['span', 'Collapse:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['button', 'Hide Passes'], ['button', 'Reload']];

					Assert.equal(actControlEls.length, expControlEls.length, 'Expected: {0} control elements, found: {1}'.format(expControlEls.length, actControlEls.length));

					for (var i = 0; i < expControlEls.length; i++) {
						Assert.equal(getTagName(actControlEls[i]), expControlEls[i][0]);
						Assert.equal(actControlEls[i].innerHTML, expControlEls[i][1]);
					}

				}

			})

		]).run(new JTF.html.TestHandler({
			collapse: JTF.html.CONFIG.COLLAPSE.PASSES,
			showPasses: true,
			notifyOnFail: false,
			runInterval: 10000
		}));

		function getTagName(el) {
			return el.tagName.toLowerCase();
		}

	});
});