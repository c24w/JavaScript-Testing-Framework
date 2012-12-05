JTF.namespaceAtRoot(function (root) {

	root.TestFixture = function (description, tests) {
		this.getDescription = function () { return description || root.TestFixture.DefaultDescription }
		this.getTests = function () { return tests || {} }
	}

	root.TestFixture.DefaultDescription = 'Test Fixture';

});