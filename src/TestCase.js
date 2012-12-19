JTF.namespaceAtRoot(function (JTF) {

	JTF.TestCase = function (test) {
		this.addCase = function () {
			test.apply(null, arguments);
			return this;
		};
	}

});