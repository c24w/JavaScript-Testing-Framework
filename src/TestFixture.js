JTF.namespaceAtRoot(function (JTF) {

	JTF.TestFixture = function (description, tests) {
		if (typeof description === 'object') {
			tests = description;
			description = defaultDesc;
		}
		this.getDescription = function () { return description || defaultDesc };
		this.getTests = function () { return tests || {} };
	};

	var defaultDesc = JTF.TestFixture.DefaultDescription = 'Test Fixture';

});