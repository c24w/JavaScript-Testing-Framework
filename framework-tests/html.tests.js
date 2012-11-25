JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert, dummyRootEl, htmlHandler;

		new JTF.TestRunner.Batch([

			new JTF.TestFixture('HTML structure tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
					htmlHandler = new JTF.html.TestHandler({ rootElement: dummyRootEl });
				},

				'Controls contains \'Stop re-runs\' button when runInterval > 0': function () {
					htmlHandler = new JTF.html.TestHandler({ rootElement: dummyRootEl, runInterval: 9999999 });
					new JTF.TestRunner.Batch().run(htmlHandler);

					var controlsRoot = dummyRootEl.firstChild;
					Assert.that(getTagName(controlsRoot)).equals('div');
					Assert.that(controlsRoot.className).equals('controls');

					var actControlEls = controlsRoot.children;
					var expControlEls = [['span', 'Expand:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['span', 'Collapse:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['button', 'Hide Passes'], ['button', 'Stop re-runs'], ['button', 'Reload']];

					Assert.equal(actControlEls.length, expControlEls.length, 'Expected: {0} control elements, found: {1}'.format(expControlEls.length, actControlEls.length));

					for (var i = 0; i < expControlEls.length; i++)
						assertTagAndInnerHtml(actControlEls[i], expControlEls[i][0], expControlEls[i][1]);
				},

				'Controls does not contains \'Stop re-runs\' button when runInterval is set to 0': function () {
					new JTF.TestRunner.Batch().run(htmlHandler);

					var controlsRoot = dummyRootEl.firstChild;
					Assert.that(getTagName(controlsRoot)).equals('div');
					Assert.that(controlsRoot.className).equals('controls');

					var actControlEls = controlsRoot.children;
					var expControlEls = [['span', 'Expand:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['span', 'Collapse:'], ['button', 'All'], ['button', 'Passes'], ['button', 'Fails'],
										 ['button', 'Hide Passes'], ['button', 'Reload']];

					Assert.equal(actControlEls.length, expControlEls.length, 'Expected: {0} control elements, found: {1}'.format(expControlEls.length, actControlEls.length));

					for (var i = 0; i < expControlEls.length; i++)
						assertTagAndInnerHtml(actControlEls[i], expControlEls[i][0], expControlEls[i][1]);
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.ALL set have the expected class names': function () {
					htmlHandler = new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.ALL
					});
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture collapsed failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.PASSES set have the expected class names': function () {
					htmlHandler = new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.PASSES
					});
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.NONE set have the expected class names': function () {
					htmlHandler = new JTF.html.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.html.CONFIG.COLLAPSE.NONE
					});
					new JTF.TestRunner.Batch([
						new JTF.TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new JTF.TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture failed');
				},

				'Test fixtures element contains a header element which contains description and result elements': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture('Passed fixture'))
						.run(htmlHandler);

					var fixture = dummyRootEl.children[1], header = fixture.children[0];
					assertTagAndClass(header, 'div', 'header');

					var desc = header.children[0], result = header.children[1];
					assertTagAndClass(desc, 'div', 'description');
					assertTagAndClass(result, 'div', 'result');
				}

			}),

			new JTF.TestFixture('HTML value tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
					htmlHandler = new JTF.html.TestHandler({ rootElement: dummyRootEl });
				},

				'getStatsLine returns the expected value for no tests': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture()).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					Assert.equal(result.innerHTML, 'fixture contains no tests');
				},

				'getStatsLine returns the the expected value for all passed tests': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture('', {
						'Passing test': function () {
							Assert.true(true)
						}
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					Assert.equal(result.innerHTML, '1 passed');
				},

				'getStatsLine returns the the expected value for all failed tests': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture('', {
						'Failing test': function () { Assert.true(false) }
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					Assert.equal(result.innerHTML, '1 failed');
				},

				'getStatsLine returns the the expected value for mixed passed/failed tests': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture('', {
						'Passing test': function () { Assert.true(true) },
						'Failing test': function () { Assert.true(false) }
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					Assert.equal(result.innerHTML, '1/2 failed');
				},

				'Test fixture > header > description contains the expected value': function () {
					new JTF.TestRunner.Single(new JTF.TestFixture('Empty fixture')).run(htmlHandler);

					var desc = dummyRootEl.children[1].children[0].children[0];
					Assert.equal(desc.innerHTML, 'Empty fixture');
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

		function assertTagAndClass(el, tag, className) {
			Assert.that(getTagName(el)).equals(tag);
			Assert.that(el.className).equals(className);
		}

		function assertTagAndInnerHtml(el, tag, innerHtml) {
			Assert.equal(getTagName(el), tag);
			Assert.equal(el.innerHTML, innerHtml);
		}

	});
});