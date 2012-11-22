JTF.loadFramework(function () {
	JTF.loadHtmlResources(function () {

		var logMsgs, errorMsgs;
		var Assert = JTF.Assert;

		new JTF.TestRunner.Batch([

			new JTF.TestFixture('HTML output tests', {

				FIXTURE_SETUP: function () {
					var oldFunc = document.createElement;
					document.createElement = function (tag) {
						console.log(tag);
						return oldFunc.call(document, tag);
					};
				},

				'': function () {

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