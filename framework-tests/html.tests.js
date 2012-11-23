JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert;

		var dummyRootEl;

		new JTF.TestRunner.Batch([

			new JTF.TestFixture('HTML output tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.getElementById('dummy_root_element_for_testing');
					if(!dummyRootEl){
						dummyRootEl = document.createElement('div');
						dummyRootEl.id = 'dummy_root_element_for_testing';
						dummyRootEl.style.display = 'none';
						document.body.appendChild(dummyRootEl);
					}
				},

				'Controls contains \'Stop re-runs\' buttons when HTML.TestHandler is configured with runInterval > 0': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture()).run(new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						runInterval: 60000
					}));

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