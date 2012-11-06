loadResources('test-fixtures.js', 'assertions.js', function () {

	new autoRunTestFixtureToConsole('Assertion tests', {

		'assert should not throw an AssertException for true conditions': function () {
			try {
				assert(true);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assert should throw an AssertException for false conditions': function () {
			try {
				assert(false, 'Should fail'); // need cases
			}
			catch (e) {
				assertInstance(e, AssertException);
				assertEqual(e.getInfo(), 'Should fail');
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assertEqual should not throw an AssertException for true conditions': function () {
			try {
				assertEqual(true, true);
				assertEqual(1, 1);
				assertEqual('abc', 'abc');
				assertEqual('abc', "abc");
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assertEqual should throw an AssertException for false conditions': function () {
			try {
				assertEqual(true, false, 'Should fail'); // need cases
				//assertEqual(1, '1', 'Should fail');
				//assertEqual(false, 0, 'Should fail');
			}
			catch (e) {
				assertInstance(e, AssertException);
				assertEqual(e.getInfo(), 'Should fail');
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assertEquiv should not throw an AssertException for true conditions': function () {
			try {
				assertEquiv(true, 1);
				assertEquiv(false, "0");
				assertEquiv('1', 1);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assertEquiv should throw an AssertException for false conditions': function () {
			try {
				assertEquiv(true, false, 'Should fail'); // need cases
				//assertEquiv(false, 'false', 'Should fail');
				//assertEquiv(true, 10, 'Should fail');
			}
			catch (e) {
				assertInstance(e, AssertException);
				assertEqual(e.getInfo(), 'Should fail');
				return;
			}
			throw new Error('Test should not have thrown this error');
		},

		'assertInstance should not throw an AssertException for true conditions': function () {
			try {
				assertInstance(new AssertException(), AssertException);
				assertInstance(new Object(), Object);
			}
			catch (e) {
				throw new Error('Test should not have thrown this error');
			}
		},

		'assertInstance should throw an AssertException for false conditions': function () {
			try {
				assertInstance(new AssertException(), Error, 'Should fail'); // need cases
				//assertInstance(new Object(), String, 'Should fail');
			}
			catch (e) {
				assertInstance(e, AssertException);
				assertEqual(e.getInfo(), 'Should fail');
				return;
			}
			throw new Error('Test should not have thrown this error');
		}

	});
});