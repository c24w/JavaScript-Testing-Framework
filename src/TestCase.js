JTF.namespaceAtRoot(function (root) {

	root.TestCase = function (/* case(s), test */) {
		var lastIndex = arguments.length - 1;
		var test = arguments[lastIndex];
		var cases = Array.prototype.slice.call(arguments, 0, lastIndex);
		for (var i = 0; i < cases.length; i++)
			test.apply(this, cases[i]);
	}

});