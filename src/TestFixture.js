(function (ctx) {

	ctx.TestFixture = function (description, tests) {
		this.getDescription = function () { return description || ctx.TestFixture.DefaultDescription }
		this.getTests = function () { return tests || {} }
	}

	ctx.TestFixture.DefaultDescription = 'Test Fixture';

})(window.JTF = window.JTF || {});