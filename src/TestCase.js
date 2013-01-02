JTF.namespaceAtRoot(function (JTF) {

	JTF.TestCaseFixture = function (test) {
		//var setup;
		this.addCase = function () {
			//if (setup) setup();
			test.apply(null, arguments);
			return this;
		};
		//this.addSetup = function (func) {
		//	setup = func;
		//	return this;
		//};
	};

	JTF.TestCase = function (test) {
		return new JTF.TestCaseFixture(test);
	};

});