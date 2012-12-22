JTF.namespaceAtRoot(function (JTF) {

	JTF.TestFixture = function (description, tests) {
		this.getDescription = function () { return description || JTF.TestFixture.DefaultDescription }
		this.getTests = function () { return tests || {} }
	}

	JTF.TestFixture.DefaultDescription = 'Test Fixture';

});