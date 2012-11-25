JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert, dummyRootEl;

		new JTF.TestRunner.Batch([

			new JTF.TestFixture('HTML output tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
				},

				'Controls contains \'Stop re-runs\' button when runInterval > 0': function () {
					var handler = new JTF.html.TestHandler({ rootElement: dummyRootEl, runInterval: 9999999 });
					new JTF.TestRunner.Batch().run(handler);

					var controlsRoot = dummyRootEl.firstChild;
					Assert.that(getTagName(controlsRoot)).equals('div');
					Assert.that(controlsRoot.className).equals('controls');

					var actControlEls = controlsRoot.children;
					var expControlEls = [['span', 'Expand:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['span', 'Collapse:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['button', 'Hide Passes'], ['button', 'Stop re-runs'], ['button', 'Reload']];

					Assert.equal(actControlEls.length, expControlEls.length, 'Expected: {0} control elements, found: {1}'.format(expControlEls.length, actControlEls.length));

					for (var i = 0; i < expControlEls.length; i++)
						assertIsTagWithInnerHtml(actControlEls[i], expControlEls[i][0], expControlEls[i][1]);
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

					for (var i = 0; i < expControlEls.length; i++)
						assertIsTagWithInnerHtml(actControlEls[i], expControlEls[i][0], expControlEls[i][1]);
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.ALL set have the expected class names': function () {
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.ALL
					}));

					assertIsTagWithClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertIsTagWithClass(dummyRootEl.children[2], 'div', 'testfixture collapsed failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.PASSES set have the expected class names': function () {
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.PASSES
					}));

					assertIsTagWithClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertIsTagWithClass(dummyRootEl.children[2], 'div', 'testfixture failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.NONE set have the expected class names': function () {
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.NONE
					}));

					assertIsTagWithClass(dummyRootEl.children[1], 'div', 'testfixture passed');
					assertIsTagWithClass(dummyRootEl.children[2], 'div', 'testfixture failed');
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

		function assertIsTagWithClass(el, tag, className) {
			Assert.that(getTagName(el)).equals(tag);
			Assert.that(el.className).equals(className);
		}

		function assertIsTagWithInnerHtml(el, tag, innerHtml) {
			Assert.equal(getTagName(el), tag);
			Assert.equal(el.innerHTML, innerHtml);
		}

	});
});