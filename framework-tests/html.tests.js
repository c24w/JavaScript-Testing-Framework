JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var Assert = JTF.Assert;
		var TestFixture = JTF.TestFixture;
		var TestRunner = JTF.TestRunner;
		var dummyRootEl, htmlHandler;

		var fixtures = [

			new TestFixture('HTML structure tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
					htmlHandler = new JTF.HTML.TestHandler({ rootElement: dummyRootEl });
				},

				'Controls contains \'Stop re-runs\' button when runInterval > 0': function () {
					htmlHandler = new JTF.HTML.TestHandler({ rootElement: dummyRootEl, runInterval: 9999999 });
					new TestRunner().run(htmlHandler);

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
					new TestRunner().run(htmlHandler);

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
					htmlHandler = new JTF.HTML.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.HTML.CONFIG.COLLAPSE.ALL
					});
					new TestRunner([
						new TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture collapsed failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.PASSES set have the expected class names': function () {
					htmlHandler = new JTF.HTML.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES
					});
					new TestRunner([
						new TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture collapsed passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture failed');
				},

				'Passed/failed test fixtures with CONFIG.COLLAPSE.NONE set have the expected class names': function () {
					htmlHandler = new JTF.HTML.TestHandler({
						rootElement: dummyRootEl,
						collapse: JTF.HTML.CONFIG.COLLAPSE.NONE
					});
					new TestRunner([
						new TestFixture('Passed fixture', { 'Passing test': function () { Assert.true(true) } }),
						new TestFixture('Failed fixture', { 'Failing test': function () { Assert.true(false) } })
					]).run(htmlHandler);

					assertTagAndClass(dummyRootEl.children[1], 'div', 'testfixture passed');
					assertTagAndClass(dummyRootEl.children[2], 'div', 'testfixture failed');
				},

				'Test fixtures element contains a header element which contains description and result elements': function () {
					new TestRunner(new TestFixture('Passed fixture'))
						.run(htmlHandler);

					var fixture = dummyRootEl.children[1], header = fixture.children[0];
					var desc = header.children[0], result = header.children[1];

					assertTagAndClass(header, 'div', 'header');
					assertTagAndClass(desc, 'div', 'description');
					assertTagAndClass(result, 'div', 'result');
				}

			}),

			new TestFixture('HTML value tests', {

				TEST_SETUP: function () {
					dummyRootEl = document.createElement('div');
					htmlHandler = new JTF.HTML.TestHandler({ rootElement: dummyRootEl });
				},

				'Test fixture > header > description contains the expected value': function () {
					new TestRunner(new TestFixture('Empty fixture')).run(htmlHandler);

					var desc = dummyRootEl.children[1].children[0].children[0];
					assertInnerHtml(desc, 'Empty fixture');
				},

				'getStatsLine returns the expected value for no tests': function () {
					new TestRunner(new TestFixture()).run(htmlHandler);
					var result = dummyRootEl.children[1].children[0].children[1];
					assertInnerHtml(result, 'fixture contains no tests');
				},

				'getStatsLine returns the the expected value for all passed tests': function () {
					new TestRunner(new TestFixture('', {
						'Passing test': function () {
							Assert.true(true)
						}
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					assertInnerHtml(result, '1 passed');
				},

				'getStatsLine returns the the expected value for all failed tests': function () {
					new TestRunner(new TestFixture('', {
						'Failing test': function () { Assert.true(false) }
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					assertInnerHtml(result, '1 failed');
				},

				'getStatsLine returns the the expected value for mixed passed/failed tests': function () {
					new TestRunner(new TestFixture('', {
						'Passing test': function () { Assert.true(true) },
						'Failing test': function () { Assert.true(false) }
					})).run(htmlHandler);

					var result = dummyRootEl.children[1].children[0].children[1];
					assertInnerHtml(result, '1/2 failed');
				},

				'Test fixture > header > results contains the value of getStatsLine': function () {
					new TestRunner(new TestFixture()).run(htmlHandler);
					var result = dummyRootEl.children[1].children[0].children[1];
					assertInnerHtml(result, JTF.HTML.getStatsLine(0, 0, 0));
				}

			})

		];

		JTF.runToHtml(fixtures, {
			collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
			runInterval: 30000
		});

		function getTagName(el) {
			return el.tagName.toLowerCase();
		}

		function assertTagAndClass(el, tag, className) {
			assertTag(el, tag);
			assertClass(el, className);
		}

		function assertTagAndInnerHtml(el, tag, innerHtml) {
			assertTag(el, tag);
			assertInnerHtml(el, innerHtml);
		}

		function assertTag(el, tag) {
			Assert.equal(getTagName(el), tag);
		}

		function assertClass(el, className) {
			Assert.equal(el.className, className);
		}

		function assertInnerHtml(el, innerHtml) {
			Assert.equal(el.innerHTML, innerHtml);
		}

	});
});