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
		
			};

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

__Terminology__

* [TestFixture](#testfixture) - a collection of tests
* [TestCase](#testcase) - varying scenarios for an individual test
* [TestHandler](#testhandler) - receives test events/data from a TestRunner
* [TestRunner](#testrunner) - runs TestFixtures, passing events/data to a TestHandler

### `TestFixture`

##### Usage

	new TestFixture( string description, object tests )

> _tests ( object )_
> object containing functions, executed as tests
>
> Reserved test names:
> * FIXTURE_SETUP - executed once before anything else in the fixture.
> * TEST_SETUP - executed once before each test in the fixture.
>
> _Note: setup behaviour applies regardless of where they appear the fixture._

##### Example

	function Counter() {
		var value = 0;
		this.getValue = function () { return value; };
		this.increment = function (amount) { value += amount; };
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

		'Should be able to increment value': function () {
			counter.increment(5);
			Assert.equal(value(), 5);
		},

		'Should be able to reset value to zero': function () {
			counter.increment(5);
			counter.reset();
			Assert.equal(value(), 0);
		}
	
	});

### `TestCase`

#### Usage

	TestCase( function test )
		.addCase( arguments )
		.addCase( arguments )
		...

#### Example

	var Assert = JTF.Assert;

	new JTF.TestFixture('My first TestCases', {

		'Simple delegation to Assert.equiv': function (TestCase) {
			TestCase(Assert.equiv)
				.addCase(0, false)
				.addCase(1, '1')
				.addCase('not', 'equiv', 'expected to fail');
		},

		'Bespoke test function': function (TestCase) {
			TestCase(
				function (numbers) {
					var total = 0;
					numbers.forEach(function (n) { total += n; });
					Assert.that(total).is.less.than(10);
				}
			)
			.addCase([1, 2])
			.addCase([1, 2, 3])
			.addCase([1, 2, 3, 4]);
		}
	
	};

### `TestHandler`

#### Usage

	new TestHandler( object configuration )

#### Example

	new JTF.HTML.TestHandler({
		collapse: JTF.HTML.CONFIG.COLLAPSE.PASSES,
		showPassedFixtures: true,
		notifyOnFail: false,
		runInterval: 10000
	});

#### Creating a custom `TestHandler`

	CustomTestHandler = function (optionalConfig) {

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
					if(optionalConfig.ShowPassedTests === true)
						addPassedTest(args[0]);
					break;
				case EVT.TEST.FAIL:
					addFailedTest(args[0], args[1]);
					break;
				case EVT.TEST.ERROR:
					handleTestError(args[0]);
					break;
				case EVT.FIXTURE.ERROR:
					handleFixtureError(args[0]);
					break;
				case EVT.FIXTURE.STATS:
					addStats(args[0], args[1]);
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

__Test Events__

The `TestRunner` will call `TestHandler.handle`, where the first argument passed is the event and any subsequent arguments contain associated data.
<table>
<tr><th>Event</th><th>Additional argument(s)</th></tr>
<tr><td>BATCH.START</td><td>-</td></tr>
<tr><td>BATCH.END</td><td>-</td></tr>
<tr><td>FIXTURE.START</td><td>-</td></tr>
<tr><td>FIXTURE.DESC</td><td><em>string</em> description</td></tr>
<tr><td>FIXTURE.STATS</td><td><em>integer</em> passes, <em>integer</em> fails</td></tr>
<tr><td>FIXTURE.ERROR</td><td><em>object</em> error/exception</tr>
<tr><td>FIXTURE.END</td><td>-</td></tr>
<tr><td>TEST.PASS</td><td><em>string</em> test name</td></tr>
<tr><td>TEST.FAIL</td><td><em>string</em> test name, <em>string</em> error message</td></tr>
<tr><td>TEST.ERROR</td><td><em>object</em> error/exception</tr>
</table>

### `TestRunner`

#### Usage

	new TestRunner( array of TestFixture or TestFixture ).run( TestHandler );

#### Example

	var testFixture = new JTF.TestFixture('Test fixture', {
		'Test': function () {
			JTF.Assert.greater(2, 1);
		}
	});

	var testHandler = new JTF.HTML.TestHandler({ runInterval: 10000 });

	new JTF.TestRunner(testFixture).run(testHandler);

### Sugary alternatives

	JTF.runToHtml( array of TestFixture or TestFixture, JTF.HTML.TestHandler configuration object );
