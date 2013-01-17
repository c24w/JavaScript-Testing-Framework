JavaScript Testing Framework
============================

Test JavaScript using JavaScript.  Built for Google Chrome.

Typical set-up
--------------

Example directory structure:

	PROJECT
	└───testing
		├───JTF
		│	└───src
		│			utils.js
		│			framework.js
		│			...
		└───tests
				my_tests.html
				my_tests.js
				...

_my\_tests.html_

	<html data-frameworkBaseURL="../JTF/src/">
	<head>
		<title>JavaScript Testing Framework Tests</title>
		<script src="../JTF/src/utils.js" type="text/javascript"></script>
		<script src="../JTF/src/framework.js" type="text/javascript"></script>
		<script src="my_tests.js" type="text/javascript"></script>
	</head>
	<body>
	</body>
	</html>

Where `data-frameworkBaseURL` is the path to the framework src directory.

_my\_tests.js_

	JTF.loadFramework(function () {
		JTF.loadHtmlResources(function () {

			var Assert = JTF.Assert;

			var fixture = new JTF.TestFixture('My tests', {

				'First test': function () {
					Assert.that(1).equals(2 - 1);
				},

				'Second test': function () {
					Assert.equiv(1, '1');
				}
		
			});

			var config = {
				collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
				showPassedFixtures: true,
				notifyOnFail: false,
				runInterval: 10000
			};

			JTF.runToHtml(fixture, config);

		});
	});

Components
----------

