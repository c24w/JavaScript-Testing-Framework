(function (ctx) {
	function buildMessage(assertType, actual, expected) {
		return '{0} - expected: {1} found: {2}'.format(assertType, expected, actual);
	}

	function areTheSameType(obj1, obj2) {
		return typeof obj1 === typeof obj2;
	}

	function encloseInType(obj) {
		if (obj === null || typeof obj === 'undefined') return obj;
		return obj.constructor.name + '(' + obj + ')';
	}

	function AssertThat(subject) {
		var A = Assert;
		var AN = A.not;
		this.throws = function (exception) { return A.throws(subject, exception) },
		this.does = { not: { 'throw': function (exception) { Assert.not.throws(subject, exception) } } },
		this.equals = function (expected) { A.equal(subject, expected) },
		this.is = {
			'true': function () { A.true(subject) },
			'false': function () { A.false(subject) },
			'null': function () { A.null(subject) },
			equiv: { to: function (expected) { A.equiv(subject, expected) } },
			greater: { than: function (expected) { A.greater(subject, expected) } },
			less: { than: function (expected) { A.less(subject, expected) } },
			instance: { of: function (objClass) { A.instance(subject, objClass) } },
			type: function (type) { A.type(subject, type) },
			not: {
				'null': function () { AN.null(subject) },
				equal: { to: function (expected) { AN.equal(subject, expected) } },
				equiv: { to: function (expected) { AN.equiv(subject, expected) } },
				instance: { of: function (objClass) { AN.instance(subject, objClass) } },
				type: function (type) { AN.type(subject, type) },
			}
		}
	}

	function AssertException(message) {
		this.message = message;
	}

	ctx.AssertException = AssertException;

	ctx.DEFAULT_FAIL_MESSAGE = 'no additional information';

	ctx.that = function (subject) {
		return new AssertThat(subject);
	}

	ctx['true'] = function (condition, optionalInfo) {
		if (condition === null)
			throw new AssertException('assert condition was null');
		if (!condition) {
			var info = optionalInfo ? optionalInfo : ctx.DEFAULT_FAIL_MESSAGE;
			throw new AssertException(info);
		}
	}

	ctx['false'] = function (condition, optionalInfo) {
		ctx.true(!condition, optionalInfo);
	}

	ctx['null'] = function (obj, optionalInfo) {
		var info = optionalInfo ? optionalInfo : 'Assert.null - argument was not null';
		ctx.equal(obj, null, info);
	}

	ctx.equal = function (actual, expected, optionalInfo) {
		var sameType = areTheSameType(actual, expected);
		var act = sameType ? actual : encloseInType(actual);
		var exp = sameType ? expected : encloseInType(expected);
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equal', act, exp);
		ctx.true(actual === expected, info);
	}

	ctx.equiv = function (actual, expected, optionalInfo) {
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
		ctx.true(actual == expected, info);
	}

	function assertIsNumber(object, prefix) {
		JTF.Assert.instance(object, Number, '{0}: expected: {1} found: {2}'.format(prefix, typeof Number(), typeof object));
	}

	ctx.greater = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.greater - first argument');
		assertIsNumber(number2, 'Assert.greater - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.greater - {0} is not greater than {1}'.format(number1, number2);
		ctx.true(number1 > number2, info);
	}

	ctx.less = function (number1, number2, optionalInfo) {
		assertIsNumber(number1, 'Assert.less - first argument');
		assertIsNumber(number2, 'Assert.less - second argument');
		var info = optionalInfo ? optionalInfo : 'Assert.less - {0} is not less than {1}'.format(number1, number2);
		ctx.true(number1 < number2, info);
	}

	ctx.instance = function (obj, objClass, optionalInfo) {
		try {
			ctx.true(obj instanceof objClass, info);
		}
		catch (e) {
			var actualClass = obj.constructor.name;
			var expectedType = objClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.instance', actualClass, expectedType);
			ctx.equal(actualClass, expectedType, info);
		}
	}

	ctx.type = function (obj, type, optionalInfo) {
		var actualType = typeof obj;
		var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, type);
		ctx.equal(actualType, type, info);
	}

	ctx.throws = function (func, exception, optionalInfo) {
		try {
			func();
		}
		catch (e) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.throws', e.name, exception.name);
			ctx.instance(e, exception, info);
			return e;
		}
		var info = optionalInfo ? optionalInfo : exception.name + ' was never thrown';
		throw new AssertException(info);
	}

	var Assert = ctx;

	ctx.not = (new function () {

		this['null'] = function (obj, optionalInfo) {
			var info = optionalInfo ? optionalInfo : 'Assert.not.null - argument was null';
			Assert.not.equal(obj, null, info);
		}

		this.equal = function (actual, expected, optionalInfo) {
			var sameType = areTheSameType(actual, expected);
			var act = sameType ? actual : encloseInType(actual);
			var exp = sameType ? expected : encloseInType(expected);
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.equal', act, 'not ' + exp);
			Assert.false(actual === expected, info);
		}

		this.equiv = function (actual, expected, optionalInfo) {
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.equiv', encloseInType(actual), encloseInType(expected));
			Assert.false(actual == expected, info);
		}

		this.instance = function (obj, objClass, optionalInfo) {
			var actualClass = obj.constructor.name;
			var expectedNotType = objClass.name;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.instance', actualClass, 'not ' + expectedNotType);
			Assert.not.equal(actualClass, expectedNotType, info);
		}

		this.type = function (obj, type, optionalInfo) {
			var actualType = typeof obj;
			var info = optionalInfo ? optionalInfo : buildMessage('Assert.type', actualType, 'not ' + type);
			Assert.not.equal(actualType, type, info);
		}

		this.throws = function (func, exception, optionalInfo) {
			try {
				func();
			}
			catch (e) {
				var info = optionalInfo ? optionalInfo : buildMessage('Assert.not.throws', e.constructor.name + ' was thrown', exception.name + ' not thrown');
				Assert.not.instance(e, exception, info);
			}
		}

	});

})(window.JTF.Assert = window.JTF.Assert || {});