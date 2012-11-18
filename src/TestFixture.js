function TestFixture(description, tests) {
	this.getDescription = function () { return (!description ? TestFixture.DefaultDescription : description) }
	this.getTests = function () { return tests }
}

TestFixture.DefaultDescription = 'Test Fixture';