- [TestFixture](#testfixture) - a collection of tests
- [TestCase](#testcase) - varying scenarios for an individual test
- [TestHandler](#testhandler) - receives test events/data from a TestRunner
- [TestRunner](#testrunner) - runs TestFixtures, passing events/data to a TestHandler

_(Example code in the following sections may have prerequisites - see [Typical set-up](#typical-set-up).)_

### TestFixture

#### Usage

	new TestFixture( String description, Object tests )

`String description` - high-level description of behaviour being tested in the fixture.

`Object tests` - object containing functions which represent tests.  For example:

	var tests = {
		'Test name 1': function () { /* assertions etc */ },
		'Test name 2': function () { /* assertions etc */ }
		// ...
	};

#### Setup functions

The following test names are reserved for specific behaviour, which apply regardless of where they appear in the fixture:

`FIXTURE_SETUP` - executed once before any tests or other setups in the fixture.

`TEST_SETUP` - executed once just before each test in the fixture.  Does not currently execute between [TestCase](#testcase) cases.

#### Notes

Function names must be unique within an object - functions will overwrite previously declared functions of the same name.  Therefore, test/setup functions will overwrite previously declared functions of the same name.

#### Example

	function Counter() {
		var value = 0;
		this.getValue = function () { return value; };
		this.increment = function () { value++; };
		this.reset = function () { value = 0; };
	}

	var counter, value, Assert;

	new JTF.TestFixture('Counter tests', {

		FIXTURE_SETUP: function () {
				Assert = JTF.Assert;
				value = function () { return counter.getValue(); };
		},

		TEST_SETUP: function () {
			counter = new Counter();
		},

		'Should be able to get value': function () {
			Assert.equal(value(), 0);
		},

		'Should be able to increment value by one': function () {
			counter.increment();
			Assert.equal(value(), 1);
		},

		'Should be able to reset value to zero': function () {
			counter.increment();
			counter.reset();
			Assert.equal(value(), 0);
		}
	
	});

### TestCase

#### Usage

TestCase( Function test )
	.addCase( arguments )
	.addCase( arguments )
	...

`Function test` - delegation to an assertion function or a more complex custom function.

_`arguments` - comma-delimited arguments to be passed to the test function.

#### Example

	var Assert = JTF.Assert;

	new JTF.TestFixture('My first TestCases', {

		'Simple delegation to Assert.equiv': function (TestCase) {
			TestCase(Assert.equiv)
				.addCase(0, false)
				.addCase(1, '1')
				.addCase('not', 'equiv', 'expected to fail');
		},

		'Custom test function': function (TestCase) {
			TestCase(function (numbers) {
				var total = 0;
				numbers.forEach(function (n) { total += n; });
				Assert.that(total).is.less.than(10);
			})
			.addCase([1, 2])
			.addCase([1, 2, 3])
			.addCase([1, 2, 3, 4]);
		}
	
	};

### TestHandler

#### Usage

	new TestHandler( Object configuration )

`Object configuration` - key/value pairs defining configuration, specific to that test handler.

#### Notes

Must contain a handle function and then be passed to the [TestRunner](#testrunner)'s `run` function, to receive and handle [test events](#test-events).

#### Example

	new JTF.HTML.TestHandler({
		collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
		showPassedFixtures: true,
		notifyOnFail: false,
		runInterval: 10000
	});

#### Custom TestHandlers

	CustomTestHandler = function (optionalConfig) {

		setUpWithConfig(optionalConfig);

		this.handle = function (event) {
			var EVT = JTF.EVENT;
			var args = Array.prototype.slice.call(arguments, 1);
			switch (event) {
				case EVT.BATCH.START:
					beginBatch();
					break;
				case EVT.FIXTURE.START:
					createFixture();
					break;
				case EVT.FIXTURE.DESC:
					addDescription(args[0]);
					break;
				case EVT.TEST.SETUP.ERROR:
					handleTestError(args[0]);
					break;
				case EVT.TEST.PASS:
					handlePassedTest(args[0]);
					break;
				case EVT.TEST.FAIL:
					handleFailedTest(args[0], args[1]);
					break;
				case EVT.TEST.ERROR:
					handleTestError(args[0], args[1]);
					break;
				case EVT.FIXTURE.ERROR:
					handleFixtureError(args[0]);
					break;
				case EVT.FIXTURE.STATS:
					handleStats(args[0], args[1]);
					break;
				case EVT.FIXTURE.END:
					showFixture();
					break;
				case EVT.BATCH.END:
					batchEnd();
					break;
			}
		};

	};

	new CustomTestHandler({
		configurable_bool: true,
		configurable_int: ENUM.STATIC.VALUE
		// ...
	});

### TestRunner

### Usage

	new TestRunner( TestFixture testFixture ).run( TestHandler );
	// or
	new TestRunner( Array testFixtures ).run( TestHandler );

#### Example

	var testFixture = new JTF.TestFixture('Test fixture', {
		'Test': function () {
			JTF.Assert.greater(2, 1);
		}
	});

	var testHandler = new JTF.HTML.TestHandler({ runInterval: 10000 });

	new JTF.TestRunner(testFixture).run(testHandler);

### Sugary alternatives

	JTF.runToHtml( TestFixture testFixture, optionalConfig );
	// or
	JTF.runToHtml( Array testFixtures, optionalConfig );

### Test Events

#### Usage

The [TestRunner](#testrunner) calls the `handle` function of a [TestHandler](#testhandler), where the first argument is the event (such as an enum reference) and any subsequent arguments are associated data:

	myTestHandler.handle( event, data )

#### Example

	myTestHandler.handle(JTF.EVENT.FAIL, testName, failMessage);

#### Events & data

<table>
<tr>
	<th>Event</th>
	<th>Additional argument(s)</th>
</tr>
<tr>
	<td><code>BATCH.START</code></td>
	<td>-</td>
</tr>
<tr>
	<td><code>BATCH.END</code></td>
	<td>-</td>
</tr>
<tr>
	<td><code>FIXTURE.START</code></td>
	<td>-</td>
</tr>
<tr>
	<td><code>FIXTURE.DESC</code></td>
	<td><code>String</code><code><em>description</em></code></td>
</tr>
<tr>
	<td><code>FIXTURE.STATS</code></td>
	<td><code>Number</code><code><em>passes</em></code><br>
		<code>Number</code><code><em>fails</em></code></td>
</tr>
<tr>
	<td><code>FIXTURE.ERROR</code></td>
	<td><code>Object</code><code><em>error</em></code></td>
</tr>
<tr>
	<td><code>FIXTURE.END</code></td>
	<td>-</td>
</tr>
<tr>
	<td><code>TEST.PASS</code></td>
	<td><code>String</code><code><em>testName</em></code></td>
</tr>
<tr>
	<td><code>TEST.FAIL</code></td>
	<td><code>String</code><code><em>testName</em></code><br>
		<code>String</code><code><em>failMessage</em></code></td>
</tr>
<tr>
	<td><code>TEST.ERROR</code></td>
	<td><code>Object</code><code><em>error</em></code></td>
</tr>
</table>