JTF.namespaceAtRoot(function (JTF) {

	JTF.TestCaseFixture = function (test) {
		this.addCase = function () {
			test.apply(null, arguments);
			return this;
		};
	}

	JTF.TestCase = function (test) {
		return new JTF.TestCaseFixture(test);
	}

});