(function (ctx) {

	ctx.TestFixture = function (description, tests) {
		this.getDescription = function () { return (!description ? TestFixture.DefaultDescription : description) }
		this.getTests = function () { return tests }
	}

	ctx.TestFixture.DefaultDescription = 'Test Fixture';

})(window.JTF = window.JTF || {});