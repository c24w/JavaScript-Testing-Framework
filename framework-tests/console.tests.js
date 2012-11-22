JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {
		JTF.loadConsoleResources(function () {

			var logMsgs, errorMsgs;
			var Assert = JTF.Assert;
			var console = JTF.console;

			new JTF.TestRunner.Batch([

				new JTF.TestFixture('Console output tests (constant outputs)', {

					FIXTURE_SETUP: function () {
						logMsgs = [];
						window.console = { log: function (msg) { logMsgs[logMsgs.length] = msg } };
						new JTF.TestRunner
							.Single(new JTF.TestFixture('Demo test fixture', {}))
							.run(new JTF.console.TestHandler());
					},

					'A new line should be outputted first, to console.log': function () {
						Assert.that(logMsgs[0]).equals('');
					},

					'Description should be outputted second, to console.log, in the expected format': function () {
						Assert.that(logMsgs[1]).equals(console.getDescriptionLine('Demo test fixture'));
					}

				}),

				new JTF.TestFixture('Console output tests (passing tests))', {

					FIXTURE_SETUP: function () {
						logMsgs = [];

						var demoFixture = new JTF.TestFixture('Demo test fixture', {
							'Passing test 1': function () { Assert.true(true) },
							'Passing test 2': function () { Assert.true(true) },
							'Passing test 3': function () { Assert.true(true) },
						});

						window.console = { log: function (msg) { logMsgs[logMsgs.length] = msg } };

						new JTF.TestRunner.Single(demoFixture).run(new JTF.console.TestHandler());
					},

					'Passing tests should be outputted, to console.log, in the expected format': function () {
						var numTests = 3;
						Assert.greater(logMsgs.length, numTests - 1, 'at least {0} calls to console.log should have been made - 1 per passing test'.format(numTests));
						for (var i = 0; i < numTests;) {
							Assert.that(logMsgs[i + 2]).equals(console.getPassedTestLine('Passing test ' + ++i));
						}
					},

					'Statistics should be outputted to console.log, in the expected format': function () {
						Assert.that(logMsgs[logMsgs.length - 1]).equals(JTF.console.getStatsLine(3, 0));
					}

				}),

				new JTF.TestFixture('Console output tests (failing tests))', {

					FIXTURE_SETUP: function () {
						errorMsgs = [];

						var demoFixture = new JTF.TestFixture('Demo test fixture', {
							'Failing test 1': function () { Assert.true(false, 'fail message 1') },
							'Failing test 2': function () { Assert.true(false, 'fail message 2') },
							'Failing test 3': function () { Assert.true(false, 'fail message 3') }
						});

						window.console = { log: function () { }, error: function (msg) { errorMsgs[errorMsgs.length] = msg } };

						new JTF.TestRunner.Single(demoFixture).run(new JTF.console.TestHandler());
					},

					'Failing tests should be outputted, to console.error, in the expected format': function () {
						var numTests = 3;
						Assert.greater(logMsgs.length, numTests - 1, 'at least {0} calls to console.log should have been made - 1 per passing test'.format(numTests));
						for (var i = 0; i < numTests;) {
							Assert.that(errorMsgs[i++]).equals(console.getFailedTestLine('Failing test ' + i, 'fail message ' + i));
						}
					},

					'Statistics should be outputted to console.error, in the expected format': function () {
						Assert.that(errorMsgs[errorMsgs.length - 1]).equals(JTF.console.getStatsLine(0, 3));
					}

				}),

				new JTF.TestFixture('Console output tests (mixed passing/failing tests)', {

					FIXTURE_SETUP: function () {
						logMsgs = [];
						errorMsgs = [];

						var demoFixture = new JTF.TestFixture('Demo test fixture', {
							'Passing test 1': function () { Assert.true(true) },
							'Failing test 1': function () { Assert.true(false, 'fail message 1') },
							'Failing test 2': function () { Assert.true(false, 'fail message 2') },
							'Passing test 2': function () { Assert.true(true) },
							'Passing test 3': function () { Assert.true(true) },
							'Failing test 3': function () { Assert.true(false, 'fail message 3') }
						});

						window.console = {
							log: function (msg) { logMsgs[logMsgs.length] = msg },
							error: function (msg) { errorMsgs[errorMsgs.length] = msg },
						};

						new JTF.TestRunner.Single(demoFixture).run(new JTF.console.TestHandler());
					},

					'Passing tests should be outputted, to console.log, in the expected format': function () {
						var numTests = 3;
						Assert.greater(logMsgs.length, numTests - 1, 'at least {0} calls to console.log should have been made - 1 per passing test'.format(numTests));
						for (var i = 0; i < numTests;) {
							Assert.that(logMsgs[i + 2]).equals(console.getPassedTestLine('Passing test ' + ++i));
						}
					},

					'Failing tests should be outputted, to console.error, in the expected format': function () {
						var numTests = 3;
						Assert.greater(logMsgs.length, numTests - 1, 'at least {0} calls to console.error should have been made - 1 per failing test'.format(numTests));
						for (var i = 0; i < numTests;) {
							Assert.that(errorMsgs[i++]).equals(console.getFailedTestLine('Failing test ' + i, 'fail message ' + i));
						}
					},

					'Statistics should be outputted, to console.error, in the expected format': function () {
						Assert.that(errorMsgs[errorMsgs.length - 1]).equals(JTF.console.getStatsLine(3, 3));
					}

				})

			]).run(new JTF.html.TestHandler({
				collapse: JTF.html.CONFIG.COLLAPSE.PASSES,
				showPasses: true,
				notifyOnFail: false,
				runInterval: 10000
			}));

		});
	});
});